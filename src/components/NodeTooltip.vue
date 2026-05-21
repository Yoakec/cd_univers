<template>
  <div
    v-if="node"
    class="tooltip"
    :class="{ 'tooltip-locked': mode === 'locked' }"
    :style="tooltipStyle"
  >
    <div class="tooltip-name">{{ node.name }}</div>
    <div class="tooltip-address">{{ node.address }}</div>
    <div v-if="mode === 'locked'" class="tooltip-actions">
      <button
        v-if="node.type !== 'LOST_PLACE'"
        class="nav-btn"
        @click="openAmap"
      >
        🚀 开启星际导航
      </button>
      <button
        v-else
        class="nav-btn nav-btn-disabled"
        disabled
      >
        📡 坐标已丢失
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DataNode } from '@/data/types'

const props = defineProps<{
  node: DataNode | null
  screenPos: { x: number; y: number } | null
  mode?: 'hover' | 'locked'
}>()

const tooltipStyle = computed(() => {
  if (!props.screenPos) return { display: 'none' }
  return {
    left: `${props.screenPos.x + 20}px`,
    top: `${props.screenPos.y - 10}px`,
  }
})

function buildAmapURI(address: string): string {
  return `https://uri.amap.com/search?keyword=${
    encodeURIComponent(address)
  }&city=成都&callnative=1`
}

function openAmap() {
  if (props.node) {
    window.open(buildAmapURI(props.node.address), '_blank')
  }
}
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
.tooltip-locked {
  pointer-events: auto;
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
.tooltip-actions {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 10, 22, 0.15);
}
.nav-btn {
  width: 100%;
  padding: 5px 0;
  background: transparent;
  border: 1px solid #FFD700;
  color: #000a16;
  font-family: 'Noto Serif SC', serif;
  font-size: 11px;
  cursor: pointer;
  letter-spacing: 0.05em;
}
.nav-btn:hover {
  background: rgba(255, 215, 0, 0.12);
}
.nav-btn-disabled {
  border-color: rgba(0, 10, 22, 0.15);
  color: #8a8a8a;
  cursor: not-allowed;
}
.nav-btn-disabled:hover {
  background: transparent;
}
</style>
