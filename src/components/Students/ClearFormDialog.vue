<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="clear-dialog">
      <!-- Warning Icon -->
      <div class="dialog-icon-wrap">
        <div class="dialog-icon">
          <q-icon name="priority_high" size="28px" color="white" />
        </div>
      </div>

      <!-- Content -->
      <q-card-section class="dialog-content text-center">
        <div class="dialog-title">{{ t('areYouSure') }}</div>
        <div class="dialog-message">
          <div>{{ t('clearLine1') }}</div>
          <div>{{ t('clearLine2') }}</div>
        </div>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="dialog-actions row no-wrap gap-12 q-px-lg q-pb-lg">
        <q-btn
          outline
          :label="t('cancel')"
          class="dialog-btn dialog-btn--cancel col"
          @click="onCancel"
        />
        <q-btn
          unelevated
          :label="t('yesClear')"
          class="dialog-btn dialog-btn--confirm col"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  lang: {
    type: String,
    default: 'en', // 'en' | 'gu'
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const translations = {
  en: {
    areYouSure: 'Are you sure?',
    clearLine1: 'All the entered details will be cleared.',
    clearLine2: 'This action cannot be undone.',
    cancel: 'Cancel',
    yesClear: 'Yes, Clear',
  },
  gu: {
    areYouSure: 'શું તમે ખાતરી કરો છો?',
    clearLine1: 'દાખલ કરેલી બધી વિગતો સાફ થઈ જશે.',
    clearLine2: 'આ ક્રિયા પૂર્વવત્ કરી શકાશે નહીં.',
    cancel: 'રદ કરો',
    yesClear: 'હા, સાફ કરો',
  },
}

function t(key) {
  return translations[props.lang]?.[key] ?? translations.en[key]
}

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<style scoped lang="scss">
.clear-dialog {
  border-radius: 16px;
  width: 340px;
  max-width: 90vw;
  padding-top: 0;
  overflow: visible;
}

.dialog-icon-wrap {
  display: flex;
  justify-content: center;
  margin-top: -28px;
  margin-bottom: 4px;
}

.dialog-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
}

.dialog-content {
  padding: 16px 24px 12px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e2d5a;
  margin-bottom: 12px;
}

.dialog-message {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.dialog-actions {
  padding-top: 8px;
}

.dialog-btn {
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  height: 44px;

  &--cancel {
    border: 1.5px solid #d1d5db;
    color: #374151;
  }

  &--confirm {
    background: #dc2626;
    color: white;

    &:hover {
      background: #b91c1c;
    }
  }
}
</style>
