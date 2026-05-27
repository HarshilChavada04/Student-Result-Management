<template>
  <q-avatar class="font-40 r-100">
    <img :src="imageUrl" alt="Account Manager" />
    <slot />
  </q-avatar>
</template>
<script setup>
defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
})
</script>
