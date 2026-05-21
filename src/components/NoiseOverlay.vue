<template>
  <div class="noise-overlay"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

function generateNoiseDataUrl(size = 256): string {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(size, size)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const v = Math.random() * 255
    imageData.data[i] = v
    imageData.data[i + 1] = v
    imageData.data[i + 2] = v
    imageData.data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

onMounted(() => {
  const el = document.querySelector('.noise-overlay') as HTMLElement
  if (el) {
    el.style.backgroundImage = `url(${generateNoiseDataUrl()})`
  }
})
</script>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0.06;
  mix-blend-mode: screen;
  background-repeat: repeat;
  background-size: 256px 256px;
}
</style>
