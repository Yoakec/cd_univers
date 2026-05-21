<template>
  <div class="universe-container">
    <div ref="canvasContainer" class="canvas-container"></div>
    <div ref="css2dContainer" class="css2d-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { createScene, createCamera, createRenderer, createAmbientLight } from '@/three/scene'
import { createStarfield } from '@/three/starfield'
import { createDecorativeOrbits, updateOrbitRotations } from '@/three/orbits'
import { createPostProcessing } from '@/three/postprocessing'
import { createNodeSprites, createNodeLabel } from '@/three/nodes'
import { createStructuralEdges, createClusterOrbits, updateEdgeMarchingAnts } from '@/three/edges'
import { createCameraStateMachine, type CameraStateMachine } from '@/three/camera'
import { setupInteraction } from '@/three/interaction'
import { loadData } from '@/data/loader'
import type { DataFile, OrbitParams, Node3DState, CameraMode } from '@/data/types'

const emit = defineEmits<{
  (e: 'hover-node', nodeId: string | null): void
  (e: 'focus-node', nodeId: string): void
  (e: 'camera-mode-change', mode: CameraMode): void
}>()

const canvasContainer = ref<HTMLElement | null>(null)
const css2dContainer = ref<HTMLElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let css2DRenderer: CSS2DRenderer
let controls: MapControls
let composer: any
let starfield: THREE.Points
let decorativeOrbitsGroup: THREE.Group
let decorativeOrbitParams: OrbitParams[]
let edgesGroup: THREE.Group
let clusterGroup: THREE.Group
let animationId: number
let clock: THREE.Clock
let nodeSpriteMap: Map<string, THREE.Sprite>
let nodeDataMap: Map<string, Node3DState>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let labelMap: Map<string, any>
let cameraState: CameraStateMachine
let interactionDispose: () => void

onMounted(async () => {
  if (!canvasContainer.value || !css2dContainer.value) return

  clock = new THREE.Clock()

  // Load data
  const data: DataFile = await loadData()

  // Scene foundation
  scene = createScene()
  camera = createCamera()
  renderer = createRenderer(canvasContainer.value)
  createAmbientLight(scene)

  // CSS2D renderer for text labels
  css2DRenderer = new CSS2DRenderer()
  css2DRenderer.setSize(window.innerWidth, window.innerHeight)
  css2DRenderer.domElement.style.position = 'absolute'
  css2DRenderer.domElement.style.top = '0'
  css2DRenderer.domElement.style.pointerEvents = 'none'
  css2dContainer.value.appendChild(css2DRenderer.domElement)

  // Orbit controls
  controls = new MapControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.minDistance = 10
  controls.maxDistance = 300
  controls.maxPolarAngle = Math.PI * 0.7
  controls.target.set(0, -5, 0)

  // Starfield
  starfield = createStarfield()
  scene.add(starfield)

  // Decorative orbits
  const { group, params } = createDecorativeOrbits(22)
  decorativeOrbitsGroup = group
  decorativeOrbitParams = params
  scene.add(group)

  // Node sprites
  const spriteMap = createNodeSprites(data.nodes)
  nodeSpriteMap = new Map()
  nodeDataMap = new Map()
  labelMap = new Map()
  for (const [id, { sprite, node3D }] of spriteMap) {
    nodeSpriteMap.set(id, sprite)
    nodeDataMap.set(id, node3D)
    scene.add(sprite)

    // Create CSS2D label
    const label = createNodeLabel(node3D.name, node3D.address, node3D.type)
    label.position.copy(sprite.position)
    // Offset label to the right of the sprite
    label.position.x += node3D.type === 'CORE' ? 6 : 4
    label.position.y += 1
    scene.add(label)
    labelMap.set(id, label)
  }

  // Structural edges
  edgesGroup = createStructuralEdges(data.edges, nodeDataMap)
  scene.add(edgesGroup)

  // Cluster orbits
  clusterGroup = createClusterOrbits(data.nodes, nodeDataMap)
  scene.add(clusterGroup)

  // Camera state machine
  cameraState = createCameraStateMachine(camera, controls, (mode) => {
    emit('camera-mode-change', mode)
  })

  // Interaction (hover + click)
  interactionDispose = setupInteraction(
    renderer, camera, nodeSpriteMap, cameraState,
    {
      onHover: (nodeId) => emit('hover-node', nodeId),
      onClick: (nodeId) => {
        emit('focus-node', nodeId)
        const node = nodeDataMap.get(nodeId)
        if (node) {
          cameraState.flyTo(new THREE.Vector3(node.position.x, node.position.y, node.position.z))
        }
      },
      onClickEmpty: () => {
        if (cameraState.getMode() === 'LOCKED') {
          cameraState.setMode('FREE_ROAM')
        }
      },
    }
  )

  // Post-processing
  composer = createPostProcessing(renderer, scene, camera)

  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate)

    const dt = Math.min(clock.getDelta(), 0.1)
    controls.update()
    updateOrbitRotations(decorativeOrbitsGroup, decorativeOrbitParams, dt)

    // Marching ants on structural edges
    updateEdgeMarchingAnts(dt)

    // Label opacity falloff based on camera distance
    for (const [_id, label] of labelMap) {
      const dist = camera.position.distanceTo(label.position)
      const opacity = Math.max(0.1, Math.min(1, 1 - (dist - 20) / 250))
      label.element.style.opacity = String(opacity)
    }

    composer.render()
    css2DRenderer.render(scene, camera)
  }

  animate()

  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  interactionDispose?.()
  cameraState?.dispose()
  controls?.dispose()
  renderer?.dispose()
  css2DRenderer?.domElement?.remove()
})

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  css2DRenderer.setSize(window.innerWidth, window.innerHeight)
  composer?.setSize(window.innerWidth, window.innerHeight)
}
</script>

<style scoped>
.universe-container {
  position: fixed;
  inset: 0;
  z-index: 0;
}
.canvas-container {
  width: 100%;
  height: 100%;
}
.canvas-container :deep(canvas) {
  display: block;
}
.css2d-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}
</style>
