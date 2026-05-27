<template>
  <q-toggle v-model="model" :disable="disable"></q-toggle>
</template>

<script setup>
const model = defineModel({ type: Boolean, default: false })
defineProps({
  disable: {
    type: Boolean,
    default: false,
  },
})
</script>
