import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const STORAGE_KEY = 'roadmap-progress-v1'
  const checkedItems = ref<Set<string>>(new Set())
  const isInitialized = ref(false)

  const loadProgress = async () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        checkedItems.value = new Set(Object.keys(parsed).filter(k => parsed[k]))
      }
    } catch (e) {
      console.error('Failed to load progress:', e)
    }
    isInitialized.value = true
  }

  const saveProgress = () => {
    const state: Record<string, boolean> = {}
    checkedItems.value.forEach(id => { state[id] = true })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const toggleItem = async (itemId: string) => {
    if (checkedItems.value.has(itemId)) {
      checkedItems.value.delete(itemId)
    } else {
      checkedItems.value.add(itemId)
    }
    saveProgress()
  }

  const isItemChecked = (itemId: string) => checkedItems.value.has(itemId)

  const getPhaseProgress = (phase: number, sections: Array<{ name: string; items: string[] }>) => {
    let total = 0
    let completed = 0
    
    sections.forEach((section, sectionIndex) => {
      section.items.forEach((_, itemIndex) => {
        const id = `${phase}-${section.name}-${itemIndex}`
        total++
        if (checkedItems.value.has(id)) completed++
      })
    })
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const getOverallProgress = (allPhases: Array<{ phase: number; sections: Array<{ name: string; items: string[] }> }>) => {
    let total = 0
    let completed = 0
    
    allPhases.forEach(phase => {
      phase.sections.forEach((section, sectionIndex) => {
        section.items.forEach((_, itemIndex) => {
          const id = `${phase.phase}-${section.name}-${itemIndex}`
          total++
          if (checkedItems.value.has(id)) completed++
        })
      })
    })
    
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const exportProgress = () => {
    const state: Record<string, boolean> = {}
    checkedItems.value.forEach(id => { state[id] = true })
    const data = JSON.stringify({ 
      version: 1, 
      date: new Date().toISOString(), 
      state 
    }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roadmap-progress.json'
    a.click()
    URL.revokeObjectURL(url)
    return true
  }

  const importProgress = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.state) {
            checkedItems.value = new Set(Object.keys(data.state).filter(k => data.state[k]))
            saveProgress()
            resolve(true)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const resetAll = () => {
    checkedItems.value.clear()
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    checkedItems,
    isInitialized,
    loadProgress,
    toggleItem,
    isItemChecked,
    getPhaseProgress,
    getOverallProgress,
    exportProgress,
    importProgress,
    resetAll
  }
})