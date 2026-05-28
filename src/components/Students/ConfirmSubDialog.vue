<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card class="confirm-dialog">
      <!-- Header -->
      <q-card-section class="confirm-dialog__header row items-center no-wrap">
        <div class="col text-center">
          <div class="confirm-dialog__title">{{ t('dialogTitle') }}</div>
          <div class="confirm-dialog__subtitle">{{ t('dialogSubtitle') }}</div>
        </div>
        <q-btn
          flat
          round
          dense
          icon="close"
          class="confirm-dialog__close"
          @click="isOpen = false"
        />
      </q-card-section>

      <q-separator />

      <!-- Details Body -->
      <q-card-section class="confirm-dialog__body">
        <div class="confirm-dialog__rows">
          <div v-for="row in detailRows" :key="row.key" class="confirm-dialog__row">
            <span class="confirm-dialog__label">{{ row.label }}</span>
            <span class="confirm-dialog__colon">:</span>
            <span class="confirm-dialog__value">
              <template v-if="row.isFile">
                <q-icon name="picture_as_pdf" color="red-6" size="18px" class="q-mr-xs" />
                <span class="text-red-6">{{ row.value }}</span>
              </template>
              <template v-else>{{ row.value }}</template>
            </span>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Footer Actions -->
      <q-card-actions class="confirm-dialog__footer row justify-between q-pa-md">
        <base-btn variant="outline" :label="t('editDetails')" @click="isOpen = false" />
        <base-btn :label="t('confirmSubmit')" :loading="submitting" @click="handleConfirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  form: { type: Object, required: true },
  /** 'school' | 'college' */
  institutionType: { type: String, default: 'school' },
  /** File object or null */
  resultFile: { type: [File, null], default: null },
  /** 'en' | 'gu' */
  lang: { type: String, default: 'en' },
  degreeOptions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const submitting = ref(false)

// ── i18n ──────────────────────────────────────────────────────────────────────
const translations = {
  en: {
    dialogTitle: 'Please review your details',
    dialogSubtitle: 'Kindly confirm your details before submitting.',
    // Personal — labels match form code exactly
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    motherName: "Mother's Name",
    parentPhone: 'Parent Phone Number',
    whatsappNumber: 'WhatsApp Number',
    emailId: 'Email ID',
    studentPhone: 'Student Phone Number',
    residentialAddress: 'Residential Address',
    // Academic
    standard: 'Standard',
    board: 'Board',
    degree: 'Degree',
    semester: 'Semester',
    university: 'University',
    year: 'Year',
    percentage: 'Percentage',
    attachment: 'Attachment (Result)',
    // Actions
    editDetails: 'Edit Details',
    confirmSubmit: 'Confirm & Submit',
    notProvided: 'N/A',
  },
  gu: {
    dialogTitle: 'કૃપા કરીને તમારી વિગતો તપાસો',
    dialogSubtitle: 'સબમિટ કરતા પહેલાં તમારી વિગતો ચકાસો.',
    firstName: 'પ્રથમ નામ',
    middleName: 'મધ્ય નામ',
    lastName: 'અટક',
    motherName: 'માતાનું નામ',
    parentPhone: 'વાલીનો ફોન નંબર',
    whatsappNumber: 'વૉટ્સઍપ નંબર',
    emailId: 'ઈ-મેઈલ આઈડી',
    studentPhone: 'વિદ્યાર્થીનો ફોન નંબર',
    residentialAddress: 'રહેઠાણનું સરનામું',
    standard: 'ધોરણ',
    board: 'બોર્ડ',
    degree: 'ડિગ્રી',
    semester: 'સેમેસ્ટર',
    university: 'યુનિવર્સિટી',
    year: 'વર્ષ',
    percentage: 'ટકાવારી',
    attachment: 'જોડાણ (પરિણામ)',
    editDetails: 'વિગત સંપાદિત કરો',
    confirmSubmit: 'પુષ્ટિ કરો અને સબમિટ કરો',
    notProvided: 'ઉપલબ્ધ નથી',
  },
}

function t(key) {
  return translations[props.lang]?.[key] ?? key
}

// ── Detail rows — built 1-to-1 from the form fields in the parent component ──
const detailRows = computed(() => {
  const f = props.form
  const na = t('notProvided')

  const rows = [
    // Personal Details section (same order as in the template)
    { key: 'first-name', label: t('firstName'), value: f['first_name'] || na },
    { key: 'middle-name', label: t('middleName'), value: f['middle_name'] || na },
    { key: 'last-name', label: t('lastName'), value: f['last_name'] || na },
    { key: 'mother-name', label: t('motherName'), value: f['mother_name'] || na },
    { key: 'parent-phone-number', label: t('parentPhone'), value: f['parents_phone'] || na },
    { key: 'whatsapp-number', label: t('whatsappNumber'), value: f['whatsapp_number'] || na },
    { key: 'email-id', label: t('emailId'), value: f['email'] || na },
    {
      key: 'student-phone-number',
      label: t('studentPhone'),
      value: f['student_phone'] || na,
    },
    {
      key: 'residential-address',
      label: t('residentialAddress'),
      value: f['residential_address'] || na,
    },
  ]

  // Academic Details — school vs college (mirrors the v-if/v-if in the template)
  if (props.institutionType === 'school') {
    rows.push(
      { key: 'standard', label: t('standard'), value: f['school_standard_id'] || na },
      { key: 'board', label: t('board'), value: f['school_board_id'] || na },
    )
  } else {
    rows.push(
      {
        key: 'degree',
        label: t('degree'),
        value: props.degreeOptions.find((item) => item.key === f['college_degree_id']).value || na,
      },
      { key: 'semester', label: t('semester'), value: f['semester'] || na },
      { key: 'university', label: t('university'), value: f['university_name'] || na },
    )
  }

  rows.push(
    { key: 'year', label: t('year'), value: f['result_year'] || na },
    { key: 'percentage', label: t('percentage'), value: f['percentage'] || na },
    {
      key: 'attachment',
      label: t('attachment'),
      value: props.resultFile?.name ?? na,
      isFile: !!props.resultFile,
    },
  )

  return rows
})

// ── Confirm ───────────────────────────────────────────────────────────────────
async function handleConfirm() {
  submitting.value = true
  try {
    await emit('confirm')
  } finally {
    submitting.value = false
    isOpen.value = false
  }
}
</script>

<style scoped lang="scss">
.confirm-dialog {
  width: 520px;
  max-width: 96vw;
  border-radius: 12px;
  overflow: hidden;

  &__header {
    padding: 20px 20px 14px;
    position: relative;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: $primary;
    line-height: 1.3;
  }

  &__subtitle {
    font-size: 13px;
    color: $grey-7;
    margin-top: 4px;
  }

  &__close {
    position: absolute;
    top: 14px;
    right: 14px;
    color: $grey-6;
  }

  &__body {
    padding: 0;
    max-height: 55vh;
    overflow-y: auto;
  }

  &__rows {
    display: flex;
    flex-direction: column;
  }

  &__row {
    display: grid;
    grid-template-columns: 190px 16px 1fr;
    align-items: flex-start;
    padding: 10px 20px;
    gap: 4px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);

    &:last-child {
      border-bottom: none;
    }

    &:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.018);
    }
  }

  &__label {
    font-size: 13.5px;
    font-weight: 600;
    color: $grey-8;
    line-height: 1.4;
  }

  &__colon {
    font-size: 13.5px;
    color: $grey-6;
    padding-top: 1px;
  }

  &__value {
    font-size: 13.5px;
    color: $grey-9;
    line-height: 1.4;
    word-break: break-word;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 2px;
  }

  &__footer {
    gap: 12px;
  }
}
</style>
