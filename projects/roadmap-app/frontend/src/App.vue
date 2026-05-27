<template>
  <div class="app">
    <header class="header">
      <h1>Full-Stack + Cloud Engineer Roadmap</h1>
      <p>TypeScript · TypeORM · Vue.js · Node.js · MongoDB · PostgreSQL · AWS</p>
    </header>

    <div class="overall-progress">
      <span class="label">Overall Progress</span>
      <div class="bar-wrap"><div class="bar-outer"><div class="bar-inner" :style="{ width: overallProgress + '%' }"></div></div></div>
      <span class="pct">{{ overallProgress }}%</span>
    </div>

    <div class="controls">
      <button @click="expandAll">Expand All</button>
      <button @click="collapseAll">Collapse All</button>
      <button @click="exportProgress">Export</button>
      <button @click="triggerImport">Import</button>
      <button class="danger" @click="resetAll">Reset</button>
      <!-- ✅ DEBUG BUTTON -->
      <button @click="testApi" style="border-color: var(--cyan); color: var(--cyan)">Test API</button>
    </div>

    <div v-if="loading" style="text-align:center;padding:20px;color:var(--text-dim)">Loading progress...</div>
    <div v-if="error" style="text-align:center;padding:20px;color:var(--red)">{{ error }}</div>

    <div class="timeline">
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

    <input type="file" ref="fileInputRef" accept=".json" style="display:none" @change="handleFileImport" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PhaseCard from './components/PhaseCard.vue'
import { useRoadmap } from './composables/useRoadmap'
import { roadmapApi } from './api/client'

const {
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
} = useRoadmap()

const fileInputRef = ref<HTMLInputElement | null>(null)
const phaseRefs = ref<Record<number, any>>({})

const expandAll = () => Object.values(phaseRefs.value).forEach((p: any) => p?.$el.classList.add('open'))
const collapseAll = () => Object.values(phaseRefs.value).forEach((p: any) => p?.$el.classList.remove('open'))

const handleToggle = async (itemId: string, current: boolean) => {
  console.log(`[App] Toggle received: ${itemId} (current: ${current})`)
  await toggleItem(itemId, current)
}

const resetAll = async () => {
  if (!confirm('Reset all progress?')) return
  await resetAllProgress()
}

const triggerImport = () => fileInputRef.value?.click()
const handleFileImport = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    try { await importProgress(file); alert('Imported!') }
    catch (err) { alert('Import failed') }
  }
}

// ✅ DEBUG: Direct API test
const testApi = async () => {
  console.log('[APP] Testing direct API call...')
  try {
    const res = await roadmapApi.getAllProgress()
    console.log('[APP] API Success! Items:', res.length)
    alert(`API Works! Fetched ${res.length} progress records.`)
  } catch (err) {
    console.error('[APP] API Failed:', err)
    alert('API FAILED! Check console for details.')
  }
}
</script>