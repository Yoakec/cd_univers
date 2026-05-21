## ADDED Requirements

### Requirement: Locked-mode tooltip with navigate button
The system SHALL display a tooltip in locked mode after camera fly-to completes, anchored to the focused node's screen-space position, with `pointer-events: auto` and a navigation button at the bottom.

#### Scenario: Locked tooltip appears after fly-to
- **WHEN** the camera enters LOCKED mode after a fly-to animation
- **THEN** the tooltip switches from hover mode to locked mode, displaying the focused node's name and address with a navigation button

#### Scenario: Locked tooltip anchors to node screen position
- **WHEN** the camera idle-drifts in LOCKED mode
- **THEN** the locked tooltip's screen position updates each frame to follow the projected 3D node position

#### Scenario: Locked tooltip has pointer events
- **WHEN** the tooltip is in locked mode
- **THEN** the tooltip has `pointer-events: auto` so the navigation button is clickable

### Requirement: Amap URI navigation
The system SHALL construct an Amap search URI from the node's address field using the format `https://uri.amap.com/search?keyword=<urlencoded-address>&city=成都&callnative=1` and open it in a new browser tab when the navigation button is clicked.

#### Scenario: Navigation button opens Amap
- **WHEN** the user clicks "🚀 开启星际导航" on a locked-mode tooltip
- **THEN** a new tab opens with the Amap search URI containing the node's URL-encoded address

#### Scenario: URI includes city and callnative parameters
- **WHEN** the Amap URI is constructed
- **THEN** it contains `city=成都` and `callnative=1` query parameters

### Requirement: Lost place navigation handling
The system SHALL display a disabled button with text "📡 坐标已丢失" for LOST_PLACE type nodes in locked mode, preventing navigation to locations that no longer exist.

#### Scenario: Lost place shows disabled button
- **WHEN** the locked tooltip displays for a LOST_PLACE node (type "LOST_PLACE")
- **THEN** the button shows "📡 坐标已丢失" and does not respond to clicks

#### Scenario: Normal nodes show active button
- **WHEN** the locked tooltip displays for a non-LOST_PLACE node
- **THEN** the button shows "🚀 开启星际导航" and opens the Amap URI on click

### Requirement: Hover suppression during locked mode
The system SHALL suppress hover-based tooltip position updates when the camera is in LOCKED mode, preventing the locked tooltip from jumping to the mouse cursor position.

#### Scenario: Mouse movement does not affect locked tooltip
- **WHEN** the camera is in LOCKED mode and the user moves the mouse
- **THEN** the tooltip position is determined by the focused node's screen projection, not the mouse cursor

#### Scenario: Hover resumes after exiting locked mode
- **WHEN** the camera transitions from LOCKED to FREE_ROAM mode
- **THEN** the tooltip reverts to hover mode, following the mouse cursor again
