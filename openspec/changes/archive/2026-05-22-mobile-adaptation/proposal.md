## Why

The application is currently desktop-only — all components use fixed `px` positioning, hover-dependent interactions, and no responsive breakpoints. On a 375px-wide phone, the 260px sidebar covers 80% of the viewport, the Legend and TitleBlock collide at the bottom, and the mouse-based raycaster hover/click system doesn't respond to touch. Mobile visitors get a broken experience.

## What Changes

- Add a single responsive breakpoint at `<480px` (phone only, tablets retain desktop layout)
- Replace fixed sidebar with a hamburger-triggered full-width overlay drawer
- Strip TitleBlock to title-only, add ⓘ toggle for Legend visibility
- Scale Compass from 100px to 64px, reposition to top-left near hamburger
- Reduce gold decorative border from 15px to 8px on mobile
- Add touch tap detection to the interaction system (tap-to-select nodes, no hover)
- Replace cursor-following tooltip with a fixed bottom info panel on mobile
- Hide ConnectorSvg on mobile (no cursor to connect to)
- Detect mobile via `matchMedia` and pass mode through the component tree

## Capabilities

### New Capabilities

- `mobile-layout`: Responsive layout system with a single `<480px` breakpoint. Covers hamburger sidebar drawer, bottom info panel, component repositioning/scaling, and gold border reduction. All mobile layout changes are gated behind a CSS media query and/or a reactive `isMobile` flag.

### Modified Capabilities

- `interaction`: Touch tap detection (distinguish tap from drag via displacement + duration thresholds), raycaster hit-test on tap, removal of mousemove hover path on mobile. Desktop mouse behavior unchanged.
- `ui-panels`: Sidebar gains collapsible drawer mode. TitleBlock loses credits on mobile. Legend gains show/hide toggle. NodeTooltip gains bottom-panel mobile variant. ConnectorSvg hides on mobile. Compass scales and repositions.

## Impact

- **Components**: `Sidebar.vue`, `TitleBlock.vue`, `Legend.vue`, `Compass.vue`, `NodeTooltip.vue`, `ConnectorSvg.vue`, `App.vue`, `UniverseCanvas.vue`
- **Three.js modules**: `interaction.ts` (touch event handling)
- **Entry point**: `index.html` (gold border media query)
- **No new dependencies** — touch detection uses native `matchMedia` + DOM TouchEvents
- **No API, data, or backend changes**
