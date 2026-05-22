import * as THREE from 'three'
import type { CameraStateMachine } from './camera'
import type { Node3DState } from '@/data/types'

export interface InteractionCallbacks {
  onHover: (nodeId: string | null) => void
  onClick: (nodeId: string) => void
  onClickEmpty: () => void
}

export function setupInteraction(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  spriteMap: Map<string, THREE.Sprite>,
  cameraState: CameraStateMachine,
  callbacks: InteractionCallbacks,
  isMobile: boolean = false
) {
  const raycaster = new THREE.Raycaster()
  raycaster.params.Sprite = { threshold: 5 }
  const mouse = new THREE.Vector2()
  let hoveredNodeId: string | null = null

  function hitTest(clientX: number, clientY: number): string | null {
    mouse.x = (clientX / window.innerWidth) * 2 - 1
    mouse.y = -(clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const sprites = Array.from(spriteMap.values())
    const intersects = raycaster.intersectObjects(sprites)
    if (intersects.length > 0) {
      const obj = intersects[0].object as THREE.Sprite
      return (obj.userData?.nodeId as string) || null
    }
    return null
  }

  function onMouseMove(event: MouseEvent) {
    const nodeId = hitTest(event.clientX, event.clientY)
    if (nodeId && nodeId !== hoveredNodeId) {
      hoveredNodeId = nodeId
      renderer.domElement.style.cursor = 'pointer'
      callbacks.onHover(nodeId)
    } else if (!nodeId && hoveredNodeId !== null) {
      hoveredNodeId = null
      renderer.domElement.style.cursor = ''
      callbacks.onHover(null)
    }
  }

  function onClick(event: MouseEvent) {
    const nodeId = hitTest(event.clientX, event.clientY)
    if (nodeId) {
      callbacks.onClick(nodeId)
      return
    }
    callbacks.onClickEmpty()
  }

  // Touch tap detection
  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0

  function onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
      touchStartX = event.touches[0].clientX
      touchStartY = event.touches[0].clientY
      touchStartTime = Date.now()
    }
  }

  function onTouchEnd(event: TouchEvent) {
    if (event.changedTouches.length !== 1) return
    const dx = event.changedTouches[0].clientX - touchStartX
    const dy = event.changedTouches[0].clientY - touchStartY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const elapsed = Date.now() - touchStartTime

    if (dist < 8 && elapsed < 300) {
      // Confirmed tap
      const nodeId = hitTest(event.changedTouches[0].clientX, event.changedTouches[0].clientY)
      if (nodeId) {
        callbacks.onClick(nodeId)
      } else {
        callbacks.onClickEmpty()
      }
    }
  }

  if (isMobile) {
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: true })
    renderer.domElement.addEventListener('touchend', onTouchEnd, { passive: true })
    renderer.domElement.addEventListener('click', onClick)
  } else {
    renderer.domElement.addEventListener('mousemove', onMouseMove)
    renderer.domElement.addEventListener('click', onClick)
  }

  function dispose() {
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('click', onClick)
    renderer.domElement.removeEventListener('touchstart', onTouchStart)
    renderer.domElement.removeEventListener('touchend', onTouchEnd)
  }

  return { dispose }
}
