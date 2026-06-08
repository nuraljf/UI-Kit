# UI'Kit — Liquid Glass

A reusable **glassmorphism** ("liquid glass") component kit, replicated **1:1**
from the Figma frame [`UI'Kit`](https://www.figma.com/design/qZsmToavDcmKh6HhfdRiFP/UI-Kit?node-id=117-5).
Zero dependencies — pure HTML + CSS, with a tiny optional JS interaction layer.

> Buttons, pills, icon buttons, button groups, segmented controls and action
> cards rendered as liquid glass on a sunset-over-snow backdrop — open
> `index.html` to see it.

## Quick start

Open `index.html` in a browser to see the full kit on its stage, or run a local
server:

```bash
npm start          # serves the folder at http://localhost:3000
```

To use the components in your own project, link the bundle and apply the
classes:

```html
<link rel="stylesheet" href="css/ui-kit.css" />

<button class="ui-btn glass is-interactive">Button</button>
<button class="ui-btn glass glass--dark is-interactive">Button</button>
<button class="ui-btn glass r-pill is-interactive">Pill</button>
```

## How the glass works

Every surface is a `.glass` element. It reproduces the two Figma layers exactly:

- **blur + tint** (`::before`) — `backdrop-filter: blur(1.5px)` over a translucent fill
- **inner highlight** (`::after`) — three inset shadows that form the glass edge
- plus the drop shadow each surface casts.

Compose a structural class + a tint variant:

| Class            | Effect                                            |
| ---------------- | ------------------------------------------------- |
| `glass`          | base, light frosted tint `rgba(255,255,255,.65)`  |
| `glass--dark`    | dark tint `rgba(0,0,0,.65)`, light text           |
| `glass--subtle`  | faint tint `rgba(255,255,255,.4)`                 |
| `glass--ghost`   | near-transparent `rgba(255,255,255,.1)`           |
| `r-pill`         | pill radius (34px)                                |
| `r-circle`       | circle radius (64px)                              |
| `is-interactive` | hover / press / focus animations                  |

## Components

- **Buttons** — `.ui-btn` (default / `--sm` / `--icon` / `--circle`)
- **Button groups** — `.ui-group` with a `.ui-group__dropdown` handle
- **Segmented controls** — `.ui-group.ui-segmented` (click to select)
- **Action cards** — `.ui-actions` with icon + title + description

All eighteen elements from the Figma frame are reproduced at their exact
coordinates in `index.html`.

## Customizing — tokens & animations

Everything is driven by CSS custom properties in [`css/tokens.css`](css/tokens.css).
Override them anywhere to re-skin or re-time the kit:

```css
:root {
  --ui-radius: 12px;        /* tighter corners        */
  --ui-glass-blur: 3px;     /* heavier frost          */
  --ui-speed: 0.3s;         /* slower animations      */
  --ui-press-scale: 0.94;   /* deeper press           */
  --ui-hover-scale: 1.03;   /* bigger hover pop        */
}
```

## File layout

```
css/
  tokens.css       design tokens (colors, radii, blur, motion)
  glass.css        the .glass surface system + variants
  components.css   buttons, groups, segmented, action cards
  showcase.css     1:1 demo stage layout + background
  ui-kit.css       library bundle (tokens + glass + components)
js/
  ui-kit.js        responsive stage scaling + segmented selection
assets/            background photo slot (see note below)
index.html         the 1:1 showcase
```

## Note on the background

The Figma frame sits on a photo
(`breathtaking-view-forest-covered-with-snow-sunset-norway`). It could not be
downloaded into this build because the environment's network policy blocks
`figma.com`, so the showcase ships with a faithful **sunset-over-snow CSS
gradient** stand-in. To use the real photo:

1. Drop it at `assets/background.jpg`.
2. Uncomment the `background-image` line in `css/showcase.css` (`.stage__bg`).

## Versioning

Push versions of the kit with the standard npm flow:

```bash
npm run release:patch   # 0.1.0 -> 0.1.1
npm run release:minor   # 0.1.0 -> 0.2.0
npm run release:major   # 0.1.0 -> 1.0.0
```
