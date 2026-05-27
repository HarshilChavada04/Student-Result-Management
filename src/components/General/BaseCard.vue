<template>
  <div :class="[radius, background, padding, shadow, extraClass]">
    <div v-if="cardTitle" class="row justify-between items-baseline mb-20">
      <span
        v-if="cardTitle"
        :class="[cardTitleFontSize, 'text-left', 'font-medium']"
        style="letter-spacing: 0.09px"
        >{{ cardTitle }}</span
      >
      <span
        v-if="cardActionBtnTitle"
        class="text-info font-16 card-action-btn cursor-pointer"
        @click="emit('card-action-click')"
        >{{ cardActionBtnTitle }}</span
      >
    </div>
    <slot />
  </div>
</template>

<script setup>
const emit = defineEmits(['card-action-click'])

defineProps({
  radius: {
    type: String,
    default: 'r-10',
  },
  background: {
    type: String,
    default: 'bg-white',
  },
  padding: {
    type: String,
    default: 'pa-20',
  },
  cardTitle: {
    type: String,
    default: '',
  },
  cardTitleFontSize: {
    type: String,
    default: 'font-18',
  },
  cardActionBtnTitle: {
    type: String,
    default: '',
  },
  shadow: {
    type: String,
    default: 'shadow-29',
  },
  extraClass: {
    type: [String, Array, Object],
    default: '',
  },
})
</script>
<style scoped lang="scss">
.card-action-btn {
  position: relative;
  user-select: none;
}

.card-action-btn::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 0;
  height: 1.7px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.card-action-btn:hover::after {
  width: 100%;
}
</style>
