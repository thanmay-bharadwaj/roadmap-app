<script setup lang="ts">
defineProps<{
  percentage: number
  total?: number
  completed?: number
}>()
</script>

<template>
  <div class="overall-progress">
    <span class="label">Overall Progress</span>
    <div class="bar-wrap">
      <div class="bar-outer">
        <div class="bar-inner" :style="{ width: percentage + '%' }"></div>
      </div>
    </div>
    <span class="pct">{{ percentage }}%</span>
    <span v-if="total && completed" class="meta">
      {{ completed }}/{{ total }}
    </span>
  </div>
</template>

<style scoped>
.overall-progress {
  max-width: 700px;
  margin: 24px auto 0;
  padding: 20px 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.label { 
  font-weight: 700; 
  white-space: nowrap; 
  font-size: 0.95rem; 
}

.bar-wrap { 
  flex: 1; 
  min-width: 200px;
}

.pct { 
  font-weight: 800; 
  font-size: 1.3rem; 
  color: var(--green); 
  min-width: 56px; 
  text-align: right; 
}

.meta {
  font-size: 0.8rem;
  color: var(--text-dim);
  margin-left: 8px;
}

.bar-outer {
  width: 100%;
  height: 12px;
  background: var(--surface2);
  border-radius: 6px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(90deg, var(--accent), var(--cyan), var(--green));
}

@media (max-width: 640px) {
  .overall-progress { 
    flex-direction: column; 
    gap: 10px; 
    text-align: center;
  }
  .pct { text-align: center; }
}
</style>