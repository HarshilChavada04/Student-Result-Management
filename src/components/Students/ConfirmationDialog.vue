<template>
  <q-dialog v-model="show" persistent>
    <q-card class="confirmation-card">
      <!-- Title -->
      <q-card-section class="title-section">
        <div class="dialog-title">{{ config.title }}</div>
      </q-card-section>

      <!-- Icon Section -->
      <q-card-section class="icon-section pa-0 py-14">
        <div class="icon-circle" :class="config.circleClass">
          <q-icon :name="config.icon" class="status-icon" />
        </div>
      </q-card-section>

      <!-- Body -->
      <q-card-section class="body-section">
        <!-- Verify: simple message -->
        <p v-if="status === 'verified'" class="confirm-message">
          Are you sure you want to <br />
          mark this student as Verified?
        </p>

        <!-- Reject: textarea for reason -->
        <template v-else-if="status === 'rejected'">
          <p class="reason-label">
            Please provide reason for rejection
            <span class="required-star">*</span>
          </p>
          <q-input
            v-model="rejectionReason"
            type="textarea"
            outlined
            placeholder="Enter reason here..."
            rows="4"
            class="reason-input"
          />
        </template>
      </q-card-section>

      <!-- Divider -->
      <q-separator />

      <!-- Actions -->
      <q-card-actions class="action-section">
        <q-btn flat label="Cancel" class="cancel-btn" @click="onCancel" no-caps />
        <q-btn
          :label="config.confirmLabel"
          :class="config.confirmClass"
          class="confirm-btn"
          unelevated
          @click="onConfirm"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 'verified' | 'rejected'
  status: {
    type: String,
    required: true,
    validator: (val) => ['verified', 'rejected'].includes(val),
  },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = ref(props.modelValue)
const rejectionReason = ref('')

watch(
  () => props.modelValue,
  (val) => {
    show.value = val
    if (!val) rejectionReason.value = ''
  },
)

watch(show, (val) => {
  emit('update:modelValue', val)
})

const config = computed(() => {
  if (props.status === 'verified') {
    return {
      title: 'Mark as Verified',
      icon: 'check',
      circleClass: 'circle-verified',
      confirmLabel: 'Yes, Verify',
      confirmClass: 'btn-verified',
    }
  }
  return {
    title: 'Mark as Rejected',
    icon: 'close',
    circleClass: 'circle-rejected',
    confirmLabel: 'Reject',
    confirmClass: 'btn-rejected',
  }
})

const onCancel = () => {
  show.value = false
  emit('cancel')
}

const onConfirm = () => {
  if (props.status === 'rejected' && !rejectionReason.value.trim()) return
  emit('confirm', rejectionReason.value || null)
  show.value = false
}
</script>

<style scoped>
.confirmation-card {
  width: 390px;
  max-width: 95vw;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Icon */
.icon-section {
  display: flex;
  justify-content: center;
  padding-bottom: 0;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-verified {
  background-color: #2e7d32;
}

.circle-rejected {
  background-color: #d32f2f;
}

.status-icon {
  color: #ffffff;
  font-size: 32px;
}

/* Title */
.title-section {
  text-align: center;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Body */
.confirm-message {
  text-align: center;
  color: #444;
  font-size: 14px;
  margin: 0;
  line-height: 1.6;
}

.reason-label {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.required-star {
  color: #d32f2f;
  margin-left: 2px;
}

.reason-input :deep(.q-field__control) {
  border-radius: 8px;
}

/* Actions */
.action-section {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px 16px;
  gap: 10px;
}

.cancel-btn {
  flex: 1;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.confirm-btn {
  flex: 1;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.btn-verified {
  background-color: #2e7d32 !important;
}

.btn-rejected {
  background-color: #d32f2f !important;
}
</style>
