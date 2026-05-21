<template>
  <div
    v-if="node"
    class="tooltip"
    :style="tooltipStyle"
  >
    <div class="tooltip-name">{{ node.name }}</div>
    <div class="tooltip-address">{{ node.address }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataNode } from '@/data/types'

const props = defineProps<{
  node: DataNode | null
  screenPos: { x: number; y: number } | null
}>()

const tooltipStyle = computed(() => {
  if (!props.screenPos) return { display: 'none' }
  return {
    left: `${props.screenPos.x + 20}px`,
    top: `${props.screenPos.y - 10}px`,
  }
})
</script>

<style scoped>
.tooltip {
  position: fixed;
  z-index: 60;
  background: #FDF5E6;
  border: 1px solid #000a16;
  padding: 8px 12px;
  pointer-events: none;
  max-width: 240px;
}
.tooltip-name {
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
  font-size: 13px;
  color: #000a16;
  margin-bottom: 2px;
}
.tooltip-address {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 300;
  font-size: 10px;
  color: #000a16;
}
</style>
