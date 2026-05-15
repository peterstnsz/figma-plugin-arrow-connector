// Arrow Connector Plugin
// Draws a line with an arrowhead between the centres of two selected nodes.
// ConnectorNode / figma.createConnector() is FigJam-only and unavailable in Figma Design.

figma.on('run', ({ command }: RunEvent) => {
  if (command === 'connectFrames') {
    connectWithArrow();
  }
});

function centre(node: SceneNode & { x: number; y: number; width: number; height: number }) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function connectWithArrow(): void {
  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.notify('Select exactly two frames or layers to connect.', { error: true });
    figma.closePlugin();
    return;
  }

  const [nodeA, nodeB] = selection as (SceneNode & { x: number; y: number; width: number; height: number })[];

  if (!('x' in nodeA) || !('x' in nodeB)) {
    figma.notify('Selected items must be positioned nodes (frames, shapes, etc.)', { error: true });
    figma.closePlugin();
    return;
  }

  const a = centre(nodeA);
  const b = centre(nodeB);

  // --- Arrow shaft (VectorNode line) ---
  const line = figma.createVector();

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Offset end point slightly so arrowhead tip sits at centre B
  const arrowLen = 12;
  const ex = b.x - (dx / len) * arrowLen;
  const ey = b.y - (dy / len) * arrowLen;

  line.vectorNetwork = {
    vertices: [
      { x: a.x, y: a.y },
      { x: ex, y: ey },
    ],
    segments: [
      { start: 0, end: 1 },
    ],
    regions: [],
  };

  line.strokeWeight = 2;
  line.strokes = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 }, opacity: 1 }];
  line.fills = [];

  // --- Arrowhead (equilateral triangle) ---
  const angle = Math.atan2(dy, dx);
  const headLen = arrowLen;
  const headWidth = 8;

  // Tip at centre B
  const tip = { x: b.x, y: b.y };
  const left = {
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
      { x: tip.x, y: tip.y },
      { x: left.x, y: left.y },
      { x: right.x, y: right.y },
    ],
    segments: [
      { start: 0, end: 1 },
      { start: 1, end: 2 },
      { start: 2, end: 0 },
    ],
    regions: [
      {
        windingRule: 'NONZERO',
        loops: [[0, 1, 2]],
      },
    ],
  };

  arrowHead.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 }, opacity: 1 }];
  arrowHead.strokes = [];

  // --- Group shaft + head ---
  const group = figma.group([line, arrowHead], figma.currentPage);
  group.name = `Arrow: ${nodeA.name} → ${nodeB.name}`;

  figma.notify(`Connected "${nodeA.name}" → "${nodeB.name}"`);
  figma.closePlugin();
}
