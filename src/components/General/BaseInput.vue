<template>
  <div class="column">
    <label
      v-if="label"
      :class="[labelClass, 'font-regular', 'mb-5', 'font-16']"
      style="letter-spacing: 0.08px"
    >
      {{ label }}<span v-if="mandatory" class="text-negative">*</span>
    </label>
    <q-input
      v-model="modelValue"
      :type="type"
      :min="min"
      :max="max"
      :step="step"
      :autogrow="autogrow"
      dense
      :style="{ maxWidth }"
      outlined
      :disable="disable"
      :placeholder="placeholder"
      :rules="validationRules"
      :mask="mask"
      no-error-icon
      hide-bottom-space
    >
      <template v-if="iconName" v-slot:prepend>
        <q-icon :name="iconName" class="font-16 text-black mr-5"></q-icon>
      </template>
      <template v-if="clearable && modelValue.trim().length > 0" v-slot:append>
        <q-icon
          name="fa-regular fa-circle-xmark"
          @click.stop.prevent="emit('update:modelValue', '')"
          class="cursor-pointer font-14 text-black"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
// import { computed } from 'vue'
import { useValidation } from 'src/composables/validationRules'

const modelValue = defineModel({
  type: [String, Number],
  default: '',
})
const props = defineProps({
  maxWidth: {
    type: String,
  },
  placeholder: {
    type: String,
    default: 'Enter',
  },
  label: {
    type: String,
    default: '',
  },
  mandatory: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  autogrow: {
    type: Boolean,
    default: false,
  },
  iconName: {
    type: String,
    default: '',
  },
  disable: {
    type: Boolean,
    default: false,
  },
  labelClass: {
    type: Array,
    default: () => [],
  },
  mask: {
    type: String,
  },
  type: {
    type: String,
  },
  min: {
    type: [String, Number],
  },
  max: {
    type: [String, Number],
  },
  step: {
    type: [String, Number],
  },
})

const { validationRules } = useValidation(props)

const emit = defineEmits(['update:modelValue'])

// const validationRules = computed(() => {
//   const rules = []
//   if (props.mandatory) {
//     rules.push(
//       (val) => (!!val && val.trim().length > 0) || `Please enter ${props.label.toLowerCase()}`,
//     )
//   }

//   return rules
// })
</script>
<style scoped lang="scss"></style>
