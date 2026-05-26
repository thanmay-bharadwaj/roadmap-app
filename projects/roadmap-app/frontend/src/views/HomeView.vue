<script setup lang="ts">

import { computed, onMounted }
from 'vue'

import { roadmap }
from '@/data/roadmap'

import PhaseCard
from '@/components/PhaseCard.vue'

import OverallProgress
from '@/components/OverallProgress.vue'

import { useProgressStore }
from '@/stores/progress'

const store = useProgressStore()

onMounted(async () => {

  await store.loadProgress()
})

const totalItems = computed(() => {

  let total = 0

  roadmap.forEach(phase => {

    phase.sections.forEach(section => {

      total += section.items.length
    })
  })

  return total
})

const percentage = computed(() => {

  return Math.round(
    (store.checkedItems.length /
      totalItems.value) * 100
  )
})

</script>

<template>

  <div class="container">

    <h1>
      Full Stack Roadmap
    </h1>

    <OverallProgress
      :percentage="percentage"
    />

    <PhaseCard
      v-for="phase in roadmap"
      :key="phase.phase"
      :phase="phase"
    />

  </div>

</template>
