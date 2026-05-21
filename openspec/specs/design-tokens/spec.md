## ADDED Requirements

### Requirement: Color token system
The system SHALL define and apply a 16-color design token system organized into semantic layers: Void (canvas/panel backgrounds), Starlight (text/lines), Gold Accent (highlights/CORE), and Z-Depth Atmospheric (depth-encoded node colors).

#### Scenario: Canvas background uses Space Void
- **WHEN** the scene renders
- **THEN** the background color is `#000a16` (Space Void), not pure black `#000000`

#### Scenario: Primary text uses Starlight
- **WHEN** any UI text or border renders
- **THEN** it uses `#FDF5E6` (Starlight) as its primary color

#### Scenario: CORE nodes use Gold Leaf
- **WHEN** the TUOCON node or any interactive focus state renders
- **THEN** it uses `#FFD700` (Gold Leaf) as its accent color

### Requirement: Typography stack
The system SHALL apply a dual-font typography system: Noto Serif SC Bold for display text (headings, node names, tooltip titles) and IBM Plex Sans Light for body text (addresses, metadata, coordinates).

#### Scenario: Node names use serif font
- **WHEN** a CSS2D node label or tooltip title renders Chinese text
- **THEN** the text uses Noto Serif SC Bold

#### Scenario: Addresses use sans-serif font
- **WHEN** a CSS2D node label or tooltip renders an address
- **THEN** the text uses IBM Plex Sans Light (or Heebo Light as fallback)

#### Scenario: UI headings use serif font
- **WHEN** the title block, sidebar type headers, or legend renders heading text
- **THEN** the text uses Noto Serif SC Bold with Chinese character support

### Requirement: Border and divider convention
The system SHALL render all UI panel borders and internal dividers as `1px solid` lines in ivory (`#FDF5E6`) at varying opacities: panel borders at 0.25 opacity, internal dividers at 0.12 opacity.

#### Scenario: Panels have single-pixel ivory borders
- **WHEN** any UI panel (sidebar, legend, title block) renders
- **THEN** its outer border is exactly `1px solid` with color `#FDF5E6` at 0.25 opacity

#### Scenario: No CSS gradients or box-shadows
- **WHEN** any UI element renders
- **THEN** no CSS `linear-gradient`, `radial-gradient`, or `box-shadow` properties are applied to panel elements

### Requirement: Noise texture generation
The system SHALL generate a procedural noise texture at application startup using the JavaScript Canvas API (256×256 pixel noise pattern, each pixel random grayscale), applied as a full-screen overlay with `opacity: 0.06` and `mix-blend-mode: screen`.

#### Scenario: Noise texture generated procedurally
- **WHEN** the application initializes
- **THEN** a 256×256 canvas noise texture is created in-memory without loading external assets

#### Scenario: Noise texture applies screen blend
- **WHEN** the noise overlay renders
- **THEN** it uses CSS `mix-blend-mode: screen` and `opacity: 0.06`
