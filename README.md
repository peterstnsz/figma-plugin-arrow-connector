# Figma Plugin — Arrow Connector

A no-UI Figma plugin that connects two selected frames (or any nodes) with a directional arrow using Figma's native `ConnectorNode` API.

## Features

- Select exactly two frames/layers and run the command to instantly draw an elbowed arrow connector between them
- Uses Figma's built-in `ConnectorNode` (same as the native connector tool) — fully editable after creation
- Arrow goes from the first selected item → second selected item
- Auto-magnet endpoints that snap to the nearest edge
- No plugin UI — runs entirely from the command palette

## Usage

1. Select two frames or layers in Figma
2. Open the command palette (`Cmd/Ctrl + /`)
3. Search for **"Connect frames with arrow"**
4. Hit Enter — done

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Figma desktop account

### Setup

```bash
# Clone the repo
git clone https://github.com/peterstnsz/figma-plugin-arrow-connector.git
cd figma-plugin-arrow-connector
```

No build step is required — `code.js` is the compiled output and is ready to use.

### Loading in Figma

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select the `manifest.json` file from this repo
4. The plugin will now appear under **Plugins → Development**

## Connector Styling Defaults

| Property | Value |
|---|---|
| Line type | Elbowed |
| Stroke weight | 2px |
| Stroke colour | `#1A1A1A` (near-black) |
| Start cap | None |
| End cap | Equilateral arrow |

You can change these defaults in `code.ts` / `code.js`.

## File Structure

```
├── manifest.json   # Plugin manifest — registers command palette entry
├── code.ts         # TypeScript source
├── code.js         # Compiled JS (what Figma actually runs)
└── README.md
```

## Notes

- `ConnectorNode` is only available in Figma (not FigJam) design files
- The `AUTO` magnet setting lets Figma pick the best attachment point automatically
- Selection order matters: the arrow points **from** the first selected item **to** the second
