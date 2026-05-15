// Arrow Connector Plugin
// Clones a ConnectorNode (pasted from FigJam) and rewires it between two selected frames.
//
// Selection order:
//   1. The ConnectorNode template (pasted from FigJam)
//   2. The source frame (arrow starts here)
//   3. The target frame (arrow ends here)

figma.on('run', ({ command }) => {
  if (command === 'connectFrames') {
    connectWithArrow();
  }
});

function connectWithArrow() {
  const selection = figma.currentPage.selection;

  if (selection.length !== 3) {
    figma.notify(
      'Select 3 items in order: (1) ConnectorNode template, (2) source frame, (3) target frame.',
      { error: true }
    );
    figma.closePlugin();
    return;
  }

  const [template, nodeA, nodeB] = selection;

  if (template.type !== 'CONNECTOR') {
    figma.notify(
      'First selected item must be a ConnectorNode (paste one from FigJam first).',
      { error: true }
    );
    figma.closePlugin();
    return;
  }

  // Clone the connector to inherit all styling
  const connector = template.clone();

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
