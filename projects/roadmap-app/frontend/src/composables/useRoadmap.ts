import { ref, computed, reactive, onMounted } from 'vue'
import { roadmapApi } from '@/api/client'
import type { RoadmapPhase, ProgressState, Progress } from '@/types'
import { roadmap } from '@/data/roadmap'

export function useRoadmap() {
  // ✅ Use reactive object for reliable property mutation
  const progressState = reactive<ProgressState>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const allItemIds = computed(() => {
    const ids: string[] = []
    roadmap.forEach(phase => {
      phase.sections.forEach(section => {
        section.items.forEach((_, index) => {
          ids.push(`phase-${phase.phase}-sec-${section.name}-item-${index}`)
        })
      })
    })
    return ids
  })

  const calculatePhaseProgress = (phase: RoadmapPhase): number => {
    let total = 0
    let completed = 0
    phase.sections.forEach(section => {
      section.items.forEach((_, index) => {
        const itemId = `phase-${phase.phase}-sec-${section.name}-item-${index}`
        total++
        if (progressState[itemId]) completed++
      })
    })
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  const overallProgress = computed(() => {
    const total = allItemIds.value.length
    const completed = allItemIds.value.filter(id => progressState[id]).length
    return total > 0 ? Math.round((completed / total) * 100) : 0
  })

  const loadProgress = async () => {
    loading.value = true
    error.value = null
    try {
      console.log('[useRoadmap] Fetching progress from backend...')
      const progressItems = await roadmapApi.getAllProgress()
      console.log(`[useRoadmap] Loaded ${progressItems.length} items`)
      
      progressItems.forEach(item => {
        if (item.completed) progressState[item.itemId] = true
      })
    } catch (err) {
      console.error('[useRoadmap] Failed to load progress:', err)
      error.value = 'Failed to load progress'
    } finally {
      loading.value = false
    }
  }

  const saveItemProgress = async (itemId: string, completed: boolean): Promise<boolean> => {
    try {
      console.log(`[useRoadmap] Saving progress: ${itemId} = ${completed}`)
      await roadmapApi.saveProgress(itemId, completed)
      return true
    } catch (err) {
      console.error('[useRoadmap] Save failed:', err)
      return false
    }
  }

  // ✅ Toggle logic with guaranteed reactivity
  const toggleItem = async (itemId: string, current: boolean) => {
    console.log(`[useRoadmap] toggleItem called for: ${itemId} (current: ${current})`)
    const newStatus = !current
    progressState[itemId] = newStatus // reactive object handles this safely
    
    const success = await saveItemProgress(itemId, newStatus)
    if (!success) {
      progressState[itemId] = current // revert on failure
    }
    return success
  }

  const resetAllProgress = async () => {
    allItemIds.value.forEach(id => delete progressState[id])
    localStorage.removeItem('roadmap-progress-v1')
    return true
  }

  const exportProgress = () => {
    const data = { version: 1, date: new Date().toISOString(), state: { ...progressState } }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'roadmap-progress.json'
    a.click()
  }

  const importProgress = async (file: File) => {
    const text = await file.text()
    const data = JSON.parse(text)
    if (data.state) {
      Object.assign(progressState, data.state)
      return true
    }
    throw new Error('Invalid file')
  }

  onMounted(() => loadProgress())

  return {
    roadmap,
    progressState,
    loading,
    error,
    overallProgress,
    calculatePhaseProgress,
    toggleItem,
    resetAllProgress,
    exportProgress,
    importProgress
  }
}