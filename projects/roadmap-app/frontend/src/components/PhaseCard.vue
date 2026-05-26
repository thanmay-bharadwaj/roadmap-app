<script setup lang="ts">
import { computed, ref } from 'vue'
import { useProgressStore } from '@/stores/progress'
import type { RoadmapPhase } from '@/data/roadmap'

const props = defineProps<{
  phase: RoadmapPhase
}>()

const store = useProgressStore()
const expanded = ref(false)

const phaseId = computed(() => `phase-${props.phase.phase}`)

const totalItems = computed(() => {
  return props.phase.sections.reduce((sum, section) => sum + section.items.length, 0)
})

const completedItems = computed(() => {
  let completed = 0
  props.phase.sections.forEach((section, sectionIndex) => {
    section.items.forEach((_, itemIndex) => {
      const id = `${props.phase.phase}-${section.name}-${itemIndex}`
      if (store.isItemChecked(id)) completed++
    })
  })
  return completed
})

const percentage = computed(() => {
  return totalItems.value > 0 
    ? Math.round((completedItems.value / totalItems.value) * 100) 
    : 0
})

const isPhaseDone = computed(() => percentage.value === 100 && totalItems.value > 0)

const getItemId = (sectionName: string, itemIndex: number) => {
  return `${props.phase.phase}-${sectionName}-${itemIndex}`
}

const toggleCheckbox = async (itemId: string) => {
  await store.toggleItem(itemId)
}

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const getPhaseColorClass = () => {
  const colors = ['c-accent', 'c-cyan', 'c-green', 'c-yellow', 'c-orange', 'c-red', 'c-pink']
  return colors[(props.phase.phase - 1) % colors.length]
}

const getIconBgClass = () => {
  const colors = ['icon-bg-1', 'icon-bg-2', 'icon-bg-3', 'icon-bg-4', 'icon-bg-5', 'icon-bg-6', 'icon-bg-7']
  return colors[(props.phase.phase - 1) % colors.length]
}
</script>

<template>
  <div 
    class="phase" 
    :class="{ open: expanded, done: isPhaseDone }"
    :data-phase="phase.phase"
  >
    <div class="phase-dot"></div>
    
    <div class="phase-card">
      <div class="phase-header" @click="toggleExpand">
        <div class="phase-icon" :class="getIconBgClass()">
          {{ phase.icon }}
        </div>
        
        <div class="phase-info">
          <h2>Phase {{ phase.phase }}: {{ phase.title }}</h2>
          <div class="meta">Weeks {{ phase.weeks }}</div>
        </div>
        
        <div class="phase-progress">
          <div class="bar-outer">
            <div 
              class="bar-inner phase-bar" 
              :style="{ width: percentage + '%' }"
            ></div>
          </div>
          <span 
            class="pct phase-pct"
            :class="percentage === 100 ? 'done' : percentage > 0 ? 'partial' : ''"
          >
            {{ percentage }}%
          </span>
        </div>
        
        <span class="chevron">▼</span>
      </div>
      
      <div class="phase-body">
        <div 
          v-for="(section, sectionIndex) in phase.sections" 
          :key="section.name"
          class="section"
        >
          <div class="section-title">
            <span class="badge" :class="section.badge">{{ section.name }}</span>
            <span class="item-count">{{ section.items.length }} items</span>
          </div>
          
          <div 
            v-for="(item, itemIndex) in section.items" 
            :key="item"
            class="item"
          >
            <input
              type="checkbox"
              :id="getItemId(section.name, itemIndex)"
              :checked="store.isItemChecked(getItemId(section.name, itemIndex))"
              @change="toggleCheckbox(getItemId(section.name, itemIndex))"
            />
            <label :for="getItemId(section.name, itemIndex)">
              {{ item }}
            </label>
          </div>
          
          <div 
            v-if="section.resources" 
            class="resources"
            v-html="section.resources"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phase {
  position: relative;
  margin-bottom: 24px;
  padding-left: 72px;
}

.phase-dot {
  position: absolute;
  left: 27px;
  top: 18px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 3px solid var(--accent);
  background: var(--bg);
  z-index: 2;
  transition: all 0.3s;
}

.phase.done .phase-dot {
  background: var(--green);
  border-color: var(--green);
  box-shadow: 0 0 12px var(--green-glow);
}

.phase-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.3s;
}

.phase-card:hover { 
  border-color: var(--accent); 
  box-shadow: 0 0 20px var(--accent-glow); 
}

.phase-header {
  padding: 18px 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  user-select: none;
}

.phase-header:hover { 
  background: var(--surface2); 
}

.phase-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.phase-info { 
  flex: 1; 
  min-width: 0;
}

.phase-info h2 { 
  font-size: 1.1rem; 
  font-weight: 700; 
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.phase-info .meta { 
  font-size: 0.8rem; 
  color: var(--text-dim); 
}

.phase-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 160px;
}

.phase-progress .bar-outer { 
  height: 8px; 
  flex: 1;
}

.phase-progress .pct { 
  font-size: 0.85rem; 
  font-weight: 700; 
  min-width: 40px; 
  text-align: right; 
  transition: color 0.2s;
}

.phase-progress .pct.done { color: var(--green); }
.phase-progress .pct.partial { color: var(--cyan); }

.chevron {
  font-size: 1.2rem;
  color: var(--text-dim);
  transition: transform 0.3s;
  flex-shrink: 0;
}

.phase.open .chevron { 
  transform: rotate(180deg); 
}

.phase-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.phase.open .phase-body { 
  max-height: 3000px; 
}

.section {
  border-top: 1px solid var(--border);
  padding: 16px 22px;
}

.section-title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.section-title .badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.section-title .item-count {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-weight: 400;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0 6px 4px;
  border-radius: 6px;
  transition: background 0.15s;
}

.item:hover { 
  background: var(--surface2); 
}

.item input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 5px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
  position: relative;
  transition: all 0.2s;
}

.item input[type="checkbox"]:checked {
  background: var(--green);
  border-color: var(--green);
}

.item input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}

.item label {
  cursor: pointer;
  font-size: 0.9rem;
  line-height: 1.5;
  transition: all 0.2s;
  word-break: break-word;
}

.item input:checked + label {
  color: var(--text-dim);
  text-decoration: line-through;
  text-decoration-color: var(--green);
}

.resources {
  margin-top: 10px;
  padding: 10px 14px;
  background: var(--surface2);
  border-radius: 8px;
  font-size: 0.82rem;
  line-height: 1.6;
}

.resources :deep(a) {
  color: var(--cyan);
  text-decoration: none;
  transition: color 0.2s;
}

.resources :deep(a:hover) { 
  text-decoration: underline;
  color: var(--accent);
}

/* Phase color coding */
.phase[data-phase="1"] .phase-dot { border-color: var(--accent); }
.phase[data-phase="2"] .phase-dot { border-color: var(--cyan); }
.phase[data-phase="3"] .phase-dot { border-color: var(--green); }
.phase[data-phase="4"] .phase-dot { border-color: var(--yellow); }
.phase[data-phase="5"] .phase-dot { border-color: var(--orange); }
.phase[data-phase="6"] .phase-dot { border-color: var(--red); }
.phase[data-phase="7"] .phase-dot { border-color: var(--pink); }

@media (max-width: 640px) {
  .phase { 
    padding-left: 52px; 
  }
  .phase-dot { 
    left: 13px; 
    top: 18px; 
    width: 20px; 
    height: 20px; 
  }
  .phase-header { 
    padding: 14px 16px; 
    flex-wrap: wrap; 
    gap: 10px;
  }
  .phase-progress { 
    width: 100%; 
    min-width: unset; 
    order: 3;
  }
  .phase-info { min-width: unset; }
  .section { 
    padding: 12px 16px; 
  }
}
</style>