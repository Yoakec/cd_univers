import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import type { DataNode, Node3DState } from '@/data/types'

// Design token: color per node type
const TYPE_COLORS: Record<string, string> = {
  CORE: '#FFD700',
  MUSEUM: '#FDF5E6',
  EXHIBITION: '#F8E8C0',
  COMPANY: '#FDF5E6',
  BOOKSTORE: '#F5F1E1',
  LIBRARY: '#F5F1E1',
  ASSOCIATION: '#F8E8C0',
  RESEARCH: '#FDF5E6',
  SUPPLY: '#EDE8D6',
  OLD_SUPPLY: '#C8D0D8',
  LOST_PLACE: '#6B7B8D',
}

// Z-depth encoding by node type
const TYPE_Z_DEPTH: Record<string, number> = {
  CORE: 20,
  MUSEUM: 10,
  EXHIBITION: 10,
  COMPANY: 0,
  BOOKSTORE: 0,
  LIBRARY: 0,
  ASSOCIATION: -5,
  RESEARCH: -5,
  SUPPLY: -10,
  OLD_SUPPLY: -10,
  LOST_PLACE: -20,
}

// Which types receive bloom (CORE, MUSEUM, EXHIBITION)
const BLOOM_TYPES = new Set(['CORE', 'MUSEUM', 'EXHIBITION'])

function createSymbolTexture(symbol: string, colorHex: string, hasBloom: boolean): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  const center = size / 2
  const fontSize = symbol.length > 1 ? 80 : 140

  if (hasBloom) {
    // Outer glow layer
    ctx.font = `${fontSize + 30}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(255, 215, 0, 0.25)'
    ctx.fillText(symbol, center, center)
  }

  // Main symbol
  ctx.font = `${fontSize}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = colorHex
  ctx.fillText(symbol, center, center)

  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.premultiplyAlpha = true
  return tex
}

export function createNodeSprites(nodes: DataNode[]): Map<string, { sprite: THREE.Sprite; node3D: Node3DState }> {
  const map = new Map<string, { sprite: THREE.Sprite; node3D: Node3DState }>()

  for (const node of nodes) {
    const color = TYPE_COLORS[node.type] || '#FDF5E6'
    const z = TYPE_Z_DEPTH[node.type] || 0
    const hasBloom = BLOOM_TYPES.has(node.type)

    const texture = createSymbolTexture(node.symbol, color, hasBloom)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    })
    const sprite = new THREE.Sprite(material)

    // Scale: CORE is larger
    const scale = node.type === 'CORE' ? 8 : 4
    sprite.scale.set(scale, scale, 1)
    sprite.position.set(node.x, z, -node.y)

    // Store user data for raycasting
    sprite.userData = { nodeId: node.id, nodeType: node.type }

    const node3D: Node3DState = {
      id: node.id,
      name: node.name,
      address: node.address,
      type: node.type,
      symbol: node.symbol,
      position: { x: node.x, y: z, z: -node.y },
    }

    map.set(node.id, { sprite, node3D })
  }

  return map
}

export function createNodeLabel(name: string, address: string, type: string): CSS2DObject {
  const div = document.createElement('div')
  div.className = 'node-label'

  const nameEl = document.createElement('div')
  nameEl.className = 'node-label-name'
  nameEl.textContent = name

  const addrEl = document.createElement('div')
  addrEl.className = 'node-label-address'
  addrEl.textContent = address

  div.appendChild(nameEl)
  div.appendChild(addrEl)

  // Style
  const fontSize = type === 'CORE' ? '14px' : '11px'
  nameEl.style.cssText = `
    font-family: 'Noto Serif SC', serif;
    font-weight: bold;
    font-size: ${fontSize};
    color: #FDF5E6;
    white-space: nowrap;
    text-shadow: 0 0 4px rgba(0,0,0,0.8);
  `
  addrEl.style.cssText = `
    font-family: 'IBM Plex Sans', 'Heebo', sans-serif;
    font-weight: 300;
    font-size: 9px;
    color: #F5F1E1;
    white-space: nowrap;
    text-shadow: 0 0 3px rgba(0,0,0,0.8);
  `

  return new CSS2DObject(div)
}
