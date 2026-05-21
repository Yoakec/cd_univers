## ADDED Requirements

### Requirement: Raycaster hover detection
The system SHALL use a Three.js Raycaster to detect when the mouse pointer hovers over a 3D node sprite, updating the `hoveredNode` reactive ref and changing the cursor to `pointer`.

#### Scenario: Cursor changes on node hover
- **WHEN** the mouse pointer moves over a 3D node sprite
- **THEN** the cursor changes to `pointer` and the `hoveredNode` ref updates to the node's data

#### Scenario: Cursor reverts on mouse leave
- **WHEN** the mouse pointer moves away from all node sprites
- **THEN** the cursor reverts to default and `hoveredNode` ref is set to `null`

#### Scenario: Hover state triggers visual feedback
- **WHEN** a node enters hover state
- **THEN** the node's sprite scale increases slightly (1.0 → 1.2) and its CSS2D label opacity increases

### Requirement: Node click triggers fly-to
The system SHALL detect clicks on 3D node sprites via the Raycaster and trigger the camera state machine transition from FREE_ROAM (or LOCKED) to FLY_TO for the clicked node.

#### Scenario: Clicking a node starts fly-to
- **WHEN** the user clicks on a 3D node sprite
- **THEN** the camera enters FLY_TO mode and animates to focus on the clicked node

#### Scenario: Clicking empty space resets
- **WHEN** the user clicks on empty space (no node hit) in LOCKED mode
- **THEN** the camera transitions to FREE_ROAM mode

### Requirement: Sidebar-to-scene two-way binding
The system SHALL maintain two-way binding between the sidebar list and the 3D scene: hovering a sidebar item highlights the corresponding 3D node, clicking it triggers camera fly-to, and hovering a 3D node highlights the corresponding sidebar item.

#### Scenario: Sidebar hover highlights 3D node
- **WHEN** the user hovers over a sidebar list item
- **THEN** the corresponding 3D node sprite scales up and its label highlights

#### Scenario: 3D node hover highlights sidebar item
- **WHEN** the user hovers over a 3D node in the scene
- **THEN** the corresponding sidebar list item is highlighted

#### Scenario: Sidebar click triggers fly-to
- **WHEN** the user clicks a sidebar list item
- **THEN** the camera initiates a fly-to animation to the corresponding 3D node

### Requirement: Touch and scroll passthrough
The system SHALL pass through only relevant pointer events: the Three.js canvas handles orbit controls (drag, scroll) and node interaction (hover, click), while Vue-managed overlay panels (sidebar, legend) handle their own scroll and click events independently without interfering with the 3D scene.

#### Scenario: Scrolling sidebar does not zoom scene
- **WHEN** the user scrolls within the sidebar panel
- **THEN** the 3D scene camera does not zoom

#### Scenario: Dragging on canvas orbits camera
- **WHEN** the user clicks and drags on the 3D canvas area (not on a UI panel)
- **THEN** the camera orbits in FREE_ROAM mode
