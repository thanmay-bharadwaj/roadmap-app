<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { roadmap } from '@/data/roadmap'
import PhaseCard from '@/components/PhaseCard.vue'
import OverallProgress from '@/components/OverallProgress.vue'
import Controls from '@/components/Controls.vue'
import Toast from '@/components/Toast.vue'
import { useProgressStore } from '@/stores/progress'

const store = useProgressStore()
const toastMessage = ref('')
const showToast = ref(false)
const fileInput = ref<HTMLInputElement>()

onMounted(async () => {
  await store.loadProgress()
})

const totalItems = computed(() => {
  return roadmap.reduce((sum, phase) => {
    return sum + phase.sections.reduce((s, section) => s + section.items.length, 0)
  }, 0)
})

const overallProgress = computed(() => {
  return store.getOverallProgress(roadmap)
})

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  toastMessage.value = message
  showToast.value = true
}

const handleExpandAll = () => {
  document.querySelectorAll<HTMLElement>('.phase').forEach(el => {
    el.classList.add('open')
  })
  showNotification('All phases expanded')
}

const handleCollapseAll = () => {
  document.querySelectorAll<HTMLElement>('.phase').forEach(el => {
    el.classList.remove('open')
  })
  showNotification('All phases collapsed')
}

const handleExport = () => {
  if (store.exportProgress()) {
    showNotification('Progress exported successfully')
  }
}

const handleImport = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  
  try {
    await store.importProgress(file)
    showNotification('Progress imported successfully')
  } catch (err) {
    showNotification('Failed to import file', 'error')
  }
  
  // Reset input
  target.value = ''
}

const handleReset = () => {
  if (confirm('Reset all progress? This cannot be undone.')) {
    store.resetAll()
    showNotification('Progress reset', 'info')
  }
}
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>Full-Stack + Cloud Engineer Roadmap</h1>
      <p>TypeScript · TypeORM · Vue.js · Node.js · MongoDB · PostgreSQL · AWS</p>
    </header>

    <OverallProgress 
      :percentage="overallProgress.percentage"
      :total="overallProgress.total"
      :completed="overallProgress.completed"
    />

    <Controls
      @expand-all="handleExpandAll"
      @collapse-all="handleCollapseAll"
      @export="handleExport"
      @import="handleImport"
      @reset="handleReset"
    />

    <div class="timeline">
      <PhaseCard
        v-for="phase in roadmap"
        :key="phase.phase"
        :phase="phase"
      />
    </div>

    <Toast 
      :message="toastMessage" 
      :show="showToast"
      @update:show="showToast = $event"
    />

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 48px 24px 24px;
  position: relative;
}

.header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--cyan), var(--green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1.2;
}

.header p { 
  color: var(--text-dim); 
  font-size: 1rem;
  margin: 0;
}

.timeline {
  max-width: 900px;
  margin: 32px auto 80px;
  padding: 0 24px;
  position: relative;
  flex: 1;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 38px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, var(--accent), var(--cyan), var(--green), var(--yellow), var(--orange), var(--pink), var(--accent));
  border-radius: 2px;
}

.hidden {
  display: none;
}

@media (max-width: 640px) {
  .header h1 { 
    font-size: 1.5rem; 
  }
  .timeline::before { 
    left: 24px; 
  }
}

@media print {
  .controls { display: none; }
  .phase-body { max-height: unset !important; }
  .phase-card { border: 1px solid #ccc; }
}
</style>