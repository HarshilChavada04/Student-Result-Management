<template>
  <div
    class="med-dropdown"
    :style="{ maxWidth: width, minWidth: minWidth, '--help-gap-mdd': helpGap }"
  >
    <div class="overflow-hidden w-inherit">
      <q-item-label
        v-show="label"
        class="mb-5 ellipsis font-16 theme-label"
        style="letter-spacing: 0.08px"
      >
        {{ label }}
        <span v-show="mandatory" class="text-negative">*</span>
      </q-item-label>

      <q-select
        popup-content-class="med-dropdown-popup"
        :class="{
          'med-dropdown-noinput': !useInput,
          'has-value': multiple ? Array.isArray(modelVal) && modelVal.length : modelVal,
        }"
        class="med-base-input mt-9"
        dense
        outlined
        label="-Select-"
        behavior="menu"
        map-options
        fill-input
        v-model="modelVal"
        :option-value="strKey"
        :option-label="strValue"
        :multiple="multiple"
        :options="options"
        :disable="disable"
        :readonly="readonly"
        :emit-value="!emitObject"
        :use-input="multiple ? true : useInput"
        :hide-selected="useInput && !multiple"
        hide-bottom-space
        no-error-icon
        :rules="validationRules"
        @filter="filterFn"
      >
        <!-- No Options -->
        <template v-slot:no-option>
          <slot name="no-option">
            <q-item>
              <q-item-section class="text-italic text-grey"> No results </q-item-section>
            </q-item>
          </slot>
        </template>

        <template v-if="multiple" v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
            class="q-pa-none q-ma-none row justify-start items-center"
          >
            <!-- Checkbox only in multiple mode -->
            <q-checkbox
              v-model="scope.selected"
              dense
              size="35px"
              :val="scope.opt[strKey] ?? scope.opt"
              class="mx-15"
              color="primary"
              @update:model-value="(val) => scope.toggleOption(scope.opt)"
            />

            <!-- Option label -->
            <span class="font-14">{{ scope.opt[strValue] ?? scope.opt }}</span>
          </q-item>
        </template>
        <template v-slot:after-options>
          <div
            class="flex justify-left bg-white clear-selection-style cursor-pointer"
            @click="clearModel"
          >
            <span class="text-primary row font-14 mx-15 my-10">Clear selection</span>
          </div>
        </template>

        <!-- Selected Items -->
        <template v-slot:selected-item="scope">
          <slot name="selected-item" :scope="scope">
            <template v-if="multiple">
              <div v-if="scope.index < maxShow" class="dropdown-chip-parent">
                <q-chip
                  :removable="!readonly && !disable"
                  outline
                  @remove="scope.removeAtIndex(scope.index)"
                  :tabindex="scope.tabindex"
                  color="black"
                  class="dropdown-chips"
                  dense
                >
                  <span class="font-14">{{ scope.opt.value }}</span>
                </q-chip>
              </div>
              <div
                v-if="isMoreThanMaxChips(scope.index)"
                class="dropdown-added-count cursor-pointer font-14 text-primary mt-2"
              >
                {{ `+${modelVal.length - 1}` }}
                <q-tooltip>
                  {{ multiSelectedValues(modelVal.slice(maxShow)) }}
                </q-tooltip>
              </div>
            </template>
            <span v-else class="med-drop-selected theme-label font-14">
              {{ scope.opt?.value ?? scope.opt }}
            </span>
          </slot>
        </template>

        <!-- Clearable Icon -->
        <template
          v-if="clearable && ((multiple && modelVal.length) || (!multiple && modelVal))"
          v-slot:append
        >
          <q-icon name="close" class="cursor-pointer font-14 text-black" @click="clearModel" />
        </template>
      </q-select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useValidation } from 'src/composables/validationRules'

// ✅ Props
const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: null,
  },
  mandatory: { type: Boolean, default: false },
  arrOptions: { type: Array, default: () => [] },
  width: { type: String, default: '284px' },
  minWidth: { type: String, default: '284px' },
  label: { type: String, default: 'Hello' },
  strKey: { type: String, default: 'key' },
  strValue: { type: String, default: 'value' },
  multiple: { type: Boolean, default: false },
  clearable: { type: Boolean, default: true },
  disable: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  emitObject: { type: Boolean, default: false },
  clear: { type: Boolean, default: false },
  useInput: { type: Boolean, default: false },
  helpGap: { type: String, default: '10px' },
  rules: { type: Array, default: () => [] },
  maxShow: { type: Number, default: 1 },
})

const emit = defineEmits(['update:modelValue'])

// ✅ Validation rules
const { validationRules } = useValidation(props)

// ✅ Reactive state
const modelVal = ref(props.modelValue)
const options = ref(props.arrOptions)

// ✅ Computed
const isMoreThanMaxChips = (idx) =>
  Array.isArray(modelVal.value) && modelVal.value.length > 0 && idx === props.maxShow

const multiSelectedValues = (selected) => {
  return options.value
    .filter((item) => {
      if (typeof item === 'object') {
        return selected.includes(item.key)
      } else {
        return selected.includes(item)
      }
    })
    .map((item) => (typeof item === 'object' ? item.value : item))
    .join(', ')
}

// ✅ Watchers
watch(
  () => props.modelValue,
  (val) => {
    modelVal.value = val
  },
)

watch(
  () => props.arrOptions,
  (val) => {
    options.value = val
  },
)

watch(modelVal, (val) => {
  emit('update:modelValue', val)
})

// ✅ Methods
const clearModel = () => {
  modelVal.value = props.multiple ? [] : null
  emit('update:modelValue', modelVal.value)
}

const filterFn = (val, update) => {
  update(() => {
    const searchedVal = val.toLowerCase()
    options.value = props.arrOptions.filter((v) => {
      if (typeof v === 'string') {
        return v.toLowerCase().includes(searchedVal)
      }
      if (typeof v === 'object' && v[props.strValue]) {
        return v[props.strValue].toLowerCase().includes(searchedVal)
      }
      return false
    })
  })
}
</script>

<style lang="scss">
.med-dropdown {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--help-gap-mdd);
  overflow: hidden;

  .w-inherit {
    width: inherit;
  }

  .q-field--focused .q-field__label,
  .has-value .q-field__label {
    display: none;
  }

  .q-field--auto-height.q-field--dense.q-field--labeled .q-field__control-container {
    padding-top: 1px;
  }

  .q-field__label {
    padding-top: 2px;
  }

  &-popup {
    max-height: 300px !important;

    .q-item {
      &--active {
        color: var(--q-primary);
        font-weight: 500;
        background: #145da01a;
      }
      &:hover {
        background-color: $disable-10;
      }
    }
  }

  &-noinput .q-field__native {
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .q-select__dropdown-icon {
    color: black;
  }

  .q-field--outlined {
    .q-field__control {
      &:hover:before {
        border-color: var(--q-primary);
      }
    }
    &.q-field--highlighted .q-field__control:after {
      border-color: var(--q-primary);
    }
  }

  .q-field--error {
    .q-field__control {
      &:hover:before {
        border-color: var(--q-negative);
      }
    }
    &.q-field--highlighted .q-field__control:after {
      border-color: var(--q-negative);
    }
  }
}

.dropdown-chip-parent {
  width: fit-content;
  max-width: calc(100% - 35px);
}

.dropdown-added-count {
  margin-left: 8px;
  color: black;
}

.dropdown-chips {
  margin: 0 !important;

  > .q-chip__content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    display: block;
  }
}

.med-drop-selected {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  margin-left: 4px;
  width: 250px;
}

.help-tooltip {
  width: 400px;
  max-width: 95%;
}
.clear-selection-style {
  position: sticky;
  bottom: 0;
  z-index: 4;
  opacity: 1;
  border-top: 2px solid $disable-primary-30;

  &:hover {
    background-color: $primary !important;

    span {
      color: white !important;
    }
  }
}
</style>
