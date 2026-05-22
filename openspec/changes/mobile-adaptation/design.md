## Context

The application is a Vue 3 + Three.js immersive 3D visualization with seven fixed-position UI components overlaid on a WebGL canvas. All positioning uses absolute `px` values. All interaction (`interaction.ts`) listens exclusively to `MouseEvent`. The project's CLAUDE.md explicitly states "Desktop-first, no mobile responsiveness."

The goal is to add phone-only (<480px) responsiveness without touching the desktop layout or adding tablet breakpoints.

### Current component positions (desktop)

| Component | Position | Size |
|---|---|---|
| Sidebar | fixed, left:20 top:20 | 260-300px, max-h:55vh |
| Compass | fixed, right:30 top:30 | 100×100px |
| TitleBlock | fixed, left:30 bottom:30 | auto |
| Legend | fixed, right:30 bottom:30 | min 200px |
| NodeTooltip | fixed, at mouse position | max 240px |
| ConnectorSvg | fixed, inset:0, pointer-events:none | fullscreen SVG |
| NoiseOverlay | fixed, inset:0, z-index:100 | fullscreen |

### Technical constraint

Three.js MapControls already supports touch (pinch zoom, two-finger pan, single-finger rotate). The challenge is that MapControls consumes `touchstart/touchmove/touchend` on the canvas, so we cannot simply add a `click` listener — we need to distinguish a tap (brief, no movement) from a drag.

## Goals / Non-Goals

**Goals:**
- Phone screens (<480px) get a usable layout where the 3D canvas fills the viewport
- Touch interaction: tap a node → fly-to + bottom info panel, tap empty → dismiss
- Sidebar accessible via hamburger button, not permanently visible
- All existing desktop behavior and layout preserved exactly (gated by `@media (min-width: 480px)` or `isMobile` flag)
- No new npm dependencies

**Non-Goals:**
- Tablet layout (≥480px retains desktop exactly)
- Landscape mobile optimization (portrait only)
- Mobile-specific performance downgrades (particle count, bloom, marching ants all unchanged per user decision)
- CSS2DRenderer label changes (they already fade with distance; acceptable on mobile)

## Decisions

### 1. Mobile detection: dual approach (CSS + JS)

**Decision**: Use CSS `@media (max-width: 479px)` for purely visual changes (border, sizing, positioning), and `window.matchMedia('(max-width: 479px)')` in JS for behavioral changes (touch interaction, component mounting).

**Why not CSS-only**: Touch event handling, conditional component rendering, and tooltip mode switching require JS awareness of the device context.

**Why not JS-only**: Purely visual changes like the gold border width are simpler and more reliable in CSS.

**Implementation**: `App.vue` creates a reactive `isMobile` ref via `matchMedia`, passed as props to components that need it. Components that only need visual changes use scoped `<style>` with `@media` queries.

### 2. Sidebar: CSS transform slide-in overlay

**Decision**: On mobile, the sidebar defaults to `translateX(-100%)` and slides in via CSS `transition: transform 0.25s ease` when a hamburger button is tapped. The overlay covers the full viewport width with a semi-transparent backdrop.

**Why not bottom sheet**: A drawer from the left keeps the search+list UI pattern intact (vertical list, search at top). A bottom sheet would require re-laying out the sidebar content horizontally, which fights the existing grouped-list design.

**Why not conditional rendering (v-if)**: CSS transitions are smoother than mount/unmount and keep the DOM state (search query, scroll position).

### 3. Touch tap detection: displacement + duration gate

**Decision**: In `interaction.ts`, on `touchend`, compute the Euclidean distance and elapsed time from `touchstart`. If displacement < 8px AND duration < 300ms, treat it as a tap: run the raycaster, hit-test sprites, and trigger `onClick` or `onClickEmpty`. Otherwise, it was a MapControls gesture — do nothing.

**Why 8px/300ms**: These are well-established thresholds in mobile web development (iOS uses 10px default tap slop; 300ms is the old iOS click delay ceiling). 8px is slightly tighter than 10px to avoid false positives on small screens.

**Why not a library**: Zero-dependency. The logic is ~20 lines.

### 4. Bottom info panel: NodeTooltip mode variant

**Decision**: Reuse the existing `NodeTooltip.vue` component with a new `mode="mobile"` prop value. In mobile mode, the tooltip renders as a fixed bottom bar (bottom:0, left:0, right:0) instead of a positioned floating card. The existing `locked` mode content (name, address, navigation button) is reused.

**Why not a separate component**: The content and Amap navigation logic are identical. A new mode avoids duplicating the template, `buildAmapURI`, and `openAmap` logic.

### 5. Compass: CSS scale + reposition

**Decision**: On mobile, the Compass scales from 100px to 64px via CSS `transform: scale(0.64)` with `transform-origin: top left`, and repositions to `left: 48px, top: 10px` (next to the hamburger button at left:10, top:10). The reset button is absorbed into the compass — tapping the compass itself triggers reset.

**Why scale rather than resize**: Preserves the exact visual proportions. All internal ring sizes, font sizes, and the octagram clip-path scale uniformly.

### 6. TitleBlock + Legend: single toggle

**Decision**: TitleBlock strips credits on mobile (v-if on the credits div). A small ⓘ button appears next to the title. Tapping ⓘ toggles Legend visibility. Legend defaults to hidden, rendered as a floating panel above the title.

**Why not separate toggles**: Two hidden panels with two buttons is excessive for a phone screen. The Legend is supplementary information; one toggle suffices.

## Risks / Trade-offs

- **MapControls + tap detection may conflict**: MapControls listens to the same touch events. Risk: a tap on empty space fires both `onClickEmpty` (dismissing the panel) AND starts a MapControls rotation. → Mitigation: call `onClickEmpty` only on confirmed taps (< 8px displacement), which by definition won't trigger MapControls rotation (rotation requires drag).
- **Hamburger button may overlap compass**: Both now live in the top-left corner. → Mitigation: hamburger at (10, 10), compass at (48, 10) — the compass is shifted right by ~38px to clear the hamburger.
- **matchMedia change listener may fire during unmounted state**: → Mitigation: store the listener reference and remove it in `onUnmounted`.
