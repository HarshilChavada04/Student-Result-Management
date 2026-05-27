<template>
  <q-item
    clickable
    v-ripple
    tag="router-link"
    :active="currentRoute.name === route.name"
    active-class="font-medium bg-active-tab has-active-style"
    class="menu-item flex flex-center"
    @click="$emit('click', route)"
  >
    <q-item-section avatar>
      <q-icon :name="route.meta.icon" class="font-18" />
    </q-item-section>

    <q-item-section class="font-14">{{ route.meta.label }}</q-item-section>

    <q-item-section avatar v-if="route.meta.rightSideIcon" class="mr-10">
      <q-icon :name="route.meta.rightSideIcon" class="text-info" size="14px" />
    </q-item-section>

    <base-tooltip
      v-if="miniState"
      transition-show="jump-right"
      transition-hide="jump-left"
      anchor="center right"
      self="center left"
      bgColor="bg-primary"
      color="text-white"
    >
      {{ route.meta.label }}
    </base-tooltip>
  </q-item>
</template>

<script setup>
import BaseTooltip from 'src/components/General/BaseTooltip.vue'

defineProps({
  route: Object,
  miniState: Boolean,
  currentRoute: Object,
})

defineEmits(['click'])
</script>
