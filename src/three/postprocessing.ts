import * as THREE from 'three'
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing'

export function createPostProcessing(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
): EffectComposer {
  const composer = new EffectComposer(renderer)

  composer.addPass(new RenderPass(scene, camera))

  const bloomEffect = new BloomEffect({
    intensity: 0.8,
    luminanceThreshold: 0.85,
    luminanceSmoothing: 0.4,
  })

  composer.addPass(new EffectPass(camera, bloomEffect))

  return composer
}
