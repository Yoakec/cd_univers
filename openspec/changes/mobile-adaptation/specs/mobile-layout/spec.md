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

### Requirement: Mobile sidebar drawer
The system SHALL render the Sidebar as a full-width overlay drawer on mobile, hidden off-screen by default (`translateX(-100%)`) and sliding in via CSS transition when a hamburger button is tapped. A semi-transparent backdrop SHALL appear behind the open drawer.

#### Scenario: Sidebar hidden by default on mobile
- **WHEN** the application loads on a mobile viewport
- **THEN** the sidebar is positioned off-screen to the left and not visible

#### Scenario: Hamburger opens sidebar
- **WHEN** the user taps the hamburger button (☰) in the top-left corner
- **THEN** the sidebar slides in from the left with a 0.25s ease transition, covering the full viewport width

#### Scenario: Backdrop dismisses sidebar
- **WHEN** the sidebar drawer is open and the user taps the backdrop area (outside the sidebar panel)
- **THEN** the sidebar slides back off-screen

#### Scenario: Selecting a node closes sidebar
- **WHEN** the sidebar drawer is open on mobile and the user taps a node in the list
- **THEN** the sidebar closes and the camera flies to the selected node

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

### Requirement: Compass mobile scaling and repositioning
The system SHALL scale the Compass component to 64px (from 100px desktop) and reposition it to the top-left area next to the hamburger button on mobile viewports. Tapping the compass SHALL trigger camera reset.

#### Scenario: Compass is smaller on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** the compass renders at approximately 64×64px instead of 100×100px

#### Scenario: Compass positioned next to hamburger
- **WHEN** the application renders on a mobile viewport
- **THEN** the compass is anchored to the top-left area, right of the hamburger button, not in the top-right corner

### Requirement: Title block simplified on mobile
The system SHALL render only the main title "成都科幻地图" on mobile viewports, omitting the English subtitle and crew credits. A small ⓘ toggle button SHALL appear next to the title to show/hide the Legend panel.

#### Scenario: Title only on mobile
- **WHEN** the application renders on a <480px viewport
- **THEN** only "成都科幻地图" is visible; the English subtitle and five credit lines are not rendered

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
