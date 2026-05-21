# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server on localhost:5173
npm run build     # Type-check (vue-tsc) then production build to dist/
npm run preview   # Preview production build
```

## Architecture

This is a greenfield **Vue 3 + Three.js** immersive web application — a "retro-futurist celestial cartography" visualization of 43 Chengdu sci-fi landmarks rendered as a 3D multi-layer orrery.

### Rendering Stack

Two parallel render systems compose the final frame:

- **WebGL (Three.js)**: scene background `#000a16`, 2000-particle starfield, 50 procedural dashed ellipses (counter-rotating), 43 node sprites (geometric symbols like ✦▲▼● with per-type colors), 30 structural edges with marching-ants animation, cluster orbits, and UnrealBloomPass for glow on CORE/MUSEUM/EXHIBITION node symbols.
- **CSS2DRenderer overlay**: DOM text labels positioned in 3D space for sharp Chinese text (Noto Serif SC Bold for names, IBM Plex Sans Light for addresses). Labels fade with camera distance.

### Z-Depth Encoding (Multi-Layer Orrery)

Nodes are positioned in 3D with Z-depth determined by type:

| Z | Types |
|---|-------|
| +20 | CORE |
| +10 | MUSEUM, EXHIBITION |
| 0 | COMPANY, BOOKSTORE, LIBRARY |
| -5 | ASSOCIATION, RESEARCH |
| -10 | SUPPLY, OLD_SUPPLY |
| -20 | LOST_PLACE |

Color temperature shifts from warm gold (`#FFD700`) at positive Z to ghostly blue-gray (`#6B7B8D`) at negative Z.

### Component Tree

```
App.vue (coordination hub — imports data.json statically, wires events)
├── UniverseCanvas.vue    ← Owns the full Three.js lifecycle (scene, camera, renderers, controls, animation loop, post-processing). Emits hover-node, focus-node, camera-mode-change.
├── Sidebar.vue           ← Search + grouped node list, two-way binding with canvas hover
├── Compass.vue           ← Pure CSS art (concentric rings, octagram star, N/S/W/E)
├── TitleBlock.vue        ← "成都科幻地图" + crew credits
├── Legend.vue            ← 10 symbol types in grid
├── NodeTooltip.vue       ← Ivory bg / dark text, positioned at mouse
├── ConnectorSvg.vue      ← SVG polyline elbow from tooltip to node
└── NoiseOverlay.vue      ← Procedural canvas noise, opacity 0.06, screen blend
```

### Three.js Module Map

All Three.js logic lives in `src/three/`, called imperatively by `UniverseCanvas.vue`:

| Module | Responsibility |
|--------|---------------|
| `scene.ts` | Scene, PerspectiveCamera (60° FOV), WebGLRenderer, ambient/point lights |
| `starfield.ts` | 2000 BufferGeometry particles, color variation (93% white, 5% gold, 2% blue) |
| `orbits.ts` | 22 procedural dashed ellipses with per-orbit rotation speed; `updateOrbitRotations()` called each frame |
| `postprocessing.ts` | EffectComposer + BloomEffect (postprocessing v6 API) |
| `nodes.ts` | THREE.Sprite creation with CanvasTexture symbols, per-type colors, CSS2D label creation |
| `edges.ts` | Structural edges with marching-ants (`updateEdgeMarchingAnts`), cluster orbits per type group |
| `camera.ts` | Camera state machine (FREE_ROAM/FLY_TO/LOCKED), GSAP arc-path fly-to with power3.inOut, idle micro-drift |
| `interaction.ts` | Raycaster hover/click detection on sprites, callback-based event wiring |

### Camera State Machine

```
FREE_ROAM ──(click node)──▶ FLY_TO ──(animation done)──▶ LOCKED
    ▲                          │                            │
    └────(user drag/scroll)────┘                            │
    ▲──────────────────(click empty in LOCKED)──────────────┘
```

- **FREE_ROAM**: MapControls enabled, user orbits/pans/zooms freely
- **FLY_TO**: GSAP-driven arc path (quadratic Bezier), controls disabled
- **LOCKED**: Gentle idle sine drift around target, controls disabled

### Data Flow

`resoures/data/data.json` (43 nodes, 30 edges, 2D coords with TUOCON at origin) → imported statically by `App.vue` via Vite JSON import → passed as prop to `Sidebar`. `UniverseCanvas` loads it via `fetch('/resoures/data/data.json')` for the Three.js scene. Two-way binding: sidebar hover ↔ canvas hover, sidebar click → canvas fly-to.

### Design Constraints

- No CSS gradients or box-shadows — 1px solid ivory (`#FDF5E6`) borders only
- Design tokens defined as CSS custom properties in `index.html` `:root`
- Noise overlay: procedural canvas generation, `mix-blend-mode: screen`, `opacity: 0.06`
- Fonts: Google Fonts (Noto Serif SC 400/700, IBM Plex Sans 300/400)
- Desktop-first, no mobile responsiveness
