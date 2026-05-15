// Arrow Connector Plugin
// Draws a line with an arrowhead between the centres of two selected nodes.
// ConnectorNode / figma.createConnector() is FigJam-only and unavailable in Figma Design.

figma.on('run', ({ command }) => {
  if (command === 'connectFrames') {
    connectWithArrow();
  }
});

function centre(node) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function connectWithArrow() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.notify('Select exactly two frames or layers to connect.', { error: true });
    figma.closePlugin();
    return;
  }

  const [nodeA, nodeB] = selection;

  if (!('x' in nodeA) || !('x' in nodeB)) {
    figma.notify('Selected items must be positioned nodes (frames, shapes, etc.)', { error: true });
    figma.closePlugin();
    return;
  }

  const a = centre(nodeA);
  const b = centre(nodeB);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Offset end point so arrowhead tip sits at centre B
  const arrowLen = 12;
  const ex = b.x - (dx / len) * arrowLen;
  const ey = b.y - (dy / len) * arrowLen;

  // --- Shaft ---
  const line = figma.createVector();
  line.vectorNetwork = {
    vertices: [
      { x: a.x, y: a.y },
      { x: ex, y: ey },
    ],
    segments: [{ start: 0, end: 1 }],
    regions: [],
  };
  line.strokeWeight = 2;
  line.strokes = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 }, opacity: 1 }];
  line.fills = [];

  // --- Arrowhead ---
  const angle = Math.atan2(dy, dx);
  const headLen = arrowLen;
  const headWidth = 8;

  const tip   = { x: b.x, y: b.y };
  const left  = {
    x: b.x - headLen * Math.cos(angle) + headWidth / 2 * Math.sin(angle),
    y: b.y - headLen * Math.sin(angle) - headWidth / 2 * Math.cos(angle),
  };
  const right = {
    x: b.x - headLen * Math.cos(angle) - headWidth / 2 * Math.sin(angle),
    y: b.y - headLen * Math.sin(angle) + headWidth / 2 * Math.cos(angle),
  };

  const arrowHead = figma.createVector();
  arrowHead.vectorNetwork = {
    vertices: [
      { x: tip.x,   y: tip.y },
      { x: left.x,  y: left.y },
      { x: right.x, y: right.y },
    ],
    segments: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 0 },
    ],
    regions: [
      { windingRule: 'NONZERO', loops: [[0, 1, 2]] },
    ],
  };
  arrowHead.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 }, opacity: 1 }];
  arrowHead.strokes = [];

  // --- Group both into a named layer ---
  const group = figma.group([line, arrowHead], figma.currentPage);
  group.name = `Arrow: ${nodeA.name} \u2192 ${nodeB.name}`;

  figma.notify(`Connected "${nodeA.name}" \u2192 "${nodeB.name}"`);
  figma.closePlugin();
}
