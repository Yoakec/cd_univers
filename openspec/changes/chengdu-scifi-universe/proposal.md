## Why

The 43 Chengdu sci-fi landmarks in `resoures/data/data.json` need a visual home that matches the ambition of the data — a retro-futurist celestial map that transforms geographic coordinates into a living 3D universe. The original 2D map design language ("复古未来主义天体制图学") is fully specified but not yet implemented. This change builds the complete immersive web experience: a Vue 3 + Three.js application that renders Chengdu's sci-fi geography as an explorable multi-layer orrery with procedural orbital systems, glowing node sprites, and a sharp typographic UI layer.

## What Changes

- **New**: Full Vue 3 + Three.js + GSAP web application from scratch
- **New**: Multi-layer 3D orrery with Z-depth encoding (CORE at Z=+20, LOST_PLACE at Z=-20)
- **New**: Procedural 4-layer orbital system (structural edges, cluster orbits, decorative dashed ellipses, background starfield)
- **New**: CSS2D label rendering for Chinese text with Noto Serif SC + IBM Plex Sans fonts
- **New**: Camera state machine (FREE_ROAM → FLY_TO → LOCKED) with GSAP arc-path animations
- **New**: 2D Vue UI layer (sidebar, compass, legend, title block, tooltips) positioned over WebGL canvas
- **New**: UnrealBloomPass post-processing for glowing node symbols
- **New**: Procedural noise texture overlay (0.06 opacity) for physical print feel
- **New**: 16-token CSS design system implementing the retro-futurist celestial cartography spec
- **Modified**: `resoures/data/data.json` — enriched from 4 edges to 15-20 edges

## Capabilities

### New Capabilities

- `universe-scene`: Three.js scene foundation — dark cyan background (#000a16), lighting, post-processing pipeline, and render loop managed by the useUniverse composable
- `orbital-system`: Four-layer orbital generation — structural edges from data, cluster orbits grouped by node type, 50 procedural counter-rotating dashed ellipses, and a 2000-particle starfield
- `node-rendering`: Dual-layer node visualization — WebGL sprites for geometric symbols with per-type colors and bloom, CSS2DRenderer overlay for Chinese text labels (name + address)
- `camera-controller`: Camera state machine with OrbitControls for free exploration, GSAP-driven arc-path fly-to animations (power3.inOut), and a locked observation mode
- `ui-panels`: Vue 3 overlay components — sidebar (search + node list), title block with crew credits, CSS-art compass, legend grid, and dynamic tooltips with SVG polyline connectors
- `design-tokens`: 16-color design token system, typography stack (Noto Serif SC Bold + IBM Plex Sans Light), procedural noise texture, and 1px solid ivory border UI conventions
- `interaction`: Raycaster-based hover/click detection bridging 3D scene events to Vue reactive state, enabling node selection, tooltip display, and camera fly-to triggering

## Impact

- **Dependencies added**: Vue 3, Three.js, @tweenjs/three (for OrbitControls), postprocessing (UnrealBloomPass), GSAP, Vite
- **New source tree**: `src/` directory with composables, Three.js modules, and Vue components
- **Entry point**: `index.html` with Vite dev server
- **Existing data**: `resoures/data/data.json` edges expanded, no node removal
- **Fonts**: Noto Serif SC (Google Fonts), IBM Plex Sans (Google Fonts) — loaded via CSS `@import`
