# Figma Plugin — Arrow Connector

A no-UI Figma plugin that connects two selected frames with a directional arrow by cloning a `ConnectorNode` template pasted from FigJam.

> **Why this approach?** `figma.createConnector()` is FigJam-only. However, a ConnectorNode *pasted* from FigJam into Figma is valid and fully manipulable — so we clone it and rewire its endpoints.

## Setup (one time only)

1. Open a **FigJam** file and draw a connector arrow
2. Style it as you like (colour, weight, line type, arrowhead)
3. Copy + paste it into your **Figma Design** file
4. Select the pasted connector
5. Run **"Set source arrow"** from the command palette (`Cmd/Ctrl + /`)

The node ID is saved via `figma.clientStorage` — you only need to do this once per Figma client.

## Usage

1. Select **two frames** (source first, then target)
2. `Cmd/Ctrl + /` → **"Connect frames with arrow"** → Enter

The plugin clones the saved template, wires `connectorStart` and `connectorEnd` to your frames, and names the layer `Arrow: [source] \u2192 [target]`.

## Commands

| Command | What to select | Effect |
|---|---|---|
| Set source arrow | One ConnectorNode | Saves its ID as the template |
| Connect frames with arrow | Two frames/nodes | Clones template and connects them |

## Loading in Figma

1. Open Figma Desktop
2. **Plugins → Development → Import plugin from manifest…**
3. Select `manifest.json`

## File Structure

```
├── manifest.json   # Plugin manifest with two menu commands
├── code.ts         # TypeScript source
├── code.js         # Compiled JS (what Figma runs)
└── README.md
```

## Notes

- The template connector is never deleted — hide it off-canvas
- You can update the template any time by selecting a different ConnectorNode and re-running "Set source arrow"
- `figma.command` (not `figma.on('run', ...)`) is the correct API for branching menu commands in no-UI plugins
