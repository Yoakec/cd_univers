## Context

The existing `NodeTooltip` is hover-only: it follows the mouse, shows name + address, and has `pointer-events: none`. Clicking a node triggers camera fly-to via `camera.ts → flyTo()` which transitions through FLY_TO → LOCKED. The tooltip disappears on hover-out regardless of camera mode. This change adds a second "locked" mode to the tooltip that activates when the camera reaches LOCKED state after a fly-to, adding a navigation button.

## Goals / Non-Goals

**Goals:**
- Add a dual-mode tooltip: hover (current) and locked (new, with navigate button)
- Construct valid Amap search URIs from node addresses
- Anchor locked tooltip to the focused node's screen position, updating as the camera idle-drifts
- Suppress hover-tooltip position updates during LOCKED mode
- Gracefully handle LOST_PLACE nodes with a disabled button

**Non-Goals:**
- Custom Amap API key integration (uses public search URI)
- Geocoding or address validation (Amap handles this)
- Mobile-specific UX (callnative=1 is the only mobile consideration)
- Changing the hover tooltip behavior in any way

## Decisions

### D1: Mode prop over separate component

**Choice:** Add a `mode: 'hover' | 'locked'` prop to `NodeTooltip.vue` rather than creating a separate `LockedTooltip.vue`.

**Rationale:** The visual structure (name, address, ivory bg, dark text) is identical. Only pointer-events, positioning source, and the button presence differ. A mode prop keeps the DRY benefit while the conditional template blocks are small.

### D2: Screen position computed in UniverseCanvas, passed through App

**Choice:** UniverseCanvas projects the focused node's 3D position to screen coordinates each frame during LOCKED mode, emits it, and App.vue passes it to NodeTooltip.

**Rationale:** The projection requires `camera`, which only UniverseCanvas holds. Emitting per-frame keeps the data flow unidirectional (child → parent). The alternative — exposing camera as a ref — breaks encapsulation.

**Data flow:**
```
UniverseCanvas (animation loop, LOCKED mode only)
  → project(node3D.position, camera) → screen (x, y)
  → emit('focused-node-screen-pos', {x, y})
      │
      ▼
App.vue
  → focusedNodeScreenPos ref
  → passed as :screen-pos to NodeTooltip (locked mode)
```

### D3: Amap URI via public search endpoint

**Choice:** `https://uri.amap.com/search?keyword=<addr>&city=成都&callnative=1`

**Rationale:** No API key required. Works on desktop (web fallback) and mobile (app deeplink). The `callnative=1` parameter is a best-effort hint — Amap decides whether to open the app based on device context. `city=成都` improves precision for addresses that might be ambiguous.

### D4: Suppress hover in App.vue, not in the tooltip

**Choice:** The mousemove handler in App.vue checks `cameraMode !== 'LOCKED'` before updating tooltip position, rather than having NodeTooltip ignore its `screenPos` prop in locked mode.

**Rationale:** Single source of truth. The tooltip renders whatever position it receives. The coordinator (App.vue) decides which position source (mouse or 3D projection) is authoritative based on camera mode.

## Risks / Trade-offs

- **Per-frame projection emit**: Adding a `Vector3.project()` call and emit every frame is negligible for 1 node. If it ever becomes an issue, throttle to every 3rd frame.
- **Amap URI not guaranteed**: Amap may change their URI scheme. Mitigation: the `window.open` fallback will always open whatever Amap serves at that URL, even if UI changes.
- **Desktop UX**: `callnative=1` has no effect on desktop. User gets the Amap web search page, which is acceptable.
- **LOST_PLACE address validity**: Some lost places might have addresses that still resolve (they just closed). Showing a disabled button avoids sending users to incorrect locations, but a "view anyway" option could be considered later.
