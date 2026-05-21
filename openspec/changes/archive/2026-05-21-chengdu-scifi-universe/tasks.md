## 1. Project Scaffold & Data Enrichment

- [x] 1.1 Initialize Vite + Vue 3 + TypeScript project with package.json and vite.config.ts
- [x] 1.2 Add dependencies: three, @tweenjs/three, postprocessing, gsap
- [x] 1.3 Create index.html with dark cyan background and viewport meta
- [x] 1.4 Create TypeScript types for nodes/edges in src/data/types.ts
- [x] 1.5 Enrich resoures/data/data.json with 15-20 additional edges (ASSOCIATION constellation, bookstore adjacency, geographic proximity links)
- [x] 1.6 Create data loader utility in src/data/loader.ts

## 2. Three.js Scene Foundation

- [x] 2.1 Create useUniverse composable skeleton in src/composables/useUniverse.ts
- [x] 2.2 Implement scene setup with #000a16 background and ambient lighting in src/three/scene.ts
- [x] 2.3 Implement starfield particle system (2000 particles, color variation) in src/three/starfield.ts
- [x] 2.4 Implement procedural decorative orbit generator (50 counter-rotating dashed ellipses) in src/three/orbits.ts
- [x] 2.5 Set up EffectComposer + UnrealBloomPass in src/three/postprocessing.ts
- [x] 2.6 Create UniverseCanvas.vue component hosting <canvas> and CSS2D container
- [x] 2.7 Verify scene renders with starfield and decorative orbits visible

## 3. Node & Label Rendering

- [x] 3.1 Implement node sprite creation from data.json (WebGL THREE.Sprite with CanvasTexture symbols) in src/three/nodes.ts
- [x] 3.2 Apply per-type colors from design token system to sprite textures
- [x] 3.3 Implement Z-depth positioning by node type (CORE +20 through LOST_PLACE -20)
- [x] 3.4 Set up CSS2DRenderer and create label objects (name + address) with proper fonts
- [x] 3.5 Implement structural orbit rendering for data.json edges (glowing dashed lines)
- [x] 3.6 Implement cluster orbit generation (bounding ellipses per type group)
- [x] 3.7 Add Z-depth color temperature shift (warm at positive Z, cool at negative Z)
- [x] 3.8 Verify all 43 nodes render with symbols, labels, and correct Z positions

## 4. Camera & Interaction

- [x] 4.1 Implement OrbitControls setup with damping, distance limits, and angle constraints in src/three/camera.ts
- [x] 4.2 Implement camera state machine (FREE_ROAM, FLY_TO, LOCKED modes)
- [x] 4.3 Implement GSAP arc-path fly-to animation with power3.inOut easing
- [x] 4.4 Implement idle micro-drift animation for LOCKED mode
- [x] 4.5 Implement Raycaster hover detection with cursor change in src/three/interaction.ts
- [x] 4.6 Implement node click detection triggering fly-to
- [x] 4.7 Implement click-empty-space to return to FREE_ROAM from LOCKED
- [x] 4.8 Verify free orbit, click-to-fly, locked observation, and return-to-free all work

## 5. Vue UI Layer

- [x] 5.1 Create App.vue root layout with all overlay component slots
- [x] 5.2 Create Sidebar.vue with search input, filtered node list grouped by type, click-to-navigate
- [x] 5.3 Create TitleBlock.vue with "成都科幻地图" title and crew credits
- [x] 5.4 Create Compass.vue with pure CSS concentric rings, octagram star, and N/S/W/E labels
- [x] 5.5 Create Legend.vue with all 10 node type symbols in grid layout with ivory borders
- [x] 5.6 Create NodeTooltip.vue with ivory background, dark text, and name/address display
- [x] 5.7 Create ConnectorSvg.vue with fullscreen transparent SVG for polyline connectors
- [x] 5.8 Create NoiseOverlay.vue with procedurally generated canvas noise texture
- [x] 5.9 Implement sidebar-to-scene two-way binding (hover highlight both directions, click fly-to)
- [x] 5.10 Verify all panels render with correct retro-cartographic styling (1px ivory borders, no shadows/gradients)

## 6. Polish & Integration

- [x] 6.1 Load Noto Serif SC Bold and IBM Plex Sans Light from Google Fonts
- [x] 6.2 Apply design token system globally (CSS custom properties)
- [x] 6.3 Implement CSS2D label opacity falloff based on node Z-depth and camera distance
- [x] 6.4 Add GSAP idle micro-animations (slow orbit ring rotation, star twinkle)
- [x] 6.5 Handle window resize (renderer + camera aspect update)
- [x] 6.6 Test full user flow: browse → search → click node → fly-to → observe → back to free roam
- [x] 6.7 Performance check: verify 60fps with all orbital layers, bloom, and 43 nodes visible
