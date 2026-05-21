## MODIFIED Requirements

### Requirement: Dynamic tooltip with polyline connector
The system SHALL display a tooltip when hovering over a 3D node, showing the institution name (Noto Serif SC Bold) and address (IBM Plex Sans Light) on a `#FDF5E6` background with `#000a16` text. The system SHALL support two tooltip modes: hover mode (pointer-events: none, follows mouse cursor, disappears on mouse leave) and locked mode (pointer-events: auto, anchored to focused node's 3D→2D projected screen position, displays navigation button, appears after camera fly-to completes).

#### Scenario: Tooltip appears on hover
- **WHEN** the user hovers over a 3D node
- **THEN** a tooltip appears near the node's screen-space position showing its name and address

#### Scenario: Tooltip uses inverted color scheme
- **WHEN** the tooltip renders
- **THEN** it has `#FDF5E6` (ivory) background with `#000a16` (space void) text, the inverse of the main UI

#### Scenario: Tooltip disappears on mouse leave
- **WHEN** the user moves the mouse away from a node in hover mode
- **THEN** the tooltip fades out and is removed from the DOM

#### Scenario: Tooltip transitions to locked mode after fly-to
- **WHEN** the camera completes a fly-to animation and enters LOCKED mode
- **THEN** the tooltip switches to locked mode with pointer-events enabled and a navigation button visible

#### Scenario: Tooltip reverts to hover mode on exit
- **WHEN** the camera exits LOCKED mode to FREE_ROAM
- **THEN** the tooltip reverts to hover mode, hiding the navigation button and disabling pointer events
