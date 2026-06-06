<template>
  <q-dialog
    :model-value="modelValue"
    maximized
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card class="column full-height">
      <!-- Header -->
      <q-card-section class="row items-center justify-between">
        <div class="text-h6">Result: {{ student?.full_name || '-' }}</div>

        <q-btn flat round dense icon="close" @click="$emit('update:modelValue', false)" />
      </q-card-section>

      <q-separator />

      <!-- Content -->
      <q-card-section class="col scroll">
        <!-- Result Preview -->
        <div class="q-mb-xl">
          <!-- PDF -->
          <iframe
            v-if="isPdf"
            :src="student?.result_image_url"
            width="100%"
            height="700"
            style="border: none"
          />

          <!-- Image -->
          <q-img v-else :src="student?.result_image_url" fit="contain" style="max-height: 700px" />
        </div>

        <!-- Student Details -->
        <q-card flat bordered>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold q-mb-md">Student Information</div>

            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <strong>Student Name:</strong>
                {{ student?.full_name || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>Parent Phone Number:</strong>
                {{ student?.parents_phone || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>WhatsApp Number:</strong>
                {{ student?.whatsapp_number || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>Student Phone Number:</strong>
                {{ student?.student_phone || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>Result Year:</strong>
                {{ student?.result_year || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>Standard / Degree:</strong>
                {{ student?.standard_degree || '-' }}
              </div>

              <div v-if="student?.student_type === 'college'" class="col-12 col-md-6">
                <strong>Semester:</strong>
                Sem. {{ student?.semester || '-' }}
              </div>

              <div class="col-12 col-md-6">
                <strong>Percentage:</strong>
                {{ student?.percentage || '-' }}%
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-separator />

      <!-- Footer -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          color="negative"
          icon="close"
          label="Reject"
          unelevated
          @click="handleStatus('rejected')"
        />

        <q-btn
          color="positive"
          icon="check"
          label="Approve"
          unelevated
          @click="handleStatus('approved')"
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

  student: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'status-change'])

const isPdf = computed(() => {
  const url = props.student?.result_image_url || ''

  return (
    url.includes('.pdf') ||
    url.includes('/raw/upload/') ||
    props.student?.result_file_type === 'pdf'
  )
})

const handleStatus = (status) => {
  emit('status-change', {
    studentId: props.student.id,
    status,
  })
}
</script>
