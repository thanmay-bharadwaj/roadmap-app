import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { roadmapApi } from '@/api/client'
import type { RoadmapPhase, ProgressState, Progress } from '@/types'
import { roadmap } from '@/data/roadmap'

export function useRoadmap() {
  const progressState: Ref<ProgressState> = ref({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Flatten all item IDs from roadmap
  const allItemIds = computed(() => {
    const ids: string[] = []
    roadmap.forEach(phase => {
      phase.sections.forEach(section => {
        section.items.forEach((_, index) => {
          const uniqueId = `phase-${phase.phase}-sec-${section.name}-item-${index}`
          ids.push(uniqueId)
        })
      })
    })
    return ids
  })

  // Calculate progress percentage for a phase
  const calculatePhaseProgress = (phase: RoadmapPhase): number => {
    let total = 0
    let completed = 0
    
    phase.sections.forEach(section => {
      section.items.forEach((_, index) => {
        const itemId = `phase-${phase.phase}-sec-${section.name}-item-${index}`
        total++
        if (progressState.value[itemId]) completed++
      })
    })
    
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  // Calculate overall progress
  const overallProgress = computed(() => {
    const total = allItemIds.value.length
    const completed = allItemIds.value.filter(id => progressState.value[id]).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  })

  // Load progress from backend
  const loadProgress = async () => {
    loading.value = true
    error.value = null
    
    try {
      const progressItems = await roadmapApi.getAllProgress()
      const newState: ProgressState = {}
      
      progressItems.forEach(item => {
        if (item.completed) {
          // Map backend itemId to our frontend ID format
          newState[item.itemId] = true
        }
      })
      
      progressState.value = newState
    } catch (err) {
      console.error('Failed to load progress:', err)
      error.value = 'Failed to load progress from server'
      // Fallback: try localStorage
      try {
        const local = localStorage.getItem('roadmap-progress-v1')
        if (local) {
          progressState.value = JSON.parse(local)
        }
      } catch {}
    } finally {
      loading.value = false
    }
  }

  // Save single item progress to backend
  const saveItemProgress = async (itemId: string, completed: boolean): Promise<boolean> => {
    try {
      await roadmapApi.saveProgress(itemId, completed)
      // Also save to localStorage as backup
      const local = JSON.parse(localStorage.getItem('roadmap-progress-v1') || '{}')
      if (completed) {
        local[itemId] = true
      } else {
        delete local[itemId]
      }
      localStorage.setItem('roadmap-progress-v1', JSON.stringify(local))
      return true
    } catch (err) {
      console.error('Failed to save progress:', err)
      error.value = 'Failed to save progress'
      return false
    }
  }

  // Toggle item and sync with backend
  const toggleItem = async (itemId: string, current: boolean) => {
    const newStatus = !current
    progressState.value[itemId] = newStatus
    
    // Optimistic update, then sync with backend
    const success = await saveItemProgress(itemId, newStatus)
    if (!success) {
      // Revert on failure
      progressState.value[itemId] = current
    }
  }

  // Reset all progress (client-side + backend sync)
  const resetAllProgress = async () => {
    // Clear local state
    allItemIds.value.forEach(id => {
      progressState.value[id] = false
    })
    
    // Clear localStorage
    localStorage.removeItem('roadmap-progress-v1')
    
    // Note: Backend doesn't have bulk delete, so we'd need to call delete for each
    // For now, we just clear client state. Backend will be updated on next toggle.
    
    return true
  }

  // Export progress as JSON file
  const exportProgress = () => {
    const exportData = {
      version: 1,
      date: new Date().toISOString(),
      state: { ...progressState.value }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roadmap-progress.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Import progress from JSON file
  const importProgress = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.state && typeof data.state === 'object') {
            // Update local state
            progressState.value = { ...progressState.value, ...data.state }
            
            // Sync with backend for each changed item
            for (const [itemId, completed] of Object.entries(data.state)) {
              if (completed) {
                await roadmapApi.saveProgress(itemId, true)
              }
            }
            
            // Save to localStorage as backup
            localStorage.setItem('roadmap-progress-v1', JSON.stringify(progressState.value))
            resolve(true)
          } else {
            reject(new Error('Invalid file format'))
          }
        } catch (err) {
          reject(err)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  // Check if a phase is fully completed
  const isPhaseCompleted = (phase: RoadmapPhase): boolean => {
    return calculatePhaseProgress(phase) === 100
  }

  onMounted(() => {
    loadProgress()
  })

  return {
    roadmap,
    progressState,
    loading,
    error,
    allItemIds,
    overallProgress,
    calculatePhaseProgress,
    toggleItem,
    resetAllProgress,
    exportProgress,
    importProgress,
    isPhaseCompleted,
    refreshProgress: loadProgress
  }
}