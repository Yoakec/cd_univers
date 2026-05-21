## ADDED Requirements

### Requirement: Structural orbit layer from data edges
The system SHALL render orbit lines connecting nodes based on the `edges` array in `data.json`, using `#FFD700` (Gold Leaf) at 0.6 opacity with dashed line style and UnrealBloomPass glow.

#### Scenario: TUOCON spokes render
- **WHEN** the scene loads
- **THEN** four glowing dashed orbit lines radiate from TUOCON to its connected nodes (scu_sf, cd_sf_museum, sf_world_mag, uestc_sf)

#### Scenario: Structural orbits glow
- **WHEN** the scene renders with post-processing
- **THEN** the structural orbit lines receive UnrealBloomPass glow while decorative orbits do not

### Requirement: Cluster orbit layer by node type
The system SHALL generate bounding ellipses for node type groups with 3 or more members, rendering them as dashed ivory lines (`#FDF5E6` at 0.25 opacity) on the Z-plane matching the group's depth layer.

#### Scenario: Association cluster orbit
- **WHEN** the scene loads
- **THEN** the 8 ASSOCIATION nodes are encircled by a shared dashed elliptical orbit on their Z-depth plane

#### Scenario: Small types without orbits
- **WHEN** a node type has fewer than 3 members (e.g., CORE has 1, OLD_SUPPLY has 2, RESEARCH has 2)
- **THEN** no cluster orbit is generated for that type alone; small types are merged into shared orbits or omitted

### Requirement: Decorative procedural orbit generation
The system SHALL generate 50 procedural elliptical orbits with random parameters (semi-major axis 20–120 units, eccentricity 0.1–0.85, rotation 0–2π, Z-depth distributed across layers, dash size 0.5–3.0, gap size 0.3–1.5, opacity 0.08–0.18) centered near TUOCON.

#### Scenario: Decorative orbits create visual density
- **WHEN** the scene loads
- **THEN** at least 50 decorative dashed ellipses are visible, creating a dense star-map aesthetic

#### Scenario: Decorative orbits counter-rotate slowly
- **WHEN** the scene animates
- **THEN** approximately half of the decorative orbits rotate clockwise and half counter-clockwise at speeds of 0.01–0.05 radians per minute

#### Scenario: Decorative orbits use fine dashes
- **WHEN** the scene renders
- **THEN** decorative orbit dashes are visibly shorter and thinner than structural orbit dashes

### Requirement: Background starfield
The system SHALL render a starfield of approximately 2000 particles using BufferGeometry with color variation (95% white at varying opacity 0.05–0.9, 3% warm gold `#FFD700` at 0.2–0.4, 2% cool blue `#B8D8F0` at 0.2–0.5), distributed in a large spherical volume surrounding the orrery.

#### Scenario: Starfield visible behind all nodes
- **WHEN** the camera views any angle
- **THEN** stars are visible in the background, creating depth behind the orbital system

#### Scenario: Stars do not receive bloom
- **WHEN** the scene renders with post-processing
- **THEN** individual star particles are not visibly bloomed (unlike node symbols)
