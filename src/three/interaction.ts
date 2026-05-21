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
  callbacks: InteractionCallbacks
) {
  const raycaster = new THREE.Raycaster()
  raycaster.params.Sprite = { threshold: 5 }
  const mouse = new THREE.Vector2()
  let hoveredNodeId: string | null = null

  function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const sprites = Array.from(spriteMap.values())
    const intersects = raycaster.intersectObjects(sprites)

    if (intersects.length > 0) {
      const obj = intersects[0].object as THREE.Sprite
      const nodeId = obj.userData?.nodeId as string | undefined
      if (nodeId && nodeId !== hoveredNodeId) {
        hoveredNodeId = nodeId
        renderer.domElement.style.cursor = 'pointer'
        callbacks.onHover(nodeId)
      }
    } else {
      if (hoveredNodeId !== null) {
        hoveredNodeId = null
        renderer.domElement.style.cursor = ''
        callbacks.onHover(null)
      }
    }
  }

  function onClick(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const sprites = Array.from(spriteMap.values())
    const intersects = raycaster.intersectObjects(sprites)

    if (intersects.length > 0) {
      const obj = intersects[0].object as THREE.Sprite
      const nodeId = obj.userData?.nodeId as string | undefined
      if (nodeId) {
        callbacks.onClick(nodeId)
        return
      }
    }

    callbacks.onClickEmpty()
  }

  renderer.domElement.addEventListener('mousemove', onMouseMove)
  renderer.domElement.addEventListener('click', onClick)

  function dispose() {
    renderer.domElement.removeEventListener('mousemove', onMouseMove)
    renderer.domElement.removeEventListener('click', onClick)
  }

  return { dispose }
}
