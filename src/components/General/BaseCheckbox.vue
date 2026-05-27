<template>
  <q-checkbox
    :model-value="modelValue"
    :label="label"
    :disable="disable"
    dense
    :color="color"
    :true-value="trueValue"
    :false-value="falseValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  disable: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'primary',
  },
  trueValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  falseValue: {
    type: [Boolean, String, Number],
    default: false,
  },
})

defineEmits(['update:modelValue'])
</script>
