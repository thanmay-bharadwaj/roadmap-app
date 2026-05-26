<script setup lang="ts">
defineProps<{
  percentage: number
}>()
</script>

<template>

  <div class="overall-progress">

    <h2>
      Overall Progress
    </h2>

    <div class="bar">

      <div
        class="fill"
        :style="{
          width: percentage + '%'
        }"
      ></div>

    </div>

    <p>
      {{ percentage }}%
    </p>

  </div>

</template>
