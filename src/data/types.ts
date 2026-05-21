export type NodeType =
  | 'CORE'
  | 'MUSEUM'
  | 'SUPPLY'
  | 'BOOKSTORE'
  | 'COMPANY'
  | 'ASSOCIATION'
  | 'EXHIBITION'
  | 'OLD_SUPPLY'
  | 'LOST_PLACE'
  | 'LIBRARY'
  | 'RESEARCH'

export interface DataNode {
  id: string
  name: string
  address: string
  type: NodeType
  symbol: string
  x: number
  y: number
}

export interface DataEdge {
  source: string
  target: string
  label?: string
}

export interface DataFile {
  description: string
  nodes: DataNode[]
  edges: DataEdge[]
}

export interface Node3DState {
  id: string
  name: string
  address: string
  type: NodeType
  symbol: string
  position: { x: number; y: number; z: number }
}

export type CameraMode = 'FREE_ROAM' | 'FLY_TO' | 'LOCKED'

export interface OrbitParams {
  semiMajor: number
  eccentricity: number
  rotation: number
  zDepth: number
  dashSize: number
  gapSize: number
  opacity: number
  angularVelocity: number
}

export interface DesignTokens {
  void: string
  abyssal: string
  nebula: string
  starlight: string
  parchment: string
  oldIvory: string
  fadedScroll: string
  goldLeaf: string
  amberGlow: string
  paleGold: string
  bronze: string
  coolIvory: string
  ghost: string
}
