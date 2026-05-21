## MODIFIED Requirements

### Requirement: Node click triggers fly-to
The system SHALL detect clicks on 3D node sprites via the Raycaster and trigger the camera state machine transition from FREE_ROAM (or LOCKED) to FLY_TO for the clicked node. Upon fly-to completion and LOCKED mode entry, the system SHALL activate the locked-mode tooltip anchored to the focused node's screen position.

#### Scenario: Clicking a node starts fly-to
- **WHEN** the user clicks on a 3D node sprite
- **THEN** the camera enters FLY_TO mode and animates to focus on the clicked node

#### Scenario: Locked tooltip appears after fly-to
- **WHEN** the fly-to animation completes and camera enters LOCKED mode
- **THEN** the tooltip appears in locked mode, anchored to the focused node's screen-space position with the navigation button visible

#### Scenario: Clicking empty space resets
- **WHEN** the user clicks on empty space (no node hit) in LOCKED mode
- **THEN** the camera transitions to FREE_ROAM mode and the locked tooltip reverts to hover mode
