## 1. Mobile detection infrastructure

- [x] 1.1 Add `isMobile` reactive ref in App.vue via `window.matchMedia('(max-width: 479px)')` with change listener
- [x] 1.2 Pass `isMobile` prop to Sidebar, Compass, TitleBlock, Legend, NodeTooltip, ConnectorSvg, UniverseCanvas
- [x] 1.3 Add `@media (max-width: 479px)` query in index.html reducing gold border from 15px to 8px

## 2. Sidebar hamburger drawer

- [x] 2.1 Add CSS classes for mobile drawer mode: `translateX(-100%)` default, slide-in transition, full-width overlay, backdrop
- [x] 2.2 Add hamburger button (☰) in Sidebar, visible only when `isMobile`, positioned fixed top-left
- [x] 2.3 Wire hamburger click → sidebar open, backdrop click → sidebar close, node select → sidebar close
- [x] 2.4 Desktop sidebar behavior unchanged (guard with `:not(.mobile)` or `@media`)

## 3. Compass mobile reposition

- [x] 3.1 Add mobile CSS: resize to 64px and reposition to `left: 48px, top: 10px`
- [x] 3.2 Make compass tappable for camera reset on mobile (emit `reset-camera` on tap of the compass itself)

## 4. TitleBlock simplification

- [x] 4.1 Hide English subtitle and credits on mobile via `v-if="!isMobile"`
- [x] 4.2 Add ⓘ toggle button next to title, visible only on mobile, emitting `toggle-legend`
- [x] 4.3 Reduce title font-size for mobile via `@media` query

## 5. Legend toggle

- [x] 5.1 Add `showLegend` ref in App.vue, default false
- [x] 5.2 Pass `visible` prop to Legend, use `v-if="visible"` or toggle class
- [x] 5.3 Wire TitleBlock `toggle-legend` emit → toggle `showLegend`
- [x] 5.4 Legend defaults to visible on desktop, hidden on mobile

## 6. NodeTooltip bottom panel mode

- [x] 6.1 Add `isMobile` prop to NodeTooltip, add `mode="mobile"` variant
- [x] 6.2 Style mobile variant: fixed bottom bar (bottom:0, left:0, right:0), slide-up transition
- [x] 6.3 Reuse locked-mode content (name, address, Amap button) in mobile variant
- [x] 6.4 App.vue: compute tooltipMode as `'mobile'` when `isMobile && cameraMode === 'LOCKED'`

## 7. ConnectorSvg mobile suppression

- [x] 7.1 Add `isMobile` prop to ConnectorSvg, `v-if="!isMobile"` to prevent rendering on mobile

## 8. Touch interaction

- [x] 8.1 Add touch event listeners (touchstart, touchend) in interaction.ts, gated by isMobile param
- [x] 8.2 Implement tap detection: track touchstart position + timestamp, gate at < 8px displacement AND < 300ms duration
- [x] 8.3 On confirmed tap: run raycaster against sprites → hit triggers onClick, miss triggers onClickEmpty
- [x] 8.4 Suppress mousemove listener registration when isMobile is true
- [x] 8.5 Pass isMobile to setupInteraction from UniverseCanvas

## 9. UniverseCanvas mobile wiring

- [x] 9.1 Accept isMobile prop, pass to setupInteraction
- [x] 9.2 Disable mousemove tracking in App.vue when isMobile (already suppressed via cameraMode check; extend guard)

## 10. Build verification

- [x] 10.1 Run `npm run build` and verify vue-tsc type-check + vite build pass with zero errors
- [ ] 10.2 Run `npm run dev` and manually verify desktop layout unchanged at ≥480px
- [ ] 10.3 Test mobile layout in Chrome DevTools device emulation (375px) — verify all 7 components render correctly
