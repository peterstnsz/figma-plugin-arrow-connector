// Arrow Connector Plugin
// Connects two selected frames/nodes using a ConnectorNode

figma.on('run', ({ command }: RunEvent) => {
  if (command === 'connectFrames') {
    connectWithArrow();
  }
});

function connectWithArrow(): void {
  const selection = figma.currentPage.selection;

  if (selection.length !== 2) {
    figma.notify('Please select exactly two frames or layers to connect.', { error: true });
    figma.closePlugin();
    return;
  }

  const [nodeA, nodeB] = selection;

  // Both nodes must be SceneNodes with connectable geometry
  if (!('x' in nodeA) || !('x' in nodeB)) {
    figma.notify('Selected items must be positioned nodes (frames, shapes, etc.)', { error: true });
    figma.closePlugin();
    return;
  }

  const connector = figma.createConnector();

  connector.connectorStart = {
    endpointNodeId: nodeA.id,
    magnet: 'AUTO',
  };

  connector.connectorEnd = {
    endpointNodeId: nodeB.id,
    magnet: 'AUTO',
  };

  // Style the connector as a clean arrow
  connector.connectorLineType = 'ELBOWED';

  connector.strokeWeight = 2;
  connector.strokes = [
    {
      type: 'SOLID',
      color: { r: 0.1, g: 0.1, b: 0.1 },
      opacity: 1,
    },
  ];

  connector.connectorStartStrokeCap = 'NONE';
  connector.connectorEndStrokeCap = 'ARROW_EQUILATERAL';

  // Add to the current page
  figma.currentPage.appendChild(connector);

  figma.notify(`Connected "${nodeA.name}" → "${nodeB.name}"`);
  figma.closePlugin();
}
