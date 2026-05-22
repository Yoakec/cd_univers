<template>
  <UniverseCanvas
    :reset-signal="resetSignal"
    :is-mobile="isMobile"
    @hover-node="onHoverNode"
    @focus-node="onFocusNode"
    @camera-mode-change="onCameraModeChange"
    @focused-node-screen-pos="onFocusedNodeScreenPos"
  />
  <Sidebar
    :nodes="nodes"
    :hovered-node-id="hoveredNodeId"
    :is-mobile="isMobile"
    @hover-node="onHoverNode"
    @focus-node="onFocusNode"
  />
  <Compass :is-mobile="isMobile" @reset-camera="resetSignal++" />
  <TitleBlock :is-mobile="isMobile" @toggle-legend="showLegend = !showLegend" />
  <Legend :visible="legendVisible" :is-mobile="isMobile" />
  <NodeTooltip
    :node="tooltipNode"
    :screen-pos="activeScreenPos"
    :mode="tooltipMode"
    :is-mobile="isMobile"
  />
  <ConnectorSvg
    :is-mobile="isMobile"
    :from="connectorFrom"
    :to="connectorTo"
  />
  <NoiseOverlay />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { DataNode, CameraMode } from '@/data/types'
import UniverseCanvas from '@/components/UniverseCanvas.vue'
import Sidebar from '@/components/Sidebar.vue'
import Compass from '@/components/Compass.vue'
import TitleBlock from '@/components/TitleBlock.vue'
import Legend from '@/components/Legend.vue'
import NodeTooltip from '@/components/NodeTooltip.vue'
import ConnectorSvg from '@/components/ConnectorSvg.vue'
import NoiseOverlay from '@/components/NoiseOverlay.vue'

import dataJson from '../resoures/data/data.json'
const nodes = (dataJson as any).nodes as DataNode[]

const resetSignal = ref(0)
const hoveredNodeId = ref<string | null>(null)
const focusedNodeId = ref<string | null>(null)
const cameraMode = ref<CameraMode>('FREE_ROAM')
const focusedNodeScreenPos = ref<{ x: number; y: number } | null>(null)
const showLegend = ref(false)

// Mobile detection
const isMobile = ref(false)
let mobileQuery: MediaQueryList | null = null
let mobileQueryHandler: ((e: MediaQueryListEvent) => void) | null = null

onMounted(() => {
  mobileQuery = window.matchMedia('(max-width: 479px)')
  isMobile.value = mobileQuery.matches
  mobileQueryHandler = (e: MediaQueryListEvent) => { isMobile.value = e.matches }
  mobileQuery.addEventListener('change', mobileQueryHandler)
})

onUnmounted(() => {
  if (mobileQuery && mobileQueryHandler) {
    mobileQuery.removeEventListener('change', mobileQueryHandler)
  }
})

const tooltipNode = computed(() => {
  const id = focusedNodeId.value || hoveredNodeId.value
  if (!id) return null
  return nodes.find(n => n.id === id) || null
})

const legendVisible = computed(() => {
  if (isMobile.value) return showLegend.value
  return true // always visible on desktop
})

const tooltipMode = computed<'hover' | 'locked' | 'mobile'>(() => {
  if (isMobile.value && cameraMode.value === 'LOCKED') return 'mobile'
  return cameraMode.value === 'LOCKED' ? 'locked' : 'hover'
})

const activeScreenPos = computed(() => {
  if (tooltipMode.value === 'locked') return focusedNodeScreenPos.value
  return hoverScreenPos.value
})

const hoverScreenPos = ref<{ x: number; y: number } | null>(null)
const connectorFrom = ref<{ x: number; y: number } | null>(null)
const connectorTo = ref<{ x: number; y: number } | null>(null)

function onHoverNode(nodeId: string | null) {
  hoveredNodeId.value = nodeId
  if (!nodeId) {
    hoverScreenPos.value = null
    connectorFrom.value = null
    connectorTo.value = null
  }
}

function onFocusNode(nodeId: string) {
  focusedNodeId.value = nodeId
}

function onCameraModeChange(mode: CameraMode) {
  cameraMode.value = mode
  if (mode === 'FREE_ROAM') {
    focusedNodeId.value = null
    focusedNodeScreenPos.value = null
  }
}

function onFocusedNodeScreenPos(pos: { x: number; y: number }) {
  focusedNodeScreenPos.value = pos
}

// Track mouse for hover tooltip (suppressed in LOCKED mode)
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    if (isMobile.value || cameraMode.value === 'LOCKED') return
    if (hoveredNodeId.value) {
      hoverScreenPos.value = { x: e.clientX, y: e.clientY }
      connectorFrom.value = { x: e.clientX + 10, y: e.clientY + 10 }
      connectorTo.value = null
    }
  })
}
</script>
