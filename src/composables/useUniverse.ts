import { ref, type Ref } from 'vue'
import type { CameraMode, Node3DState } from '@/data/types'

export interface UniverseState {
  focusedNode: Ref<string | null>
  hoveredNode: Ref<string | null>
  cameraMode: Ref<CameraMode>
  isLoading: Ref<boolean>
  nodes: Ref<Map<string, Node3DState>>
}

export function useUniverse(): UniverseState {
  const focusedNode = ref<string | null>(null)
  const hoveredNode = ref<string | null>(null)
  const cameraMode = ref<CameraMode>('FREE_ROAM')
  const isLoading = ref(true)
  const nodes = ref<Map<string, Node3DState>>(new Map())

  return {
    focusedNode,
    hoveredNode,
    cameraMode,
    isLoading,
    nodes,
  }
}
