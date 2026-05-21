<template>
  <svg
    v-if="from && to"
    class="connector-svg"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <polyline
      :points="polylinePoints"
      fill="none"
      stroke="#FDF5E6"
      stroke-width="1"
      stroke-linejoin="round"
      opacity="0.6"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  from: { x: number; y: number } | null
  to: { x: number; y: number } | null
}>()

const width = window.innerWidth
const height = window.innerHeight

const polylinePoints = computed(() => {
  if (!props.from || !props.to) return ''
  const fx = props.from.x
  const fy = props.from.y
  const tx = props.to.x
  const ty = props.to.y
  const midX = (fx + tx) / 2
  // Two-segment elbow: vertical then horizontal
  return `${fx},${fy} ${midX},${fy} ${midX},${ty} ${tx},${ty}`
})
</script>

<style scoped>
.connector-svg {
  position: fixed;
  inset: 0;
  z-index: 55;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
</style>
