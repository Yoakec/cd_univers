## ADDED Requirements

### Requirement: Scene initialization with retro-futurist background
The system SHALL create a Three.js scene with background color `#000a16` (deep dark cyan-blue, not pure black) and a perspective camera with 60° FOV and 0.1–1000 draw distance.

#### Scenario: Scene renders dark cyan background
- **WHEN** the application loads
- **THEN** the canvas background displays color `#000a16`

#### Scenario: Camera initializes at overview position
- **WHEN** the scene initializes
- **THEN** the camera is positioned to show all 43 nodes within the viewport with TUOCON approximately centered

### Requirement: WebGL renderer with post-processing
The system SHALL use a WebGLRenderer with antialiasing enabled and an EffectComposer pipeline including UnrealBloomPass for selective glow effects on node symbols.

#### Scenario: Node symbols receive bloom
- **WHEN** the scene renders
- **THEN** geometric node symbols (✦, ▲, ▼, ●, etc.) exhibit a subtle golden glow via UnrealBloomPass with strength 0.5–1.5

#### Scenario: Background and text remain sharp
- **WHEN** the scene renders with bloom enabled
- **THEN** the starfield background particles and CSS2D text labels are NOT affected by the bloom pass

### Requirement: useUniverse composable
The system SHALL provide a `useUniverse` Vue composable that manages the Three.js scene, camera, renderer, CSS2DRenderer, EffectComposer, and animation loop, exposing reactive refs (`focusedNode`, `hoveredNode`, `cameraMode`, `isLoading`, `nodes`) to Vue components.

#### Scenario: Composable initializes on mount
- **WHEN** the `UniverseCanvas` component mounts
- **THEN** `useUniverse` creates the WebGL renderer, CSS2DRenderer, scene, camera, and starts the animation loop

#### Scenario: Composable cleans up on unmount
- **WHEN** the `UniverseCanvas` component unmounts
- **THEN** `useUniverse` disposes the renderer, cancels the animation frame, and frees GPU resources

#### Scenario: Vue reads reactive node state
- **WHEN** a node's hover state changes in Three.js
- **THEN** the `hoveredNode` ref updates reactively and Vue components re-render accordingly
