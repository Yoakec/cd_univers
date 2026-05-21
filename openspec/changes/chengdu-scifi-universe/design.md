## Context

The project is a greenfield immersive web application. There is no existing codebase to integrate with — we start from a blank Vite + Vue 3 scaffold. The only existing artifact is `resoures/data/data.json` (43 nodes, 4 edges) which defines the 2D coordinate system for Chengdu sci-fi landmarks with TUOCON at origin (0,0).

**Constraints:**
- All Chinese text must render sharply — drives the CSS2DRenderer decision
- The design system forbids CSS gradients and box-shadows (retro-cartographic aesthetic: 1px solid borders only)
- Node symbols must receive bloom while text stays sharp — drives the dual-layer WebGL + CSS2D approach
- The orbital system must feel alive, not static — drives procedural generation and counter-rotation

**Stakeholders:** Solo developer with AI-assisted workflow (Vibe Coding).

## Goals / Non-Goals

**Goals:**
- Render all 43 data.json nodes as 3D sprites positioned in a multi-layer orrery
- Generate a visually dense orbital system from sparse edge data (4 → 50+ decorative ellipses)
- Provide intuitive camera navigation: free orbit, click-to-fly, and locked observation
- Implement the full retro-futurist design system as specified (colors, typography, noise texture, 1px borders)
- Bridge Vue 3 reactivity with Three.js imperative rendering via a single composable

**Non-Goals:**
- Mobile responsiveness (desktop-first; mobile is a future concern)
- Real-time data updates (data.json is static, loaded once at startup)
- Server-side rendering or SEO
- Accessibility (ARIA labels, screen readers) — immersive art piece, not a data tool
- Multi-language support beyond Chinese/English as hardcoded in data

## Decisions

### D1: Custom useUniverse composable over TresJS/TroisJS

**Choice:** Write a vanilla Three.js integration wrapped in a Vue composable.

**Rationale:** TresJS adds an abstraction layer between us and Three.js that complicates post-processing (UnrealBloomPass requires direct access to the EffectComposer pipeline), CSS2DRenderer (needs separate DOM container management), and GSAP camera animations (need raw camera reference). The composable pattern gives us full control while exposing clean reactive state to Vue components.

**Alternatives considered:**
- TresJS: Nice Vue DX but fights us on post-processing and CSS2DRenderer
- React Three Fiber: Wrong framework; this is Vue 3 project
- Pure vanilla: Misses Vue reactivity benefits for UI panel sync

### D2: CSS2DRenderer for text, WebGL sprites for symbols

**Choice:** Two parallel render systems — CSS2DRenderer DOM overlay for text labels, standard THREE.Sprite for geometric node symbols.

**Rationale:** Chinese text in WebGL (via CanvasTexture) degrades at high zoom due to rasterization limits. CSS2DRenderer uses actual DOM elements positioned in 3D space — text is always sharp, styleable with full CSS (fonts, letter-spacing, etc.), and naturally accessible. The trade-off is managing a second renderer and a separate DOM tree. For 43 nodes this is well within performance bounds.

The geometric symbols stay in WebGL so UnrealBloomPass can make them glow. Text should never glow (illegible), symbols should.

### D3: Procedural orbit generation over hand-authored orbits

**Choice:** Generate 50 decorative elliptical orbits algorithmically with random parameters (semi-major axis, eccentricity, rotation, dash ratio, opacity, angular velocity).

**Rationale:** The data has only 4 edges. Hand-authoring 50+ orbits would be tedious and inflexible. Procedural generation creates organic density that feels cosmic rather than designed. Parameters are tuned visually (the "Vibe" approach) rather than derived mathematically.

Each orbit is an `EllipseCurve` → segmented `BufferGeometry` → `LineDashedMaterial` with per-orbit dash/gap customization. Half rotate clockwise, half counter-clockwise, at speeds of 0.01–0.05 rad/minute.

### D4: GSAP for camera animation over manual lerp or Three.js TWEEN

**Choice:** GSAP with `power3.inOut` easing.

**Rationale:** GSAP provides battle-tested easing functions, timeline composition (arc path → arrival pause → idle loop), and interrupt-safe animation cleanup. The fly-to arc is a quadratic Bezier where the control point is offset perpendicular to the view direction, creating a natural "pull back and sweep in" motion. Manual requestAnimationFrame lerp would require reinventing easing, interrupt handling, and chaining.

### D5: UnrealBloomPass over custom glow shader

**Choice:** Use the `postprocessing` library's `UnrealBloomPass` with selective bloom via layers or a separate bloom scene.

**Rationale:** UnrealBloomPass provides physically plausible bloom with threshold, strength, and radius controls out of the box. We can tune it to produce the "light gold glow" effect on node symbols without making the starfield or orbits radioactive. A custom shader would give more control but at significant development cost for marginal visual gain in this context.

### D6: Camera state machine with mode transitions

**Choice:** Three-state machine (FREE_ROAM, FLY_TO, LOCKED) with explicit transition rules.

**Rationale:** Prevents conflicting control inputs. When the user clicks a node, OrbitControls must surrender control to GSAP. When the animation completes, the camera enters LOCKED mode where gentle idle micro-drift replaces user orbit. Dragging or scrolling exits LOCKED back to FREE_ROAM. This is cleaner than trying to blend user input with animation.

## Data Flow

```
data.json ──load──▶ NodeRegistry (Map<id, NodeState>)
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
      createSprites  createLabels  createOrbits
      (WebGL)        (CSS2D)       (WebGL)
            │            │            │
            └────────────┼────────────┘
                         ▼
                   Scene Graph
                         │
                         ▼
              useUniverse composable
              ┌──────────┴──────────┐
              ▼                     ▼
         renderLoop           reactive refs
    (requestAnimationFrame)   (focusedNode, hoveredNode, cameraMode)
                                     │
                                     ▼
                              Vue components read
                              and react
```

## Component Tree

```
App.vue
├── UniverseCanvas.vue          ← hosts <canvas> + CSS2D container
│   └── (Three.js scene managed by useUniverse)
├── Sidebar.vue                 ← fixed top-right
├── TitleBlock.vue              ← fixed bottom-left
├── Compass.vue                 ← fixed left-middle
├── Legend.vue                  ← fixed bottom-right
├── NodeTooltip.vue             ← positioned dynamically at 2D screen coords
├── ConnectorSvg.vue            ← fullscreen transparent SVG for polyline
└── NoiseOverlay.vue            ← fullscreen, pointer-events: none
```

## Risks / Trade-offs

- **CSS2DRenderer label occlusion**: Labels don't depth-test against WebGL geometry. A label behind an orbit ring still renders on top. Mitigation: manually set CSS `opacity` based on projected Z-depth (fade labels when node is behind the camera or distant).
- **43 nodes × dual renderer**: Performance is fine for initial load, but if the dataset grows 5x we may need virtual scrolling or LOD. Current scale is safe.
- **Dashed ellipse math**: Three.js `LineDashedMaterial` computes dashes in screen space, so dash lengths vary with perspective. Mitigation: pre-compute dash segments by arc length rather than relying on the material's built-in dash system.
- **Chinese font loading**: Noto Serif SC is ~8MB for the full character set. Mitigation: use Google Fonts with `text=` parameter for known strings, or subset via Vite plugin. Fallback to system serif.
- **GSAP + OrbitControls contention**: If GSAP animation is interrupted mid-flight, the camera could end up in an undefined state. Mitigation: the camera state machine enforces clean transitions; all GSAP timelines are killed on mode change.
- **UnrealBloomPass performance**: Full-screen bloom pass is GPU-intensive at high resolutions. Mitigation: render at native resolution but use conservative bloom radius and strength; test on integrated GPUs.
