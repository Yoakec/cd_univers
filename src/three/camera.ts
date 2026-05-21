import * as THREE from 'three'
import type { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import gsap from 'gsap'
import type { CameraMode } from '@/data/types'

export type CameraStateMachine = ReturnType<typeof createCameraStateMachine>

export function createCameraStateMachine(
  camera: THREE.PerspectiveCamera,
  controls: MapControls,
  onModeChange?: (mode: CameraMode) => void
) {
  let mode: CameraMode = 'FREE_ROAM'
  let idleTween: gsap.core.Tween | null = null
  let flyToTween: gsap.core.Timeline | null = null

  function setMode(newMode: CameraMode) {
    mode = newMode
    onModeChange?.(newMode)

    if (newMode === 'FREE_ROAM') {
      controls.enabled = true
      killIdleDrift()
    }
    if (newMode === 'FLY_TO') {
      controls.enabled = false
      killIdleDrift()
    }
    if (newMode === 'LOCKED') {
      controls.enabled = false
      startIdleDrift()
    }
  }

  function flyTo(targetPos: THREE.Vector3, duration = 1.2): Promise<void> {
    return new Promise((resolve) => {
      setMode('FLY_TO')
      flyToTween?.kill()

      const startPos = camera.position.clone()
      const startTarget = controls.target.clone()

      // Compute arc control point: offset perpendicular to view direction
      const toTarget = targetPos.clone().sub(startPos)
      const midPoint = startPos.clone().add(toTarget.clone().multiplyScalar(0.5))
      const perp = new THREE.Vector3(-toTarget.z, 0, toTarget.x).normalize()
      midPoint.add(perp.multiplyScalar(toTarget.length() * 0.35))

      // Final camera position: offset above and back from target
      const finalPos = targetPos.clone()
      finalPos.x += 15
      finalPos.y += 18
      finalPos.z += 20

      const targetObj = { t: 0 }
      const bezierP0 = startPos
      const bezierP1 = midPoint
      const bezierP2 = finalPos

      flyToTween = gsap.timeline({
        onUpdate: () => {
          const t = targetObj.t
          // Quadratic bezier: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
          const u = 1 - t
          camera.position.set(
            u * u * bezierP0.x + 2 * u * t * bezierP1.x + t * t * bezierP2.x,
            u * u * bezierP0.y + 2 * u * t * bezierP1.y + t * t * bezierP2.y,
            u * u * bezierP0.z + 2 * u * t * bezierP1.z + t * t * bezierP2.z
          )
          // Lerp target toward the node
          const targetCurr = startTarget.clone().lerp(targetPos, t * t)
          controls.target.copy(targetCurr)
        },
        onComplete: () => {
          setMode('LOCKED')
          resolve()
        },
      })

      flyToTween.to(targetObj, {
        t: 1,
        duration,
        ease: 'power3.inOut',
      })
    })
  }

  function startIdleDrift() {
    killIdleDrift()
    idleTween = gsap.to(camera.position, {
      x: `+=${Math.sin(Date.now() * 0.0001) * 2}`,
      z: `+=${Math.cos(Date.now() * 0.0001) * 2}`,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }

  function killIdleDrift() {
    idleTween?.kill()
    idleTween = null
  }

  function resetCamera(target?: THREE.Vector3) {
    flyToTween?.kill()
    setMode('FREE_ROAM')
    const t = target || new THREE.Vector3(0, -5, 0)
    controls.target.copy(t)
    camera.position.set(0, 80, 150)
    controls.update()
  }

  function getMode(): CameraMode {
    return mode
  }

  function dispose() {
    flyToTween?.kill()
    killIdleDrift()
  }

  return { setMode, flyTo, resetCamera, getMode, dispose }
}
