<script setup lang="ts">

import { computed, ref } from 'vue'

import { useProgressStore }
from '@/stores/progress'

const props = defineProps<{
  phase: any
}>()

const store = useProgressStore()

const expanded = ref(false)

const totalItems = computed(() => {

  let total = 0

  props.phase.sections.forEach((section: any) => {
    total += section.items.length
  })

  return total
})

const completedItems = computed(() => {

  let completed = 0

  props.phase.sections.forEach((section: any) => {

    section.items.forEach(
      (item: string, index: number) => {

      const id =
`${props.phase.phase}-${section.name}-${index}`

      if (
        store.checkedItems.includes(id)
      ) {
        completed++
      }
    })
  })

  return completed
})

const percentage = computed(() => {

  return Math.round(
    (completedItems.value / totalItems.value) * 100
  )
})

const toggleCheckbox = async (
  itemId: string
) => {

  await store.toggleItem(itemId)
}
</script>

<template>

  <div class="phase-card">

    <div
      class="header"
      @click="expanded = !expanded"
    >

      <div>

        <h2>
          {{ phase.icon }}
          {{ phase.title }}
        </h2>

        <p>
          Weeks {{ phase.weeks }}
        </p>

      </div>

      <div>
        {{ percentage }}%
      </div>

    </div>

    <div
      v-if="expanded"
      class="body"
    >

      <div
        v-for="section in phase.sections"
        :key="section.name"
      >

        <h3>
          {{ section.name }}
        </h3>

        <div
          v-for="(item, index) in section.items"
          :key="item"
          class="item"
        >

          <input
            type="checkbox"

            :checked="
              store.checkedItems.includes(
`${phase.phase}-${section.name}-${index}`
              )
            "

            @change="
toggleCheckbox(
`${phase.phase}-${section.name}-${index}`
)
            "
          />

          <label>
            {{ item }}
          </label>

        </div>

      </div>

    </div>

  </div>

</template>
