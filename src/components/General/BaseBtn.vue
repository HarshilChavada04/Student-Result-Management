<template>
  <q-btn
    unelevated
    :flat="variant === 'text'"
    :round="round"
    :disable="disable"
    :class="{
      'base-btn': !round,
      [`base-btn--${variant}`]: true,
      [fontSize]: !!fontSize,
    }"
  >
    <!-- Left / prepend icon -->
    <slot name="icon-left">
      <q-icon
        v-if="icon || iconLeft"
        :name="icon || iconLeft"
        class="font-15"
        :class="{ 'mr-8': label }"
      />
      <base-svg-viewer v-if="svgIcon || svgIconLeft" :name="svgIcon || svgIconLeft" />
    </slot>

    <!-- Label -->
    <span v-if="label">{{ label }}</span>

    <!-- Right / append icon -->
    <slot name="icon-right">
      <q-icon v-if="iconRight" :name="iconRight" class="font-15" :class="{ 'ml-8': label }" />
      <base-svg-viewer v-if="svgIconRight" :name="svgIconRight" />
    </slot>

    <slot name="tooltip" />
    <slot />
  </q-btn>
</template>
<script setup>
import BaseSvgViewer from 'src/components/General/BaseSvgViewer.vue'
defineProps({
  label: {
    type: String,
    default: '',
  },
  fontSize: {
    type: String,
    default: 'font-14',
  },
  variant: {
    type: String,
    default: 'solid', // solid | outline | text
  },
  round: {
    type: Boolean,
    default: false,
  },
  icon: String,
  iconLeft: String,
  svgIcon: {
    type: String,
    default: '',
  },
  svgIconLeft: {
    type: String,
    default: '',
  },

  // Right / append icon
  iconRight: {
    type: String,
    default: '',
  },
  svgIconRight: {
    type: String,
    default: '',
  },
  disable: {
    type: Boolean,
    default: false,
  },
})
</script>
<style lang="scss">
.base-btn {
  border-radius: 5px;
  text-transform: none;
  padding: 5px 20px !important;
  min-height: 0 !important;
  font-weight: 400;

  &--outline {
    border: 1px solid var(--q-primary);
    background: transparent;
    color: var(--q-primary);
  }

  &--solid {
    background: var(--q-primary);
    border: none;
    color: $btn-title;
  }

  &--text {
    background: transparent;
    color: var(--q-primary);
    border: none;
  }

  /* 🔹 Disabled states */
  &--solid.q-btn.disabled {
    background: $disable-primary-40 !important;
    border: none !important;
  }

  &--outline.q-btn.disabled {
    border: 1px solid $disable-primary-40 !important;
    color: $disable-primary-40;
    background: transparent !important;
  }

  &--text.q-btn.disabled {
    color: $hint !important;
    background: transparent !important;
  }
}
</style>
