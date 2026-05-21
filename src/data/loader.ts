import type { DataFile } from './types'

export async function loadData(): Promise<DataFile> {
  const response = await fetch('/resoures/data/data.json')
  if (!response.ok) throw new Error(`Failed to load data: ${response.status}`)
  return response.json()
}
