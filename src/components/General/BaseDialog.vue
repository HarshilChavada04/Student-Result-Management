<template>
  <q-dialog
    v-model="showDialog"
    :position="position"
    :persistent="persistent"
    :maximized="maximized"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
  >
    <div
      class="bg-white"
      :style="{
        width,
        'border-radius': maximized ? '30px 0 0 30px !important' : '10px !important',
      }"
    >
      <!-- Header Section -->
      <div class="dialog-header-shadow row justify-between items-center py-10 pl-20 pr-10">
        <div class="font-18 font-medium" style="letter-spacing: 0.09px">{{ title }}</div>
        <base-btn
          variant="text"
          icon="close"
          round
          fontSize="font-12"
          color="black"
          @click="showDialog = false"
        />
      </div>
      <div class="py-10 px-20">
        <slot />
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import BaseBtn from 'src/components/General/BaseBtn.vue'

const showDialog = defineModel('showDialog', { type: Boolean, default: false })

defineProps({
  title: {
    type: String,
    default: '',
  },
  persistent: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
  },
  maximized: {
    type: Boolean,
    default: false,
  },
  transitionShow: {
    type: String,
  },
  transitionHide: {
    type: String,
  },
  position: {
    type: String,
  },
})
</script>
