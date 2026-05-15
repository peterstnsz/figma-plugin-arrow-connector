// Arrow Connector Plugin
//
// Commands:
//   setSource      — select any styled node to save its stroke style as the arrow template
//   connectFrames  — select two frames; draws a vector arrow between their centres
//
// ConnectorNode.clone() and figma.createConnector() are both blocked in Figma Design.
// Instead we save the template's stroke style and draw a VectorNode arrow.

const STORAGE_KEY = 'arrowStyle';

interface ArrowStyle {
  strokeWeight: number;
  color: RGB;
  opacity: number;
}

const DEFAULT_STYLE: ArrowStyle = {
  strokeWeight: 2,
  color: { r: 0.1, g: 0.1, b: 0.1 },
  opacity: 1,
};

async function setSource(): Promise<void> {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1) {
    figma.notify('Select exactly one node to use as the arrow style template.', { error: true });
    figma.closePlugin();
    return;
  }

  const node = selection[0] as SceneNode & { strokes: ReadonlyArray<Paint>; strokeWeight: number };
  const strokes = node.strokes;
  const stroke = strokes && strokes.length > 0 ? strokes[0] : null;

  const style: ArrowStyle = {
    strokeWeight: node.strokeWeight || DEFAULT_STYLE.strokeWeight,
    color: (stroke && stroke.type === 'SOLID') ? (stroke as SolidPaint).color : DEFAULT_STYLE.color,
    opacity: (stroke && stroke.type === 'SOLID') ? ((stroke as SolidPaint).opacity ?? 1) : DEFAULT_STYLE.opacity,
  };

  await figma.clientStorage.setAsync(STORAGE_KEY, style);
  figma.notify(`Style saved from "${node.name}" — weight: ${style.strokeWeight}px`);
  figma.closePlugin();
}

async function connectFrames(): Promise<void> {
  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.notify('Select exactly two frames to connect.', { error: true });
    figma.closePlugin();
    return;
  }

  const [nodeA, nodeB] = selection as (SceneNode & { x: number; y: number; width: number; height: number })[];

  if (!('x' in nodeA) || !('x' in nodeB)) {
    figma.notify('Selected items must be positioned nodes.', { error: true });
    figma.closePlugin();
    return;
  }

  const savedStyle = await figma.clientStorage.getAsync(STORAGE_KEY) as ArrowStyle | undefined;
  const style: ArrowStyle = savedStyle || DEFAULT_STYLE;

  const ax = nodeA.x + nodeA.width / 2;
  const ay = nodeA.y + nodeA.height / 2;
  const bx = nodeB.x + nodeB.width / 2;
  const by = nodeB.y + nodeB.height / 2;

  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const HEAD_LEN = 12;
  const HEAD_WIDTH = 8;

  const ex = bx - (dx / len) * HEAD_LEN;
  const ey = by - (dy / len) * HEAD_LEN;

  const shaft = figma.createVector();
  shaft.vectorNetwork = {
    vertices: [{ x: ax, y: ay }, { x: ex, y: ey }],
    segments: [{ start: 0, end: 1 }],
    regions: [],
  };
  shaft.strokeWeight = style.strokeWeight;
  shaft.strokes = [{ type: 'SOLID', color: style.color, opacity: style.opacity }];
  shaft.fills = [];

  const HEAD_LEN_N = HEAD_LEN;
  const tip   = { x: bx, y: by };
  const left  = {
    x: bx - HEAD_LEN_N * Math.cos(angle) + (HEAD_WIDTH / 2) * Math.sin(angle),
    y: by - HEAD_LEN_N * Math.sin(angle) - (HEAD_WIDTH / 2) * Math.cos(angle),
  };
  const right = {
    x: bx - HEAD_LEN_N * Math.cos(angle) - (HEAD_WIDTH / 2) * Math.sin(angle),
    y: by - HEAD_LEN_N * Math.sin(angle) + (HEAD_WIDTH / 2) * Math.cos(angle),
  };

  const head = figma.createVector();
  head.vectorNetwork = {
    vertices: [{ x: tip.x, y: tip.y }, { x: left.x, y: left.y }, { x: right.x, y: right.y }],
    segments: [{ start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 0 }],
    regions: [{ windingRule: 'NONZERO', loops: [[0, 1, 2]] }],
  };
  head.fills = [{ type: 'SOLID', color: style.color, opacity: style.opacity }];
  head.strokes = [];

  const group = figma.group([shaft, head], figma.currentPage);
  group.name = `Arrow: ${nodeA.name} \u2192 ${nodeB.name}`;

  figma.notify(`Connected "${nodeA.name}" \u2192 "${nodeB.name}"`);
  figma.closePlugin();
}

if (figma.command === 'setSource') {
  setSource();
} else if (figma.command === 'connectFrames') {
  connectFrames();
} else {
  figma.closePlugin();
}
