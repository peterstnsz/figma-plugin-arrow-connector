# Figma Plugin — Arrow Connector

A no-UI Figma plugin that connects two selected frames with a directional arrow by cloning a `ConnectorNode` template pasted from FigJam.

> **Why this approach?** `figma.createConnector()` is FigJam-only and not available in Figma Design files. However, a ConnectorNode *pasted* from FigJam into a Figma file is valid and fully editable — so we clone it and rewire its endpoints.

## One-Time Setup

1. Open a **FigJam** file
2. Draw any connector arrow
3. Copy it (`Cmd/Ctrl + C`)
4. Paste it into your **Figma Design** file (`Cmd/Ctrl + V`)
5. Leave it somewhere out of the way (e.g. a corner of the canvas or a dedicated page)

This pasted connector is your **template** — style it however you like (colour, weight, line type). Every arrow the plugin creates will inherit that style.

## Usage

1. Select **3 items in order**:
   - First: the **ConnectorNode template** (your pasted FigJam connector)
   - Second: the **source frame** (arrow starts here)
   - Third: the **target frame** (arrow ends here)
2. Open the command palette (`Cmd/Ctrl + /`)
3. Search **"Connect frames with arrow"** and hit Enter

The plugin clones the template, rewires both endpoints to your selected frames, and names the new layer `Arrow: [source] → [target]`.

## Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Figma desktop account

### Loading in Figma

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Select the `manifest.json` file from this repo

## File Structure

```
├── manifest.json   # Plugin manifest — registers command palette entry
├── code.ts         # TypeScript source
├── code.js         # Compiled JS (what Figma actually runs)
└── README.md
```

## Notes

- The template connector is **never deleted** — it stays as a reusable source
- You can keep multiple styled templates (thick, thin, dashed, etc.) and pick the one you want as your first selection
- Selection order matters: source → target determines arrow direction
