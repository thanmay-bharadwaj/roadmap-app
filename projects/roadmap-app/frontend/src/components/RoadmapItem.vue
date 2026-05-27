<template>
  <div class="item">
    <input 
      type="checkbox" 
      :id="props.itemId" 
      :checked="props.completed"
      @change="handleChange"
    />
    <label :for="props.itemId">{{ props.text }}</label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  itemId: string
  text: string
  completed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', itemId: string, current: boolean): void
}>()

const handleChange = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked
  console.log(`[RoadmapItem] Checkbox changed: ${props.itemId} -> ${isChecked}`)
  // Emit the PREVIOUS state so parent can flip it
  emit('toggle', props.itemId, !isChecked)
}
</script>