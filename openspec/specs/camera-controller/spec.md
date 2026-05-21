## ADDED Requirements

### Requirement: Camera state machine
The system SHALL implement a camera state machine with three modes: FREE_ROAM (OrbitControls active, user drags/pinches/scrolls), FLY_TO (GSAP animation arcs camera to target node), and LOCKED (camera holds on target with idle micro-drift).

#### Scenario: Default mode is free roam
- **WHEN** the application loads
- **THEN** the camera is in FREE_ROAM mode with OrbitControls enabled

#### Scenario: Clicking a node triggers fly-to
- **WHEN** the user clicks a node or a sidebar list item
- **THEN** the camera transitions to FLY_TO mode, OrbitControls are disabled, and a GSAP animation arcs the camera to the target node

#### Scenario: Fly-to completes and locks
- **WHEN** the GSAP fly-to animation completes
- **THEN** the camera transitions to LOCKED mode and begins gentle idle micro-drift around the target

#### Scenario: User drag exits locked mode
- **WHEN** the user starts dragging or scrolling in LOCKED mode
- **THEN** the camera transitions back to FREE_ROAM mode and OrbitControls resume

### Requirement: GSAP arc-path fly-to animation
The system SHALL animate camera fly-to transitions using GSAP with `power3.inOut` easing over approximately 1.2 seconds, following a quadratic Bezier arc where the control point is offset perpendicular to the initial view direction, creating a "pull back and sweep in" motion.

#### Scenario: Camera arcs rather than lerps
- **WHEN** a fly-to animation plays
- **THEN** the camera path visibly curves (not a straight line) as it approaches the target

#### Scenario: Animation uses specified easing
- **WHEN** a fly-to animation plays
- **THEN** the motion follows `power3.inOut` easing (slow start, accelerated middle, slow arrival)

#### Scenario: Animation is interruptible
- **WHEN** the user triggers a new fly-to while an existing one is in progress
- **THEN** the previous GSAP timeline is killed and the new animation begins from the current camera position

### Requirement: OrbitControls integration
The system SHALL use Three.js OrbitControls with damping enabled, constrained to prevent the camera from going underground (minimum polar angle) and with a reasonable distance range (min 10, max 300 units).

#### Scenario: Orbit controls in free roam
- **WHEN** in FREE_ROAM mode
- **THEN** the user can orbit (left-drag), pan (right-drag or shift+left-drag), and zoom (scroll) the camera

#### Scenario: Controls disabled during fly-to
- **WHEN** in FLY_TO mode
- **THEN** OrbitControls are disabled and do not respond to user input

### Requirement: Idle micro-drift in locked mode
The system SHALL apply a subtle continuous drift to the camera in LOCKED mode, gently orbiting around the target node at an extremely slow rate, to keep the scene feeling alive without user input.

#### Scenario: Camera drifts when locked
- **WHEN** the camera is in LOCKED mode for more than 2 seconds
- **THEN** the camera begins a slow orbital drift around the target node at approximately 0.01 radians/second
