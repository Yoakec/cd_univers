## ADDED Requirements

### Requirement: Z-depth encoding by node type
The system SHALL position nodes at Z-depths determined by their type: CORE at Z=+20, MUSEUM and EXHIBITION at Z=+10, COMPANY, BOOKSTORE, and LIBRARY at Z=0, ASSOCIATION and RESEARCH at Z=-5, SUPPLY and OLD_SUPPLY at Z=-10, LOST_PLACE at Z=-20.

#### Scenario: TUOCON floats highest
- **WHEN** the scene loads
- **THEN** the TUOCON node is positioned at Z=+20, visibly above all other nodes

#### Scenario: Lost places sink lowest
- **WHEN** the scene loads
- **THEN** LOST_PLACE nodes (iron_moon, kuwen_book) are positioned at Z=-20, visibly below other nodes

#### Scenario: Parallax on camera movement
- **WHEN** the user orbits the camera
- **THEN** nodes at different Z-depths exhibit parallax displacement relative to each other

### Requirement: WebGL sprite symbols with per-type colors
The system SHALL render each node as a THREE.Sprite with a CanvasTexture containing the node's geometric symbol rendered in its type-specific color from the design token system, positioned at the node's 3D coordinates.

#### Scenario: CORE node renders as gold cross-star
- **WHEN** the scene loads
- **THEN** TUOCON displays as a ✦ symbol in `#FFD700` (Gold Leaf) at Z=+20, receiving UnrealBloomPass glow

#### Scenario: LOST_PLACE nodes render as ghostly triangles
- **WHEN** the scene loads
- **THEN** LOST_PLACE nodes display as ▽ symbols in `#6B7B8D` (Ghost Blue-Gray) at Z=-20, with no bloom

#### Scenario: Sprites always face camera
- **WHEN** the camera orbits around the scene
- **THEN** all node symbol sprites remain facing the camera (billboard behavior)

### Requirement: CSS2D text labels
The system SHALL render each node's name and address as CSS2DObject elements positioned adjacent to their corresponding WebGL sprite, using the CSS2DRenderer overlay.

#### Scenario: Chinese names render in Noto Serif SC Bold
- **WHEN** the scene loads
- **THEN** each node label displays the institution name in Noto Serif SC Bold, color `#FDF5E6`, positioned near the node sprite

#### Scenario: Addresses render in IBM Plex Sans Light
- **WHEN** the scene loads
- **THEN** each node label displays the street address in IBM Plex Sans Light, color `#F5F1E1`, below the institution name

#### Scenario: Labels are always sharp
- **WHEN** the camera zooms in on a node
- **THEN** the CSS2D text labels remain crisp at any zoom level without pixelation

### Requirement: Z-depth color temperature shift
The system SHALL apply a color temperature shift to node visuals based on Z-depth: nodes at positive Z appear warm (gold/ivory), nodes at negative Z appear increasingly cool (blue-gray).

#### Scenario: Warm tones at high Z
- **WHEN** viewing nodes at Z=+10 or above
- **THEN** their symbols and labels use warm tones (`#FFD700`, `#FDF5E6`)

#### Scenario: Cool tones at low Z
- **WHEN** viewing nodes at Z=-10 or below
- **THEN** their symbols and labels shift toward cool tones (`#C8D0D8`, `#6B7B8D`)
