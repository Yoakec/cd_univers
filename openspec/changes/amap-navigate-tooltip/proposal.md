## Why

The 3D universe map lets users discover Chengdu sci-fi landmarks visually, but provides no bridge from discovery to real-world navigation. Adding a "Navigate" button to the post-click tooltip turns the map from a passive viewing experience into an actionable guide — users can find a location in the cosmic map, then open it directly in Amap to get there.

## What Changes

- **New**: Dual-mode tooltip system — hover mode (current behavior, pointer-events: none) and locked mode (appears after camera fly-to completes, shows navigation button, pointer-events: auto)
- **New**: Navigation button inside locked-mode tooltip, constructing Amap search URI from node address and opening in new tab
- **New**: 3D→2D screen projection of focused node position, emitted each frame during LOCKED mode to anchor the tooltip
- **New**: LOST_PLACE nodes show disabled button ("📡 坐标已丢失") instead of active navigation
- **Modified**: `NodeTooltip` — adds `mode` prop, conditional button rendering, mode-dependent pointer-events
- **Modified**: `App.vue` — suppresses hover-based tooltip position updates while camera is in LOCKED mode
- **Modified**: `UniverseCanvas.vue` — emits focused node screen position each frame during LOCKED mode

## Capabilities

### New Capabilities

- `navigate-tooltip`: Locked-mode tooltip with navigation button that constructs and opens Amap URIs from node addresses, with special handling for LOST_PLACE nodes

### Modified Capabilities

- `ui-panels`: Tooltip component gains dual-mode behavior (hover vs. locked) with mode-dependent rendering and interactivity
- `interaction`: Click-to-focus flow now triggers locked-mode tooltip display in addition to camera fly-to

## Impact

- **Files modified**: `NodeTooltip.vue`, `App.vue`, `UniverseCanvas.vue`
- **No new dependencies**: URI construction uses `encodeURIComponent` (built-in), `window.open` (built-in)
- **No data changes**: Uses existing node `address` and `type` fields from `data.json`
- **No design system changes**: Button follows existing 1px solid `#FFD700` border convention
