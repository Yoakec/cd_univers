import * as THREE from 'three'
import type { DataEdge, DataNode, Node3DState } from '@/data/types'

interface EdgeAnimData {
  line: THREE.LineSegments
  start: THREE.Vector3
  end: THREE.Vector3
  dashLength: number
  gapLength: number
  offset: number
}

const edgeAnimDataList: EdgeAnimData[] = []

function buildDashGeometry(start: THREE.Vector3, end: THREE.Vector3, dashLen: number, gapLen: number, offset: number): Float32Array {
  const dir = end.clone().sub(start)
  const totalLen = dir.length()
  if (totalLen < 0.001) return new Float32Array(0)
  dir.normalize()

  const cycleLen = dashLen + gapLen
  // Wrap offset within one cycle
  let pos = -(offset % cycleLen)
  if (pos < 0) pos += cycleLen

  const positions: number[] = []

  while (pos < totalLen) {
    const segEnd = Math.min(pos + dashLen, totalLen)
    if (segEnd > 0 && pos < totalLen) {
      const s = Math.max(0, pos)
      const e = segEnd
      if (e > s) {
        const p0 = start.clone().addScaledVector(dir, s)
        const p1 = start.clone().addScaledVector(dir, e)
        positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
      }
    }
    pos += cycleLen
  }

  return new Float32Array(positions)
}

export function createStructuralEdges(
  edges: DataEdge[],
  node3DMap: Map<string, Node3DState>
): THREE.Group {
  const group = new THREE.Group()
  edgeAnimDataList.length = 0

  for (const edge of edges) {
    const sourceNode = node3DMap.get(edge.source)
    const targetNode = node3DMap.get(edge.target)
    if (!sourceNode || !targetNode) continue

    const start = new THREE.Vector3(
      sourceNode.position.x, sourceNode.position.y, sourceNode.position.z
    )
    const end = new THREE.Vector3(
      targetNode.position.x, targetNode.position.y, targetNode.position.z
    )

    const dashLen = 1.5
    const gapLen = 0.8

    const positions = buildDashGeometry(start, end, dashLen, gapLen, 0)
    if (positions.length === 0) continue

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setDrawRange(0, positions.length / 3)

    const material = new THREE.LineBasicMaterial({
      color: '#FFD700',
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const line = new THREE.LineSegments(geometry, material)
    group.add(line)

    edgeAnimDataList.push({
      line, start: start.clone(), end: end.clone(),
      dashLength: dashLen, gapLength: gapLen, offset: Math.random() * (dashLen + gapLen),
    })
  }

  return group
}

export function updateEdgeMarchingAnts(dt: number): void {
  const speed = 1.2 // units per second
  for (const data of edgeAnimDataList) {
    data.offset += speed * dt
    const positions = buildDashGeometry(
      data.start, data.end,
      data.dashLength, data.gapLength,
      data.offset
    )
    if (positions.length === 0) continue

    const geom = data.line.geometry
    const attr = geom.getAttribute('position') as THREE.BufferAttribute
    if (attr.count * 3 !== positions.length) {
      // Resize if dash count changed
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    } else {
      attr.set(positions)
    }
    attr.needsUpdate = true
    geom.setDrawRange(0, positions.length / 3)
  }
}

function computeEllipseForPoints(points: { x: number; z: number }[]): THREE.EllipseCurve | null {
  if (points.length < 3) return null
  let cx = 0, cz = 0
  for (const p of points) { cx += p.x; cz += p.z }
  cx /= points.length; cz /= points.length
  let maxDist = 0
  for (const p of points) {
    const d = Math.sqrt((p.x - cx) ** 2 + (p.z - cz) ** 2)
    if (d > maxDist) maxDist = d
  }
  try {
    return new THREE.EllipseCurve(cx, cz, maxDist * 1.35, maxDist * 1.35 * 0.55, 0, Math.PI * 2, false, 0)
  } catch {
    return null
  }
}

export function createClusterOrbits(
  nodes: DataNode[],
  node3DMap: Map<string, Node3DState>
): THREE.Group {
  const group = new THREE.Group()

  const byType = new Map<string, DataNode[]>()
  for (const node of nodes) {
    if (!byType.has(node.type)) byType.set(node.type, [])
    byType.get(node.type)!.push(node)
  }

  for (const [type, typeNodes] of byType) {
    if (typeNodes.length < 3 || type === 'CORE') continue

    const zY = node3DMap.get(typeNodes[0].id)?.position.y || 0
    const pts = typeNodes.map(n => {
      const nd = node3DMap.get(n.id)
      return { x: nd?.position.x || n.x, z: nd?.position.z || -n.y }
    })

    const curve = computeEllipseForPoints(pts)
    if (!curve) continue

    const dashPoints: THREE.Vector3[] = []
    const totalLen = curve.getLength()
    const dashLen = 1.2
    const gapLen = 0.6
    let arcPos = 0
    let drawing = true
    const step = totalLen / 240

    while (arcPos < totalLen) {
      const segEnd = drawing
        ? Math.min(arcPos + dashLen, totalLen)
        : Math.min(arcPos + gapLen, totalLen)
      if (drawing) {
        for (let s = arcPos; s <= segEnd; s += step) {
          const pt = curve.getPoint(s / totalLen)
          dashPoints.push(new THREE.Vector3(pt.x, zY, pt.y))
        }
      }
      arcPos = segEnd
      drawing = !drawing
    }

    if (dashPoints.length >= 2) {
      const geom = new THREE.BufferGeometry().setFromPoints(dashPoints)
      const mat = new THREE.LineBasicMaterial({
        color: '#FDF5E6',
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      group.add(new THREE.Line(geom, mat))
    }
  }

  return group
}
