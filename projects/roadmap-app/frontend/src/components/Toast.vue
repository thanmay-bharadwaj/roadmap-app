<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  message: string
  show: boolean
  type?: 'success' | 'error' | 'info'
}>()

const visible = ref(false)

// Computed class name - avoids template literal in template
const toastClass = computed(() => {
  const baseType = props.type || 'success'
  return `toast toast--${baseType}`
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    visible.value = true
    setTimeout(() => {
      visible.value = false
    }, 2000)
  }
})
</script>

<template>
  <Transition name="toast">
    <div 
      v-if="visible" 
      :class="toastClass"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(80px);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  z-index: 999;
  color: #000;
  background: var(--green);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.toast--success { background: var(--green); color: #000; }
.toast--error { background: var(--red); color: #fff; }
.toast--info { background: var(--cyan); color: #000; }

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(100px);
}
</style>