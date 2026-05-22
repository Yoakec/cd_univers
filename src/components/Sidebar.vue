<template>
  <aside class="sidebar" :class="{ collapsed: !visible, mobile: isMobile }">
    <button class="sidebar-toggle" @click="visible = !visible">
      {{ visible ? '◁' : '▷' }}
    </button>
    <div v-show="visible" class="sidebar-content">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索地点或地址..."
          class="search-input"
        />
      </div>
      <div class="node-list">
        <template v-for="(group, type) in groupedNodes" :key="type">
          <div v-if="group.length > 0" class="type-group">
            <div class="type-header">{{ typeLabels[type] || type }}</div>
            <div
              v-for="node in group"
              :key="node.id"
              class="node-item"
              :class="{ hovered: hoveredNodeId === node.id }"
              @mouseenter="$emit('hover-node', node.id)"
              @mouseleave="$emit('hover-node', null)"
              @click="$emit('focus-node', node.id)"
            >
              <span class="node-symbol">{{ node.symbol }}</span>
              <div class="node-info">
                <div class="node-name">{{ node.name }}</div>
                <div class="node-address">{{ node.address }}</div>
              </div>
            </div>
          </div>
        </template>
        <div v-if="filteredCount === 0" class="no-results">无匹配结果</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataNode, NodeType } from '@/data/types'

const props = defineProps<{
  nodes: DataNode[]
  hoveredNodeId: string | null
  isMobile: boolean
}>()

defineEmits<{
  (e: 'hover-node', id: string | null): void
  (e: 'focus-node', id: string): void
}>()

const visible = ref(!props.isMobile)
const searchQuery = ref('')

const typeLabels: Record<string, string> = {
  CORE: '宇宙中心',
  MUSEUM: '博物馆',
  EXHIBITION: '科幻展览',
  COMPANY: '科幻机构/企业',
  BOOKSTORE: '书店',
  LIBRARY: '图书馆',
  ASSOCIATION: '高校科幻协会',
  RESEARCH: '研究中心',
  SUPPLY: '补给站',
  OLD_SUPPLY: '旧补给站',
  LOST_PLACE: '已湮灭地点',
}

const typeOrder: NodeType[] = [
  'CORE', 'MUSEUM', 'EXHIBITION', 'COMPANY', 'BOOKSTORE',
  'LIBRARY', 'ASSOCIATION', 'RESEARCH', 'SUPPLY', 'OLD_SUPPLY', 'LOST_PLACE',
]

const filteredNodes = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return props.nodes
  return props.nodes.filter(
    n => n.name.toLowerCase().includes(q) || n.address.toLowerCase().includes(q)
  )
})

const filteredCount = computed(() => filteredNodes.value.length)

const groupedNodes = computed(() => {
  const groups: Record<string, DataNode[]> = {}
  for (const t of typeOrder) groups[t] = []
  for (const n of filteredNodes.value) {
    if (groups[n.type]) groups[n.type].push(n)
  }
  return groups
})
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 50;
  background: rgba(0, 10, 22, 0.9);
  border: 1px solid rgba(253, 245, 230, 0.25);
  min-width: 260px;
  max-width: 300px;
  max-height: 55vh;
  display: flex;
  flex-direction: column;
  font-family: 'IBM Plex Sans', 'Heebo', sans-serif;
}
.sidebar.collapsed {
  min-width: auto;
  background: transparent;
  border: none;
}
.sidebar-toggle {
  position: absolute;
  right: -28px;
  top: 0;
  background: rgba(0, 10, 22, 0.9);
  border: 1px solid rgba(253, 245, 230, 0.25);
  color: #FDF5E6;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
}
.sidebar-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 55vh;
}
.search-box {
  padding: 12px;
  border-bottom: 1px solid rgba(253, 245, 230, 0.12);
}
.search-input {
  width: 100%;
  padding: 8px 10px;
  background: rgba(0, 10, 22, 0.6);
  border: 1px solid rgba(253, 245, 230, 0.2);
  color: #FDF5E6;
  font-family: inherit;
  font-size: 12px;
  outline: none;
}
.search-input:focus {
  border-color: #FFD700;
}
.search-input::placeholder {
  color: #D4CFBA;
}
.node-list {
  overflow-y: auto;
  flex: 1;
  padding: 6px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(253, 245, 230, 0.2) transparent;
}
.node-list::-webkit-scrollbar {
  width: 4px;
}
.node-list::-webkit-scrollbar-track {
  background: transparent;
}
.node-list::-webkit-scrollbar-thumb {
  background: rgba(253, 245, 230, 0.2);
  border-radius: 2px;
}
.node-list::-webkit-scrollbar-thumb:hover {
  background: rgba(253, 245, 230, 0.35);
}
.type-group {
  border-bottom: 1px solid rgba(253, 245, 230, 0.08);
}
.type-header {
  padding: 8px 12px 4px;
  font-family: 'Noto Serif SC', serif;
  font-weight: bold;
  font-size: 11px;
  color: #FFD700;
  letter-spacing: 0.05em;
}
.node-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.node-item:hover,
.node-item.hovered {
  background: rgba(255, 215, 0, 0.08);
}
.node-symbol {
  flex-shrink: 0;
  font-size: 14px;
  width: 20px;
  text-align: center;
  color: #FDF5E6;
  padding-top: 1px;
}
.node-name {
  font-size: 12px;
  color: #FDF5E6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.node-address {
  font-size: 10px;
  color: #D4CFBA;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.no-results {
  padding: 20px;
  text-align: center;
  color: #D4CFBA;
  font-size: 12px;
}

/* Mobile compact sidebar */
@media (max-width: 479px) {
  .sidebar {
    top: 10px;
    left: 10px;
    min-width: auto;
    max-width: 200px;
    max-height: 42vh;
  }
  .sidebar.collapsed {
    min-width: auto;
    max-width: auto;
  }
  .sidebar-toggle {
    right: -24px;
    top: 0;
    font-size: 10px;
    padding: 2px 6px;
  }
  .sidebar-content {
    max-height: 42vh;
  }
  .search-box {
    padding: 8px;
  }
  .search-input {
    font-size: 10px;
    padding: 5px 8px;
  }
  .type-header {
    font-size: 9px;
    padding: 4px 8px 2px;
  }
  .node-item {
    padding: 3px 8px;
    gap: 4px;
  }
  .node-symbol {
    font-size: 11px;
    width: 14px;
  }
  .node-name {
    font-size: 10px;
  }
  .node-address {
    font-size: 8px;
  }
  .no-results {
    font-size: 10px;
    padding: 12px;
  }
}
</style>
