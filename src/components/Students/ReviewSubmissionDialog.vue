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
        <!-- Result Preview -->
        <div class="q-mb-xl">
          <div
            v-for="(file, index) in student?.result_image_urls || []"
            :key="index"
            class="q-mb-lg"
          >
            <!-- PDF -->
            <iframe v-if="isPdf(file)" :src="file" width="100%" height="700" style="border: none" />

            <!-- Image -->
            <div v-else class="relative-position">
              <q-btn
                icon="rotate_right"
                color="primary"
                round
                dense
                class="absolute-top-right q-ma-md"
                style="z-index: 1000"
                @click="rotateImage(index)"
              >
                <q-tooltip>Rotate Image</q-tooltip>
              </q-btn>

              <div
                :style="{
                  transform: `rotate(${imageRotations[index] || 0}deg)`,
                  transition: 'transform 0.3s ease',
                }"
              >
                <q-img :src="file" fit="contain" style="max-height: 700px" />
              </div>
            </div>
          </div>

          <div v-if="!student?.result_image_urls?.length" class="text-grey text-center q-pa-lg">
            No result files available
          </div>
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
      <q-card-actions v-if="student.submission_status === 'pending'" align="right" class="q-pa-md">
        <q-btn
          color="negative"
          icon="close"
          label="Reject"
          unelevated
          @click="handleStatus('rejected')"
          :loading="objLoading['rejected']"
        />

        <q-btn
          color="positive"
          icon="check"
          label="Approve"
          unelevated
          @click="handleStatus('verified')"
          :loading="objLoading['verified']"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <ConfirmationDialog
    v-model="showConfirmationDialog"
    :status="selectedStatus"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import ConfirmationDialog from './ConfirmationDialog.vue'
import { api } from 'src/boot/axios.js'
import { showSuccess, showError } from 'src/boot/notification'

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

const showConfirmationDialog = ref(false)
const selectedStatus = ref('')
const objLoading = ref({
  rejected: false,
  verified: false,
})

const imageRotations = ref({})

const rotateImage = (index) => {
  imageRotations.value[index] = (imageRotations.value[index] || 0) + 90
}

const openWhatsApp = (status, rejectionReason = '') => {
  const phone = props.student?.whatsapp_number

  if (!phone) return

  const cleanPhone = phone.replace(/\D/g, '')

  let message = ''

  if (status === 'verified') {
    message = `✅ RESULT APPROVED

Dear Student,

Your result submission has been successfully approved.

📚 Student Name: ${props.student?.full_name}
📅 Result Year: ${props.student?.result_year}
🎓 Standard / Degree: ${props.student?.standard_degree || '-'}

${props.student?.student_type === 'college' ? `🏫 Semester: ${props.student?.semester || '-'}` : ''}

📊 Percentage: ${props.student?.percentage || '-'}%

Thank you for participating.

━━━━━━━━━━━━━━━━━━━━

✅ પરિણામ મંજૂર

પ્રિય વિદ્યાર્થી,

તમારું પરિણામ સફળતાપૂર્વક મંજૂર કરવામાં આવ્યું છે.

📚 વિદ્યાર્થીનું નામ: ${props.student?.full_name}
📅 પરિણામ વર્ષ: ${props.student?.result_year}
🎓 ધોરણ / ડિગ્રી: ${props.student?.standard_degree || '-'}

${props.student?.student_type === 'college' ? `🏫 સેમેસ્ટર: ${props.student?.semester || '-'}` : ''}

📊 ટકાવારી: ${props.student?.percentage || '-'}%

આપનો અભ્યાસ અને મહેનત બદલ અભિનંદન.

- Result Management Team`
  } else {
    message = `❌ RESULT REJECTED

Dear Student,

Unfortunately, your result submission could not be approved.

📚 Student Name: ${props.student?.full_name}
📅 Result Year: ${props.student?.result_year}
🎓 Standard / Degree: ${props.student?.standard_degree || '-'}

${props.student?.student_type === 'college' ? `🏫 Semester: ${props.student?.semester || '-'}` : ''}

📊 Percentage: ${props.student?.percentage || '-'}%

📝 Reason:
${rejectionReason || 'Not specified'}

For further assistance, please contact the administrator.

━━━━━━━━━━━━━━━━━━━━

❌ પરિણામ નામંજૂર

પ્રિય વિદ્યાર્થી,

દુઃખ સાથે જણાવવાનું કે તમારું પરિણામ હાલમાં મંજૂર કરવામાં આવ્યું નથી.

📚 વિદ્યાર્થીનું નામ: ${props.student?.full_name}
📅 પરિણામ વર્ષ: ${props.student?.result_year}
🎓 ધોરણ / ડિગ્રી: ${props.student?.standard_degree || '-'}

${props.student?.student_type === 'college' ? `🏫 સેમેસ્ટર: ${props.student?.semester || '-'}` : ''}

📊 ટકાવારી: ${props.student?.percentage || '-'}%

📝 કારણ:
${rejectionReason || 'ઉલ્લેખિત નથી'}

વધુ માહિતી માટે કૃપા કરીને એડમિનનો સંપર્ક કરો.

- Result Management Team`
  }

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`

  window.open(whatsappUrl, '_blank')
}

const isPdf = (url) => {
  if (!url) return false

  return url.includes('.pdf') || url.includes('/raw/upload/')
}

const handleStatus = (status) => {
  selectedStatus.value = status
  showConfirmationDialog.value = true
}

const handleConfirm = async (reason) => {
  try {
    const id = props.student.id
    const action = selectedStatus.value === 'verified' ? 'approve' : 'reject'

    objLoading.value[selectedStatus.value] = true
    await api
      .patch(`/admin/submissions/${id}/${action}`, {
        rejection_reason: reason,
      })
      .then((response) => {
        if (response && response.status === 200) {
          showSuccess(response?.data?.message)
          openWhatsApp(selectedStatus.value, reason)
        }
      })
      .finally(() => {
        objLoading.value[selectedStatus.value] = false
      })

    emit('status-change', {
      studentId: id,
      status: selectedStatus.value,
      rejectionReason: reason,
    })

    emit('update:modelValue', false)
  } catch (error) {
    showError(error)
  }
}
</script>
