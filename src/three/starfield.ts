import * as THREE from 'three'

export function createStarfield(): THREE.Points {
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // spherical distribution with large radius
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 180 + Math.random() * 120

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    // Color distribution: 95% white, 3% warm gold, 2% cool blue
    const colorRoll = Math.random()
    let r_c: number, g_c: number, b_c: number

    if (colorRoll < 0.93) {
      // warm white at varying brightness
      const brightness = 0.3 + Math.random() * 0.7
      r_c = 0.99 * brightness
      g_c = 0.96 * brightness
      b_c = 0.90 * brightness
    } else if (colorRoll < 0.96) {
      // gold stars
      const brightness = 0.3 + Math.random() * 0.4
      r_c = 1.0 * brightness
      g_c = 0.84 * brightness
      b_c = 0.0
    } else {
      // cool blue stars
      const brightness = 0.3 + Math.random() * 0.5
      r_c = 0.72 * brightness
      g_c = 0.85 * brightness
      b_c = 0.94 * brightness
    }

    colors[i * 3] = r_c
    colors[i * 3 + 1] = g_c
    colors[i * 3 + 2] = b_c

    sizes[i] = 0.1 + Math.random() * 1.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.9,
  })

  return new THREE.Points(geometry, material)
}
