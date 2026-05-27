<template>
  <div class="overall-progress">
    <span class="label">Overall Progress</span>
    <div class="bar-wrap">
      <div class="bar-outer">
        <div class="bar-inner" :style="{ width: overallProgress + '%' }"></div>
      </div>
    </div>
    <span class="pct">{{ overallProgress }}%</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  overallProgress: number
}>()
</script>