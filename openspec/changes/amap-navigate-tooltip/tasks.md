## 1. Tooltip Dual-Mode

- [x] 1.1 Add `mode` prop (`'hover' | 'locked'`) and `nodeType` prop to NodeTooltip.vue
- [x] 1.2 Render navigation button when mode is locked (conditional template)
- [x] 1.3 Apply mode-dependent styles (pointer-events: none for hover, auto for locked)
- [x] 1.4 Implement `buildAmapURI()` function with encodeURIComponent, city=成都, callnative=1
- [x] 1.5 Implement LOST_PLACE detection — disabled button "📡 坐标已丢失"
- [x] 1.6 Style button with 1px solid #FFD700 border, transparent bg, matching design system

## 2. App.vue Coordination

- [x] 2.1 Add `cameraMode` ref and listen to `@camera-mode-change` from UniverseCanvas
- [x] 2.2 Add `focusedNodeId` ref, set on `@focus-node` event
- [x] 2.3 Add `focusedNodeScreenPos` ref for locked tooltip anchoring
- [x] 2.4 Suppress mousemove tooltip position updates when cameraMode is LOCKED
- [x] 2.5 Pass `mode`, `nodeType`, and appropriate `screenPos` to NodeTooltip

## 3. UniverseCanvas 3D→2D Projection

- [x] 3.1 Store focused node reference (from click handler) for per-frame projection
- [x] 3.2 In animation loop, project focused node 3D position to screen coordinates when in LOCKED mode
- [x] 3.3 Emit `focused-node-screen-pos` event with projected {x, y}
- [x] 3.4 Clear focused node reference when exiting LOCKED mode

## 4. Integration & Verification

- [x] 4.1 Verify hover tooltip behavior unchanged (follows mouse, disappears on leave)
- [x] 4.2 Verify click → fly-to → locked tooltip appears with navigate button
- [x] 4.3 Verify navigate button opens Amap in new tab with correct address
- [x] 4.4 Verify LOST_PLACE nodes show disabled button
- [x] 4.5 Verify exiting locked mode reverts tooltip to hover mode
- [x] 4.6 Build and verify no regressions
