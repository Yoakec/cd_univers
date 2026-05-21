import * as THREE from 'three'
import type { OrbitParams } from '@/data/types'

function generateOrbitParams(): OrbitParams {
  return {
    semiMajor: 20 + Math.random() * 110,
    eccentricity: 0.1 + Math.random() * 0.75,
    rotation: Math.random() * Math.PI * 2,
    zDepth: -15 + Math.random() * 30,
    dashSize: 0.5 + Math.random() * 2.5,
    gapSize: 0.3 + Math.random() * 1.2,
    opacity: 0.06 + Math.random() * 0.14,
    angularVelocity: (Math.random() - 0.5) * 0.08,
  }
}

function createDashedEllipseGeometry(params: OrbitParams, segments = 320): THREE.BufferGeometry {
  const curve = new THREE.EllipseCurve(
    0, 0,
    params.semiMajor, params.semiMajor * (1 - params.eccentricity),
    0, Math.PI * 2,
    false,
    params.rotation
  )

  const totalArcLength = curve.getLength()
  const points: THREE.Vector3[] = []

  // Sample the curve densely and dashify by arc length
  let arcPos = 0
  let drawing = true
  const dashLen = params.dashSize * 3
  const gapLen = params.gapSize * 3
  const step = totalArcLength / segments

  while (arcPos < totalArcLength) {
    const segmentEnd = drawing
      ? Math.min(arcPos + dashLen, totalArcLength)
      : Math.min(arcPos + gapLen, totalArcLength)

    if (drawing) {
      const segSteps = Math.ceil((segmentEnd - arcPos) / step)
      for (let s = 0; s <= segSteps; s++) {
        const t = Math.min(arcPos + s * step, totalArcLength) / totalArcLength
        const pt = curve.getPoint(t)
        points.push(new THREE.Vector3(pt.x, params.zDepth, pt.y))
      }
    }

    arcPos = segmentEnd
    drawing = !drawing
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(points)
  return geometry
}

export function createDecorativeOrbits(count = 50): { group: THREE.Group; params: OrbitParams[] } {
  const group = new THREE.Group()
  const orbitParams: OrbitParams[] = []

  for (let i = 0; i < count; i++) {
    const params = generateOrbitParams()
    orbitParams.push(params)

    const geometry = createDashedEllipseGeometry(params)

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color('#FDF5E6'),
      transparent: true,
      opacity: params.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const line = new THREE.Line(geometry, material)
    group.add(line)
  }

  return { group, params: orbitParams }
}

export function updateOrbitRotations(group: THREE.Group, params: OrbitParams[], deltaTime: number): void {
  group.children.forEach((line, i) => {
    line.rotation.y += params[i].angularVelocity * deltaTime
  })
}
