## ADDED Requirements

### Requirement: Sidebar with search and node list
The system SHALL provide a fixed top-right sidebar component containing a search input field and a scrollable, filterable list of all 43 nodes grouped by type, with click-to-navigate functionality.

#### Scenario: Sidebar displays all nodes grouped by type
- **WHEN** the application loads
- **THEN** the sidebar lists all 43 nodes organized under type headers (e.g., "宇宙中心", "高校科幻协会", "科幻机构")

#### Scenario: Search filters the node list
- **WHEN** the user types in the search input
- **THEN** the node list filters in real-time to show only nodes whose name or address matches the query

#### Scenario: Clicking a list item triggers camera fly-to
- **WHEN** the user clicks a node in the sidebar list
- **THEN** the camera flies to that node's 3D position and enters LOCKED mode

#### Scenario: Sidebar has retro-cartographic styling
- **WHEN** the sidebar renders
- **THEN** it uses `rgba(0, 10, 22, 0.88)` background, `1px solid rgba(253, 245, 230, 0.25)` border, no gradients or shadows

### Requirement: Title block with crew credits
The system SHALL render a fixed bottom-left title block displaying "成都科幻地图" in large bold type, the English subtitle "CHENGDU SCIENCE FICTION MAP", and crew credits with themed titles (指挥官, 领航员, 安全顾问, 医疗顾问, 制图顾问).

#### Scenario: Title block displays main title
- **WHEN** the application loads
- **THEN** "成都科幻地图" is visible in the bottom-left corner in large bold font

#### Scenario: Crew credits use themed role titles
- **WHEN** the title block renders
- **THEN** crew member names are listed with sci-fi themed role titles (指挥官, 领航员, etc.) rather than standard credits

### Requirement: Compass rose
The system SHALL render a fixed left-middle compass rose as pure CSS art, featuring concentric geometric rings, an octagram star, and N/S/W/E cardinal direction labels in `#FFD700`, all drawn without external images or SVG assets.

#### Scenario: Compass displays cardinal directions
- **WHEN** the application loads
- **THEN** the compass shows N, S, W, E labels with N highlighted in gold

#### Scenario: Compass uses CSS-only rendering
- **WHEN** the compass renders
- **THEN** all rings, stars, and markers are created with CSS borders, clip-paths, and pseudo-elements — no background images or external SVGs

### Requirement: Legend panel
The system SHALL render a fixed bottom-right legend panel displaying all node type symbols with labels, organized in a grid with 1px solid `#FDF5E6` dividing lines, following the retro-cartographic style.

#### Scenario: Legend displays all symbol types
- **WHEN** the application loads
- **THEN** the legend shows all 10 node type symbols with Chinese labels (e.g., "✦ 宇宙中心", "＊ 高校科幻协会", "▽ 已湮灭地点")

#### Scenario: Legend uses grid layout with ivory borders
- **WHEN** the legend renders
- **THEN** symbols and labels are arranged in a grid divided by `1px solid #FDF5E6` lines, no gradients or shadows

### Requirement: Dynamic tooltip with polyline connector
The system SHALL display a tooltip when hovering over a 3D node, showing the institution name (Noto Serif SC Bold) and address (IBM Plex Sans Light) on a `#FDF5E6` background with `#000a16` text, connected to the node by an SVG polyline (two segments with a rounded corner).

#### Scenario: Tooltip appears on hover
- **WHEN** the user hovers over a 3D node
- **THEN** a tooltip appears near the node's screen-space position showing its name and address

#### Scenario: Tooltip uses inverted color scheme
- **WHEN** the tooltip renders
- **THEN** it has `#FDF5E6` (ivory) background with `#000a16` (space void) text, the inverse of the main UI

#### Scenario: Polyline connector tracks node
- **WHEN** the camera moves while a tooltip is visible
- **THEN** the SVG polyline connector updates each frame to maintain a line from the tooltip to the node's current screen-space position

#### Scenario: Tooltip disappears on mouse leave
- **WHEN** the user moves the mouse away from a node
- **THEN** the tooltip fades out and is removed from the DOM

### Requirement: Procedural noise texture overlay
The system SHALL overlay a full-screen procedural noise texture at opacity 0.06 with `mix-blend-mode: screen`, generated via JavaScript Canvas API at startup, to create the "physical print" material feel.

#### Scenario: Noise overlay is visible
- **WHEN** the application loads
- **THEN** a subtle film-grain texture is visible across the entire screen

#### Scenario: Noise overlay does not block interaction
- **WHEN** the user interacts with UI elements
- **THEN** the noise overlay does not intercept clicks or pointer events
