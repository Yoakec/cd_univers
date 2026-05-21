import * as THREE from 'three'

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#000a16')
  scene.fog = new THREE.FogExp2('#000a16', 0.00015)
  return scene
}

export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 80, 150)
  camera.lookAt(0, 0, 0)
  return camera
}

export function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  container.appendChild(renderer.domElement)
  return renderer
}

export function createAmbientLight(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight('#1a2a3a', 0.3)
  scene.add(ambient)
  const point = new THREE.PointLight('#FFD700', 2, 200)
  point.position.set(0, 30, 0)
  scene.add(point)
}
