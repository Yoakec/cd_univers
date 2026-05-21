<template>
  <UniverseCanvas
    :reset-signal="resetSignal"
    @hover-node="onHoverNode"
    @focus-node="onFocusNode"
  />
  <Sidebar
    :nodes="nodes"
    :hovered-node-id="hoveredNodeId"
    @hover-node="onHoverNode"
    @focus-node="onFocusNode"
  />
  <Compass @reset-camera="resetSignal++" />
  <TitleBlock />
  <Legend />
  <NodeTooltip
    :node="tooltipNode"
    :screen-pos="tooltipScreenPos"
  />
  <ConnectorSvg
    :from="connectorFrom"
    :to="connectorTo"
  />
  <NoiseOverlay />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataNode } from '@/data/types'
import UniverseCanvas from '@/components/UniverseCanvas.vue'
import Sidebar from '@/components/Sidebar.vue'
import Compass from '@/components/Compass.vue'
import TitleBlock from '@/components/TitleBlock.vue'
import Legend from '@/components/Legend.vue'
import NodeTooltip from '@/components/NodeTooltip.vue'
import ConnectorSvg from '@/components/ConnectorSvg.vue'
import NoiseOverlay from '@/components/NoiseOverlay.vue'

// Load data statically (Vite will bundle it)
import dataJson from '../resoures/data/data.json'
const nodes = (dataJson as any).nodes as DataNode[]

const resetSignal = ref(0)
const hoveredNodeId = ref<string | null>(null)

const tooltipNode = computed(() => {
  if (!hoveredNodeId.value) return null
  return nodes.find(n => n.id === hoveredNodeId.value) || null
})

const tooltipScreenPos = ref<{ x: number; y: number } | null>(null)
const connectorFrom = ref<{ x: number; y: number } | null>(null)
const connectorTo = ref<{ x: number; y: number } | null>(null)

function onHoverNode(nodeId: string | null) {
  hoveredNodeId.value = nodeId
  if (nodeId) {
    // Approximate screen position from mouse
    // The actual 3D→2D projection happens in the canvas component
    // Tooltip position will be updated via mousemove
  } else {
    tooltipScreenPos.value = null
    connectorFrom.value = null
    connectorTo.value = null
  }
}

function onFocusNode(nodeId: string) {
  // Focus is handled by UniverseCanvas internally
  // Sidebar emits this to trigger the canvas fly-to
}

// Track mouse for tooltip positioning
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    if (hoveredNodeId.value) {
      tooltipScreenPos.value = { x: e.clientX, y: e.clientY }
      connectorFrom.value = { x: e.clientX + 10, y: e.clientY + 10 }
      connectorTo.value = null // Will be set from 3D projection
    }
  })
}
</script>
