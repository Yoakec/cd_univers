## ADDED Requirements

### Requirement: Mobile breakpoint detection
The system SHALL detect viewport width below 480px using `window.matchMedia('(max-width: 479px)')` and expose a reactive `isMobile` boolean flag. All mobile-specific behavior and layout changes MUST be gated behind this flag or equivalent CSS media queries.

#### Scenario: Phone detected as mobile
- **WHEN** the application loads on a 375px-wide viewport
- **THEN** `isMobile` is `true` and all mobile-adapted components render in their mobile variant

#### Scenario: Desktop detected as not mobile
- **WHEN** the application loads on a 1440px-wide viewport
- **THEN** `isMobile` is `false` and all components render in their original desktop layout

#### Scenario: Resize crosses breakpoint
- **WHEN** the browser window resizes from 500px to 400px
- **THEN** `isMobile` transitions from `false` to `true` and components re-render accordingly

### Requirement: Gold border reduction on mobile
The system SHALL reduce the gold decorative border from 15px to 8px on viewports below 480px via CSS media query.

#### Scenario: Phone gets thinner border
- **WHEN** the viewport is 375px wide
- **THEN** the gold `body::after` border is exactly 8px thick

#### Scenario: Desktop retains thick border
- **WHEN** the viewport is 1440px wide
- **THEN** the gold `body::after` border is exactly 15px thick

### Requirement: Mobile sidebar compact
The system SHALL render the Sidebar as a compact, collapsible panel on mobile, reduced in width (max 200px) and height (max 42vh) with smaller fonts, and collapsed by default. The existing collapse toggle button SHALL remain functional to expand/collapse the sidebar.

#### Scenario: Sidebar collapsed by default on mobile
- **WHEN** the application loads on a mobile viewport
- **THEN** the sidebar is collapsed (only the toggle button visible) in the top-left corner

#### Scenario: Sidebar expands on toggle
- **WHEN** the user taps the sidebar toggle button on mobile
- **THEN** the sidebar expands to show the search box and grouped node list in a compact layout

#### Scenario: Sidebar has reduced footprint on mobile
- **WHEN** the sidebar is expanded on a mobile viewport
- **THEN** it renders at max 200px wide, max 42vh tall, with smaller fonts and tighter spacing throughout

### Requirement: Mobile info panel
The system SHALL display a fixed bottom info panel when a node is selected (tap on 3D sprite or sidebar item) on mobile, showing the node name, address, and Amap navigation button. The panel SHALL slide up from the bottom and dismiss when the user taps empty space.

#### Scenario: Tap node shows bottom panel
- **WHEN** the user taps a 3D node sprite on a mobile device
- **THEN** a fixed panel slides up from the bottom of the screen showing the node's name, address, and "🚀 开启星际导航" button

#### Scenario: Tap empty dismisses panel
- **WHEN** the bottom info panel is visible and the user taps empty space on the 3D canvas
- **THEN** the panel slides down and the camera returns to FREE_ROAM mode

#### Scenario: Panel hides on free roam
- **WHEN** the camera mode transitions to FREE_ROAM on mobile
- **THEN** the bottom info panel dismisses

### Requirement: Compass mobile scaling
The system SHALL scale the Compass component to 64px (from 100px desktop) on mobile viewports while keeping it anchored in the top-right corner. Tapping the compass SHALL trigger camera reset.

#### Scenario: Compass is smaller on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** the compass renders at approximately 64×64px instead of 100×100px, positioned at top-right

### Requirement: Title block scaled on mobile
The system SHALL render the complete TitleBlock (title, subtitle, credits) on mobile viewports with reduced font sizes and tighter spacing. A small ⓘ toggle button SHALL appear next to the title to show/hide the Legend panel.

#### Scenario: Full title block visible on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** "成都科幻地图", the English subtitle, and all five credit lines are visible with reduced font sizes (title ~18px, credits ~8px)

#### Scenario: ⓘ toggle shows legend
- **WHEN** the user taps the ⓘ button next to the mobile title
- **THEN** the Legend panel appears above the title
- **WHEN** the user taps ⓘ again or taps outside the Legend
- **THEN** the Legend panel hides

### Requirement: ConnectorSvg hidden on mobile
The system SHALL not render the ConnectorSvg polyline on mobile viewports, as there is no cursor position to connect from.

#### Scenario: No connector on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** the ConnectorSvg component does not render (v-if on isMobile is false)
