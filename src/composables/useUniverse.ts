import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import * as THREE from 'three'
import type { DataFile, Node3DState, CameraMode } from '@/data/types'
import { createScene } from '@/three/scene'
import { createStarfield } from '@/three/starfield'
import { createDecorativeOrbits } from '@/three/orbits'
import { createPostProcessing } from '@/three/postprocessing'
import { loadData } from '@/data/loader'

export interface UniverseState {
  focusedNode: Ref<string | null>
  hoveredNode: Ref<string | null>
  cameraMode: Ref<CameraMode>
  isLoading: Ref<boolean>
  nodes: Ref<Map<string, Node3DState>>
}

export function useUniverse(containerRef: Ref<HTMLElement | null>): UniverseState {
  const focusedNode = ref<string | null>(null)
  const hoveredNode = ref<string | null>(null)
  const cameraMode = ref<CameraMode>('FREE_ROAM')
  const isLoading = ref(true)
  const nodes = ref<Map<string, Node3DState>>(new Map())

  // Three.js internals (not exposed reactively)
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let renderer: THREE.WebGLRenderer
  let css2DRenderer: any
  let composer: any
  let orbitControls: any
  let decorativeOrbits: THREE.Group
  let starfield: THREE.Points
  let animationId: number

  const dispose = () => {
    cancelAnimationFrame(animationId)
    renderer?.dispose()
    composer?.dispose?.()
    scene?.clear()
  }

  return {
    focusedNode,
    hoveredNode,
    cameraMode,
    isLoading,
    nodes,
  }
}
