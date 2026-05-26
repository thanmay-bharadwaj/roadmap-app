<script setup lang="ts">
const emit = defineEmits<{
  (e: 'expand-all'): void
  (e: 'collapse-all'): void
  (e: 'export'): void
  (e: 'import'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <div class="controls">
    <button @click="emit('expand-all')">Expand All</button>
    <button @click="emit('collapse-all')">Collapse All</button>
    <button @click="emit('export')">Export Progress</button>
    <button @click="emit('import')">Import Progress</button>
    <button class="danger" @click="emit('reset')">Reset All</button>
  </div>
</template>

<style scoped>
.controls {
  text-align: center;
  margin: 18px auto;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  padding: 0 24px;
}

.controls button {
  padding: 8px 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  font-weight: 500;
}

.controls button:hover {
  background: var(--surface2);
  border-color: var(--accent);
  transform: translateY(-1px);
}

.controls button.danger:hover { 
  border-color: var(--red); 
  color: var(--red); 
}

@media (max-width: 640px) {
  .controls {
    flex-direction: column;
    align-items: center;
  }
  .controls button {
    width: 100%;
    max-width: 280px;
  }
}
</style>