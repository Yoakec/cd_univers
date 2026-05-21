<template>
  <div class="legend">
    <div class="legend-title">LEGEND · 图例</div>
    <div class="legend-grid">
      <div v-for="item in legendItems" :key="item.symbol" class="legend-row">
        <span class="legend-symbol" :style="{ color: item.color }">{{ item.symbol }}</span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const legendItems = [
  { symbol: '✦', label: '宇宙中心 TUOCON', color: '#FFD700' },
  { symbol: '＊', label: '高校科幻协会', color: '#F8E8C0' },
  { symbol: '▲', label: '科幻机构/企业', color: '#FDF5E6' },
  { symbol: '✤', label: '博物馆', color: '#FDF5E6' },
  { symbol: '◇', label: '科幻展览', color: '#F8E8C0' },
  { symbol: '▼', label: '书店/图书馆', color: '#F5F1E1' },
  { symbol: '●', label: '补给站', color: '#EDE8D6' },
  { symbol: '○', label: '旧补给站', color: '#C8D0D8' },
  { symbol: '◼︎', label: '研究中心', color: '#FDF5E6' },
  { symbol: '▽', label: '已湮灭地点', color: '#6B7B8D' },
]
</script>

<style scoped>
.legend {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 50;
  background: rgba(0, 10, 22, 0.85);
  border: 1px solid rgba(253, 245, 230, 0.25);
  padding: 14px 18px;
  min-width: 200px;
}
.legend-title {
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
  font-size: 11px;
  color: #FFD700;
  letter-spacing: 0.1em;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(253, 245, 230, 0.12);
}
.legend-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.legend-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.legend-symbol {
  font-size: 14px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
.legend-label {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 300;
  font-size: 10px;
  color: #F5F1E1;
  white-space: nowrap;
}
</style>
