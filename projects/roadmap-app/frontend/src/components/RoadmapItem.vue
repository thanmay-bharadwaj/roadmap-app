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
  const checked = (event.target as HTMLInputElement).checked
  // Emit the itemId and the current (pre-toggle) state
  emit('toggle', props.itemId, !checked)
}
</script>