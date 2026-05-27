<template>
  <div class="row items-start q-mt-md">
    <div v-if="noteText" class="font-16 col align-text">
      <span class="font-medium">{{ noteTitle }}:</span>
      {{ noteText }}
    </div>
    <q-space></q-space>
    <q-pagination
      v-model="pagination.page"
      direction-links
      :max="totalPages"
      size="var(--font-16)"
      :max-pages="4"
      active-design="rounded"
      color="primary"
    />
  </div>
</template>
<script setup>
const pagination = defineModel({
  type: Object,
  default: () => ({ page: 1 }),
})
defineProps({
  totalPages: {
    type: String,
    default: '',
  },
  noteTitle: {
    type: String,
    default: 'Note',
  },
  noteText: {
    type: String,
    default: '',
  },
})
</script>
<style lang="scss" scoped>
:deep(.q-btn::before) {
  box-shadow: none !important;
}
:deep(.q-btn) {
  border-radius: 50%;
}
.align-text {
  text-align: justify;
  text-justify: inter-word;
}
</style>
