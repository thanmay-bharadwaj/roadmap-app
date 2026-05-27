<template>
  <div class="phase" :data-phase="phase.phase" :class="{ open: isOpen, done: isCompleted }">
    <div class="phase-dot"></div>
    <div class="phase-card">
      <div class="phase-header" @click="toggleOpen">
        <div class="phase-icon" :class="`icon-bg-${phase.phase}`">{{ phase.icon }}</div>
        <div class="phase-info">
          <h2>Phase {{ phase.phase }}: {{ phase.title }}</h2>
          <div class="meta">Weeks {{ phase.weeks }}</div>
        </div>
        <div class="phase-progress">
          <div class="bar-outer">
            <div 
              class="bar-inner phase-bar" 
              :style="{ width: phaseProgress + '%' }"
            ></div>
          </div>
          <span 
            class="pct phase-pct" 
            :style="{ color: phaseProgress === 100 ? 'var(--green)' : phaseProgress > 0 ? 'var(--cyan)' : 'var(--text-dim)' }"
          >
            {{ phaseProgress }}%
          </span>
        </div>
        <span class="chevron">▼</span>
      </div>
      
      <div class="phase-body">
        <div 
          v-for="(section, secIndex) in phase.sections" 
          :key="secIndex" 
          class="section"
        >
          <div class="section-title">
            <span class="badge" :class="section.badge">{{ section.name }}</span>
            <span style="color:var(--text-dim);font-size:0.75rem">{{ section.items.length }} items</span>
          </div>
          
          <RoadmapItem
            v-for="(itemText, itemIndex) in section.items"
            :key="itemIndex"
            :item-id="generateItemId(phase.phase, section.name, itemIndex)"
            :text="itemText"
            :completed="progressState[generateItemId(phase.phase, section.name, itemIndex)] || false"
            @toggle="handleToggle"
          />
          
          <div v-if="section.resources" class="resources" v-html="section.resources"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RoadmapItem from './RoadmapItem.vue'
import type { RoadmapPhase, ProgressState } from '@/types'

const props = defineProps<{
  phase: RoadmapPhase
  progressState: ProgressState
  phaseProgress: number
}>()

const emit = defineEmits<{
  (e: 'toggle', itemId: string, current: boolean): void
}>()

const isOpen = ref(false)

const isCompleted = computed(() => props.phaseProgress === 100)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const generateItemId = (phaseNum: number, sectionName: string, itemIndex: number): string => {
  return `phase-${phaseNum}-sec-${sectionName}-item-${itemIndex}`
}

const handleToggle = (itemId: string, current: boolean) => {
  emit('toggle', itemId, current)
}
</script>