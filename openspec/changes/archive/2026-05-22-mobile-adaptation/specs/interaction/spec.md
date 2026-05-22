## ADDED Requirements

### Requirement: Touch tap detection
The system SHALL detect taps on the 3D canvas using touch events and distinguish them from drag/scroll gestures. A tap is defined as: touchstart followed by touchend with Euclidean displacement less than 8px and elapsed duration less than 300ms. Taps that meet this threshold SHALL trigger raycaster hit-testing against node sprites.

#### Scenario: Tap on a node triggers fly-to
- **WHEN** the user touches a 3D node sprite and lifts their finger with < 8px movement within 300ms
- **THEN** the camera initiates a fly-to animation to that node

#### Scenario: Tap on empty space resets
- **WHEN** the user taps empty canvas space (no node hit) with < 8px movement within 300ms
- **THEN** the camera transitions to FREE_ROAM mode (if previously LOCKED)

#### Scenario: Drag does not trigger tap
- **WHEN** the user touches the canvas and drags more than 8px before lifting
- **THEN** no tap action fires; the gesture is handled by MapControls for orbit/pan

#### Scenario: Long press does not trigger tap
- **WHEN** the user touches the canvas and holds for more than 300ms before lifting
- **THEN** no tap action fires even if displacement is under 8px

### Requirement: Hover disabled on mobile
The system SHALL NOT register mousemove listeners on the 3D canvas when `isMobile` is true. The hover-based tooltip path (mouse-following NodeTooltip + ConnectorSvg) SHALL be suppressed on mobile.

#### Scenario: No hover events on mobile
- **WHEN** the application renders on a mobile viewport
- **THEN** moving a finger across the 3D canvas does not trigger raycaster hover detection or show a tooltip

#### Scenario: Desktop hover unchanged
- **WHEN** the application renders on a ≥480px viewport
- **THEN** the existing mousemove-based raycaster hover detection continues to work exactly as before
