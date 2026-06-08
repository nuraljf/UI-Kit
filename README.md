# UI'Kit — Liquid Glass

A **glassmorphism ("liquid glass") UI kit** replicated **1:1** from the Figma
frame [`UI'Kit`](https://www.figma.com/design/qZsmToavDcmKh6HhfdRiFP/UI-Kit?node-id=117-5),
built with **Next.js · React · TypeScript · Tailwind CSS · transitions.dev ·
React Three Fiber (Three.js)**.

The glass is real WebGL: a single React Three Fiber canvas renders the
sunset-over-snow backdrop and a custom GLSL shader that applies genuine
rounded-rect **refraction, edge highlights and frost blur** to every panel.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build && npm start` for a production build.

## How the liquid glass works

Unlike a CSS `backdrop-filter`, the glass here is rendered in WebGL so it can
truly bend the light behind it:

1. **One full-screen R3F canvas** (`components/glass/LiquidGlassCanvas.tsx`)
   sits behind the UI. Its fragment shader draws the exact Figma backdrop
   gradient, then for every glass panel computes a rounded-box SDF and:
   - **refracts** the backdrop near the bevelled edges (lens distortion),
   - adds a **frosted blur** (multi-tap sample),
   - paints the **translucent tint** (light / dark / subtle / ghost),
   - and lays in the **inner-highlight rim** matching Figma's inset stroke.
2. **Every DOM panel registers its live bounding box** through a React context
   (`GlassContext` + `useGlass`). The shader reads those rects each frame, so
   the glass tracks the DOM exactly — including hover/press transforms.
3. The **DOM layer on top** carries the text, icons, drop-shadows and all
   interaction/accessibility. Glass surfaces paint no background of their own.

## Motion — transitions.dev

Interaction motion follows the [transitions.dev](https://transitions.dev)
convention: semantic motion custom properties on `:root` plus portable `t-*`
transition classes (`t-press`, `t-fade`), guarded by
`@media (prefers-reduced-motion: reduce)`. See `app/globals.css`.

## Components

| Component                | File                              | Figma            |
| ------------------------ | --------------------------------- | ---------------- |
| `Button` / `IconButton`  | `components/ui/Button.tsx`        | button / small   |
| `ButtonGroup`            | `components/ui/ButtonGroup.tsx`   | button group     |
| `Segmented`              | `components/ui/Segmented.tsx`     | numbered group   |
| `ActionsCard`            | `components/ui/ActionsCard.tsx`   | actions          |
| `GhostCircle`            | `components/ui/GhostCircle.tsx`   | center circle    |
| `Glass` (primitive)      | `components/glass/Glass.tsx`      | glass + stroke   |

Variants: `light`, `dark`, `dark-strong`, `subtle`, `ghost`. Radii: `16` (default),
`34` (pill), `64` (circle). All eighteen elements are placed at their exact
Figma coordinates in `app/page.tsx`, on a responsively-scaled 1440×1024 stage.

## Project layout

```
app/
  layout.tsx          Geist font + metadata
  page.tsx            the 1:1 stage with all 18 elements
  globals.css         tokens + transitions.dev t-* utilities
components/
  glass/              Stage, GlassContext, useGlass, Glass, LiquidGlassCanvas
  ui/                 Button, ButtonGroup, Segmented, ActionsCard, GhostCircle
  icons.tsx           Plus / Selector (currentColor)
legacy/               original zero-dependency HTML/CSS version
```

## Note on the backdrop

The original Figma photo
(`breathtaking-view-forest-covered-with-snow-sunset-norway`) is served from a
host the build environment blocks, so the shader reproduces its exact gradient
palette. To use the real photo, sample it into a `THREE.Texture` and replace the
`background()` function's gradient in `LiquidGlassCanvas.tsx`.
