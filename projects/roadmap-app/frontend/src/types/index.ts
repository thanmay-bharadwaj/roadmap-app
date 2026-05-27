export interface Progress {
  id: number
  itemId: string
  completed: boolean
  createdAt: string
}

export interface RoadmapItem {
  id: string
  text: string
  completed: boolean
}

export interface RoadmapSection {
  name: string
  badge: string
  items: string[]
  resources?: string
}

export interface RoadmapPhase {
  phase: number
  title: string
  weeks: string
  icon: string
  sections: RoadmapSection[]
}

export interface ProgressState {
  [itemId: string]: boolean
}

export interface ExportData {
  version: number
  date: string
  state: ProgressState
}