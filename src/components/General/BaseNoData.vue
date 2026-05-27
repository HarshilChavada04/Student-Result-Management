<template>
  <div class="full-width row flex-center q-gutter-sm">
    <q-icon size="2em" name="fa-solid fa-warning" />
    <span> {{ message }} </span>
  </div>
</template>
<script setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>
