// Arrow Connector Plugin
//
// Commands:
//   setSource      — select a ConnectorNode (pasted from FigJam) to use as the template
//   connectFrames  — select two frames; clones the saved template and wires them up

const STORAGE_KEY = 'connectorTemplateId';

async function setSource(): Promise<void> {
  const selection = figma.currentPage.selection;

  if (selection.length !== 1 || selection[0].type !== 'CONNECTOR') {
    figma.notify('Select exactly one ConnectorNode (pasted from FigJam) first.', { error: true });
    figma.closePlugin();
    return;
  }

  const connector = selection[0] as ConnectorNode;
  await figma.clientStorage.setAsync(STORAGE_KEY, connector.id);
  figma.notify(`Template saved: "${connector.name}"`);
  figma.closePlugin();
}

async function connectFrames(): Promise<void> {
  const templateId = await figma.clientStorage.getAsync(STORAGE_KEY);

  if (!templateId) {
    figma.notify('No template set. Run "Set source arrow" first.', { error: true });
    figma.closePlugin();
    return;
  }

  const template = figma.getNodeById(templateId as string);

  if (!template || template.type !== 'CONNECTOR') {
    figma.notify('Saved template not found. Run "Set source arrow" again.', { error: true });
    figma.closePlugin();
    return;
  }

  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.notify('Select exactly two frames to connect.', { error: true });
    figma.closePlugin();
    return;
  }

  const [nodeA, nodeB] = selection as SceneNode[];

  if (!('x' in nodeA) || !('x' in nodeB)) {
    figma.notify('Selected items must be positioned nodes (frames, shapes, etc.)', { error: true });
    figma.closePlugin();
    return;
  }

  const connector = (template as ConnectorNode).clone();

  connector.connectorStart = {
    endpointNodeId: nodeA.id,
    magnet: 'AUTO',
  };

  connector.connectorEnd = {
    endpointNodeId: nodeB.id,
    magnet: 'AUTO',
  };

  connector.name = `Arrow: ${nodeA.name} \u2192 ${nodeB.name}`;

  figma.currentPage.appendChild(connector);
  figma.notify(`Connected "${nodeA.name}" \u2192 "${nodeB.name}"`);
  figma.closePlugin();
}

// figma.command is the correct way to branch on menu commands (not figma.on('run'))
if (figma.command === 'setSource') {
  setSource();
} else if (figma.command === 'connectFrames') {
  connectFrames();
} else {
  figma.closePlugin();
}
