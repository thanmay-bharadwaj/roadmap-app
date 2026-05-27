<template>
  <div class="app">
    <header class="header">
      <h1>Full-Stack + Cloud Engineer Roadmap</h1>
      <p>TypeScript · TypeORM · Vue.js · Node.js · MongoDB · PostgreSQL · AWS</p>
    </header>

    <OverallProgress :overall-progress="overallProgress" />

    <div class="controls">
      <button @click="expandAll">Expand All</button>
      <button @click="collapseAll">Collapse All</button>
      <button @click="exportProgress">Export Progress</button>
      <button @click="triggerImport">Import Progress</button>
      <button class="danger" @click="resetAll">Reset All</button>
    </div>

    <div v-if="loading" class="loading">Loading progress...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="timeline" ref="timelineRef">
      <PhaseCard
        v-for="phase in roadmap"
        :key="phase.phase"
        :phase="phase"
        :progress-state="progressState"
        :phase-progress="calculatePhaseProgress(phase)"
        @toggle="handleToggle"
        :ref="el => { if (el) phaseRefs[phase.phase] = el }"
      />
    </div>

    <div v-if="toastMessage" class="toast show">{{ toastMessage }}</div>

    <input 
      type="file" 
      ref="fileInputRef" 
      accept=".json" 
      style="display: none" 
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import OverallProgress from './components/OverallProgress.vue'
import PhaseCard from './components/PhaseCard.vue'
import { useRoadmap } from './composables/useRoadmap'

const {
  roadmap,
  progressState,
  loading,
  error,
  overallProgress,
  calculatePhaseProgress,
  toggleItem,
  resetAllProgress,
  exportProgress: exportProgressData,
  importProgress: importProgressData
} = useRoadmap()

const timelineRef = ref<HTMLElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const phaseRefs = ref<Record<number, any>>({})
const toastMessage = ref<string>('')

// Expand/Collapse all phases
const expandAll = () => {
  Object.values(phaseRefs.value).forEach((phase: any) => {
    if (phase?.$el) {
      phase.$el.classList.add('open')
    }
  })
}

const collapseAll = () => {
  Object.values(phaseRefs.value).forEach((phase: any) => {
    if (phase?.$el) {
      phase.$el.classList.remove('open')
    }
  })
}

// Handle item toggle
const handleToggle = async (itemId: string, current: boolean) => {
  await toggleItem(itemId, current)
  showToast('Progress saved')
}

// Export progress
const exportProgress = () => {
  exportProgressData()
  showToast('Progress exported')
}

// Trigger file import
const triggerImport = () => {
  fileInputRef.value?.click()
}

// Handle imported file
const handleFileImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  try {
    await importProgressData(file)
    showToast('Progress imported')
  } catch (err) {
    showToast('Failed to import file')
    console.error(err)
  }
  
  // Reset input
  input.value = ''
}

// Reset all progress
const resetAll = async () => {
  if (!confirm('Reset all progress? This cannot be undone.')) return
  
  await resetAllProgress()
  showToast('Progress reset')
}

// Show toast notification
const showToast = (message: string) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: var(--text-dim);
}

.error {
  color: var(--red);
}
</style>