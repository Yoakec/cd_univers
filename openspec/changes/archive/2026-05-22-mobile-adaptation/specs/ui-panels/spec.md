## MODIFIED Requirements

### Requirement: Sidebar with search and node list
The system SHALL provide a fixed sidebar component containing a search input field and a scrollable, filterable list of all 43 nodes grouped by type, with click-to-navigate functionality. On viewports below 480px, the sidebar SHALL render in compact mode: reduced width (max 200px), reduced height (max 42vh), smaller fonts, and collapsed by default with the toggle button still functional.

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

#### Scenario: Mobile sidebar is compact and collapsible
- **WHEN** the application renders on a <480px viewport
- **THEN** the sidebar is collapsed by default, renders at max 200px wide and 42vh when expanded, with reduced fonts and spacing

### Requirement: Title block with crew credits
The system SHALL render a fixed bottom-left title block displaying "成都科幻地图" in large bold type, the English subtitle "CHENGDU SCIENCE FICTION MAP", and crew credits with themed titles (指挥官, 领航员, 安全顾问, 医疗顾问, 制图顾问). On viewports below 480px, the full content SHALL render with reduced font sizes and tighter spacing, plus a ⓘ toggle button for the Legend.

#### Scenario: Title block displays main title
- **WHEN** the application loads
- **THEN** "成都科幻地图" is visible in the bottom-left corner in large bold font

#### Scenario: Crew credits use themed role titles
- **WHEN** the title block renders
- **THEN** crew member names are listed with sci-fi themed role titles (指挥官, 领航员, etc.) rather than standard credits

#### Scenario: Mobile title block is scaled down
- **WHEN** the title block renders on a <480px viewport
- **THEN** the full title block (title ~18px, subtitle ~8px, credits ~8px) is shown with a ⓘ button that toggles Legend visibility

### Requirement: Compass rose
The system SHALL render a fixed compass rose as pure CSS art, featuring concentric geometric rings, an octagram star, and N/S/W/E cardinal direction labels in `#FFD700`. On viewports below 480px, the compass SHALL scale to approximately 64×64px while remaining in the top-right corner. Tapping the compass on mobile SHALL trigger camera reset.

#### Scenario: Compass displays cardinal directions
- **WHEN** the application loads
- **THEN** the compass shows N, S, W, E labels with N highlighted in gold

#### Scenario: Compass uses CSS-only rendering
- **WHEN** the compass renders
- **THEN** all rings, stars, and markers are created with CSS borders, clip-paths, and pseudo-elements — no background images or external SVGs

#### Scenario: Compass scales on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** the compass renders at 64×64px scale in the top-right corner, and tapping it resets the camera

### Requirement: Legend panel
The system SHALL render a fixed bottom-right legend panel displaying all node type symbols with labels, organized in a grid with 1px solid `#FDF5E6` dividing lines. On viewports below 480px, the legend SHALL be hidden by default and toggled via the ⓘ button on the simplified TitleBlock.

#### Scenario: Legend displays all symbol types
- **WHEN** the application loads on a ≥480px viewport
- **THEN** the legend shows all 10 node type symbols with Chinese labels

#### Scenario: Legend uses grid layout with ivory borders
- **WHEN** the legend renders
- **THEN** symbols and labels are arranged in a grid divided by `1px solid #FDF5E6` lines, no gradients or shadows

#### Scenario: Legend is toggleable on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** the legend is hidden by default and appears/disappears when the ⓘ toggle on the simplified title is tapped

### Requirement: Dynamic tooltip with polyline connector
The system SHALL display a tooltip when hovering over a 3D node on desktop, showing the institution name and address on a `#FDF5E6` background. On viewports below 480px, the hover tooltip SHALL be replaced by a fixed bottom info panel that appears when a node is tapped, reusing the same content and Amap navigation button. The ConnectorSvg SHALL be hidden on mobile.

#### Scenario: Tooltip appears on hover (desktop)
- **WHEN** the user hovers over a 3D node on a ≥480px viewport
- **THEN** a tooltip appears near the node's screen-space position showing its name and address

#### Scenario: Tooltip uses inverted color scheme
- **WHEN** the tooltip renders
- **THEN** it has `#FDF5E6` (ivory) background with `#000a16` (space void) text, the inverse of the main UI

#### Scenario: Polyline connector tracks node (desktop)
- **WHEN** the camera moves while a tooltip is visible on desktop
- **THEN** the SVG polyline connector updates to maintain a line from the tooltip to the node's current screen-space position

#### Scenario: Bottom panel appears on tap (mobile)
- **WHEN** the user taps a 3D node on a <480px viewport
- **THEN** a fixed bottom panel slides up showing the node's name, address, and Amap navigation button

#### Scenario: Bottom panel dismisses on tap-empty (mobile)
- **WHEN** the bottom panel is visible and the user taps empty canvas space on mobile
- **THEN** the panel dismisses and the camera returns to FREE_ROAM mode
