<template>
  <q-tooltip :class="[bgColor, color, 'pa-15', 'font-14', 'shadow-29']"><slot /></q-tooltip>
</template>
<script setup>
defineProps({
  bgColor: {
    type: String,
    default: 'app-bg-primary',
  },
  color: {
    type: String,
    default: 'text-black',
  },
})
</script>
