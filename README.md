# Figma Plugin — Arrow Connector

A no-UI Figma plugin that draws a styled arrow between two selected frames.

> **Note on ConnectorNode:** Both `figma.createConnector()` and `ConnectorNode.clone()` are blocked in Figma Design files by the Figma API. The plugin draws a vector arrow (shaft + arrowhead) and reads stroke style from a saved template node.

## Setup (optional — for custom style)

1. Draw or select any node in Figma with the stroke style you want (colour, weight)
2. Run **"Set source arrow"** from the command palette (`Cmd/Ctrl + /`)
3. The stroke style is saved via `figma.clientStorage` — persists across sessions

If you skip this step, the plugin uses a default 2px near-black arrow.

## Usage

1. Select **two frames** (source first, target second)
2. `Cmd/Ctrl + /` → **"Connect frames with arrow"** → Enter

The plugin draws a straight arrow from the centre of the first frame to the centre of the second, grouped as `Arrow: [source] → [target]`.

## Commands

| Command | Select | Effect |
|---|---|---|
| Set source arrow | Any styled node | Saves its stroke colour + weight |
| Connect frames with arrow | Two frames/nodes | Draws a vector arrow between them |

## Default arrow style

| Property | Value |
|---|---|
| Stroke weight | 2px |
| Colour | `#1A1A1A` (near-black) |
| Arrowhead length | 12px |
| Arrowhead width | 8px |

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
