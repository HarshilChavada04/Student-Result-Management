<template>
  <div>
    <div class="upload-label">
      {{ label }}
      <span v-if="required" class="text-negative">*</span>
    </div>

    <div
      class="upload-zone"
      :class="{
        'upload-zone--dragover': isDragOver,
        'upload-zone--error': hasError,
        'upload-zone--has-file': modelValue,
      }"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
      @click="triggerInput"
    >
      <!-- Uploaded file state -->
      <div v-if="modelValue" class="upload-zone__file-info">
        <q-icon name="description" size="32px" class="text-primary" />
        <div class="upload-zone__file-name">{{ modelValue.name }}</div>
        <div class="upload-zone__file-size">{{ formatSize(modelValue.size) }}</div>
        <q-btn
          flat
          round
          dense
          icon="close"
          size="sm"
          class="upload-zone__remove-btn"
          @click.stop="removeFile"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="upload-zone__empty">
        <q-icon name="cloud_upload" size="40px" class="upload-zone__icon" />
        <div class="upload-zone__text">
          <span class="upload-zone__text--highlight">Click to upload</span>
          <span class="text-grey-7"> or drag and drop</span>
        </div>
        <div class="upload-zone__hint">{{ `${hint} (Max ${maxSizeMb}MB)` }}</div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      style="display: none"
      @change="onFileChange"
    />

    <!-- Error message -->
    <div v-if="hasError && errorMessage" class="upload-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
  label: {
    type: String,
    default: 'Attachment',
  },
  required: {
    type: Boolean,
    default: false,
  },
  accept: {
    type: String,
    default: '.pdf,.png,.jpg,.jpeg',
  },
  hint: {
    type: String,
    default: 'PDF, PNG, JPG, JPEG',
  },
  maxSizeMb: {
    type: Number,
    default: 5,
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'error'])

const inputRef = ref(null)
const isDragOver = ref(false)

const hasError = computed(() => !!props.errorMessage)

function triggerInput() {
  inputRef.value?.click()
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) validateAndEmit(file)
  // reset input so same file can be re-selected
  e.target.value = ''
}

function onDrop(e) {
  isDragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) validateAndEmit(file)
}

function validateAndEmit(file) {
  const maxBytes = props.maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    emit('error', `File size exceeds ${props.maxSizeMb}MB limit.`)
    return
  }
  emit('update:modelValue', file)
  emit('error', '')
}

function removeFile() {
  emit('update:modelValue', null)
  emit('error', '')
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped lang="scss">
.upload-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.upload-zone {
  border: 2px dashed #c5cae9;
  border-radius: 10px;
  padding: 32px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  background-color: #f8f9ff;
  min-height: 130px;
  position: relative;

  &:hover {
    border-color: var(--q-primary, #3f51b5);
    background-color: #f0f2ff;
  }

  &--dragover {
    border-color: var(--q-primary, #3f51b5);
    background-color: #e8ebff;
    border-style: solid;
  }

  &--error {
    border-color: var(--q-negative, #c10015);
    background-color: #fff5f5;
  }

  &--has-file {
    border-style: solid;
    border-color: var(--q-primary, #3f51b5);
    background-color: #f0f2ff;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
  }

  &__icon {
    color: var(--q-primary, #3f51b5);
    opacity: 0.85;
  }

  &__text {
    font-size: 14px;
    font-weight: 500;
    color: #424242;

    &--highlight {
      color: var(--q-primary, #3f51b5);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }

  &__hint {
    font-size: 12px;
    color: #9e9e9e;
    margin-top: 2px;
  }

  &__file-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
    width: 100%;
  }

  &__file-name {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__file-size {
    font-size: 12px;
    color: #757575;
  }

  &__remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #757575;

    &:hover {
      color: var(--q-negative, #c10015);
    }
  }
}

.upload-error {
  font-size: 12px;
  color: var(--q-negative, #c10015);
  margin-top: 4px;
  padding-left: 2px;
}
</style>
