<template>
  <div class="bg-white r-10 overflow-hidden ma-8 form-box">
    <div class="col-12 pa-0 column" style="height: 100%">
      <!-- Header Section -->
      <div class="bg-transparent mx-50 col-auto">
        <div class="row items-center no-wrap">
          <div v-if="!$q.screen.lt.lg" class="q-mr-md flex flex-center">
            <q-img
              src="src/assets/images/ahir_samaj_logo.png"
              style="width: clamp(100px, 12vw, 130px); height: auto"
              fit="contain"
            />
          </div>
          <div class="col text-center mt-10">
            <div :class="['text-primary', 'font-semibold', headerFontSize]">
              {{ t('orgName') }}
            </div>
            <div :class="['text-primary', 'font-semibold', headerFontSize]">
              {{ t('formTitle') }}
            </div>
            <div class="q-mt-sm font-18 text-grey-9 font-medium">
              {{ t('formSubtitle') }}
            </div>
          </div>

          <!-- Language Toggle — inline on md+ screens only -->
          <div v-if="!$q.screen.lt.md" class="lang-toggle q-ml-md">
            <div class="lang-toggle-wrap row items-center no-wrap">
              <div
                class="lang-pill cursor-pointer"
                :class="lang === 'en' ? 'lang-pill--active' : 'lang-pill--inactive'"
                @click="lang = 'en'"
              >
                <div class="lang-pill__name">English</div>
                <div class="lang-pill__code">EN</div>
              </div>
              <q-icon name="swap_horiz" size="22px" color="primary" class="lang-swap-icon" />
              <div
                class="lang-pill cursor-pointer"
                :class="lang === 'gu' ? 'lang-pill--active' : 'lang-pill--inactive'"
                @click="lang = 'gu'"
              >
                <div class="lang-pill__name">ગુજરાતી</div>
                <div class="lang-pill__code">GU</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Language Toggle — centered below title on small screens -->
        <div v-if="$q.screen.lt.md" class="row justify-center q-mt-sm q-mb-xs">
          <div class="lang-toggle-wrap row items-center no-wrap">
            <div
              class="lang-pill cursor-pointer"
              :class="lang === 'en' ? 'lang-pill--active' : 'lang-pill--inactive'"
              @click="lang = 'en'"
            >
              <div class="lang-pill__name">English</div>
              <div class="lang-pill__code">EN</div>
            </div>
            <q-icon name="swap_horiz" size="22px" color="primary" class="lang-swap-icon" />
            <div
              class="lang-pill cursor-pointer"
              :class="lang === 'gu' ? 'lang-pill--active' : 'lang-pill--inactive'"
              @click="lang = 'gu'"
            >
              <div class="lang-pill__name">ગુજરાતી</div>
              <div class="lang-pill__code">GU</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <q-form class="form-card ma-20 r-10 col smooth-scroll">
        <div class="form-inner" :class="$q.screen.lt.md ? 'column' : 'row full-height'">
          <!-- Personal Details -->
          <div :class="$q.screen.lt.md ? 'col-auto' : 'col'" class="pa-20">
            <div class="font-20 font-semibold text-primary section-header">
              {{ t('personalDetails') }}
            </div>
            <div class="mt-20 column gap-20">
              <div class="row gap-16">
                <base-input
                  v-model="form.first_name"
                  :label="t('firstName')"
                  mandatory
                  class="col"
                />
                <base-input
                  v-model="form.middle_name"
                  :label="t('middleName')"
                  mandatory
                  class="col"
                />
              </div>

              <base-input v-model="form.last_name" :label="t('lastName')" mandatory />
              <base-input v-model="form.mother_name" :label="t('motherName')" mandatory />
              <base-input
                v-model="form.parents_phone"
                :label="t('parentPhone')"
                mask="##########"
                mandatory
              />
              <base-input
                v-model="form.whatsapp_number"
                :label="t('whatsappNumber')"
                mask="##########"
                mandatory
              />
              <base-input v-model="form.email" :label="t('emailId')" />
              <base-input
                v-model="form.student_phone"
                :label="t('studentPhone')"
                mask="##########"
              />
              <base-input
                v-model="form.residential_address"
                :label="t('residentialAddress')"
                mandatory
                type="textarea"
                autogrow
              />
            </div>
          </div>

          <!-- Separator -->
          <q-separator :vertical="$q.screen.gt.sm" />

          <!-- Academic Details -->
          <div :class="$q.screen.lt.md ? 'col-auto' : 'col'" class="pa-20">
            <div class="font-20 font-semibold text-primary section-header">
              {{ t('academicDetails') }}
            </div>
            <div class="column gap-20 mt-20">
              <!-- School / College Toggle -->
              <div>
                <div class="text-grey-7 font-14 font-medium q-mb-sm">
                  {{ t('schoolCollegeLabel') }} <span class="text-negative">*</span>
                </div>
                <div class="row gap-10">
                  <q-btn
                    :outline="institutionType !== 'school'"
                    :color="institutionType === 'school' ? 'primary' : 'grey-5'"
                    :label="t('school')"
                    icon="school"
                    @click="institutionType = 'school'"
                    class="col"
                    unelevated
                  />
                  <q-btn
                    :outline="institutionType !== 'college'"
                    :color="institutionType === 'college' ? 'primary' : 'grey-5'"
                    :label="t('college')"
                    icon="account_balance"
                    @click="institutionType = 'college'"
                    class="col"
                    unelevated
                  />
                </div>
              </div>

              <!-- School Fields -->
              <template v-if="institutionType === 'school'">
                <base-select
                  v-model="form.school_standard_id"
                  :arr-options="standardOptions"
                  :label="t('standard')"
                  :use-input="true"
                  mandatory
                  min-width="100%"
                />
                <base-select
                  v-model="form.school_board_id"
                  :arr-options="boardOptions"
                  :label="t('board')"
                  mandatory
                  min-width="100%"
                />
              </template>

              <!-- College Fields -->
              <template v-if="institutionType === 'college'">
                <base-select
                  v-model="form.college_degree_id"
                  :arr-options="degreeOptions"
                  :label="t('degree')"
                  mandatory
                  min-width="100%"
                  :use-input="true"
                />
                <base-select
                  v-model="form.semester"
                  :arr-options="semesterOptions"
                  :label="t('semester')"
                  mandatory
                  min-width="100%"
                />
                <base-input v-model="form.university_name" :label="t('university')" />
              </template>

              <base-select
                v-model="form.result_year"
                :arr-options="yearOptions"
                :label="t('year')"
                mandatory
                min-width="100%"
              />
              <base-input
                v-model="form.percentage"
                :label="t('percentage')"
                mandatory
                type="number"
                min="0"
                max="100"
              />

              <BaseFileUpload
                v-model="resultFile"
                :label="t('attachment')"
                :required="true"
                :error-message="uploadError"
                :max-size-mb="10"
                @error="uploadError = $event"
              />
            </div>
          </div>
        </div>
      </q-form>

      <!-- Footer Section -->
      <div class="row justify-between mx-24 col-auto q-mb-md">
        <base-btn
          variant="outline"
          :label="t('clearForm')"
          @click="showClearDialog = true"
          :disable="!isFormDirty"
        />
        <base-btn :label="t('submitForm')" @click="handleSubmit" />
      </div>

      <ClearFormDialog v-model="showClearDialog" :lang="lang" @confirm="handleClear" />
      <ConfirmSubDialog
        v-model="showConfirmDialog"
        :form="form"
        :institution-type="institutionType"
        :result-file="resultFile"
        :lang="lang"
        @confirm="submitToApi"
      />

      <q-inner-loading
        :showing="blnLoading"
        label="Please wait..."
        label-class="text-primary"
        label-style="font-size: 1.1em"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import BaseBtn from 'src/components/General/BaseBtn.vue'
import BaseInput from 'src/components/General/BaseInput.vue'
import BaseSelect from 'src/components/General/BaseSelect.vue'
import BaseFileUpload from 'src/components/General/BaseFileUpload.vue'
import ClearFormDialog from 'src/components/Students/ClearFormDialog.vue'
import ConfirmSubDialog from 'src/components/Students/ConfirmSubDialog.vue'
import { yearOptions } from 'src/Helpers/dropDowns'
import { api } from 'src/boot/axios'

const $q = useQuasar()

// ── Language ──────────────────────────────────────────────────────────────────
const lang = ref('gu') // 'en' | 'gu'

const translations = {
  en: {
    orgName: 'Ahir Samaj',
    formTitle: 'Student Result Submission Form',
    formSubtitle: 'Please fill in the details below',
    personalDetails: 'Personal Details',
    firstName: 'First Name',
    middleName: 'Middle Name',
    lastName: 'Last Name',
    motherName: "Mother's Name",
    parentPhone: 'Parent Phone Number',
    whatsappNumber: 'WhatsApp Number',
    emailId: 'Email ID (Optional)',
    studentPhone: 'Student Phone Number (Optional)',
    residentialAddress: 'Residential Address',
    academicDetails: 'Academic Details',
    schoolCollegeLabel: 'School / College',
    school: 'School',
    college: 'College',
    standard: 'Standard',
    board: 'Board',
    degree: 'Degree',
    semester: 'Semester',
    university: 'University (Optional)',
    year: 'Year',
    percentage: 'Percentage',
    attachment: 'Attachment (Result)',
    clearForm: 'Clear Form',
    submitForm: 'Submit Form',
  },
  gu: {
    orgName: 'આહિર સમાજ',
    formTitle: 'વિદ્યાર્થી પરિણામ સબમિશન ફોર્મ',
    formSubtitle: 'કૃપા કરીને નીચે વિગતો ભરો',
    personalDetails: 'વ્યક્તિગત વિગતો',
    firstName: 'પ્રથમ નામ',
    middleName: 'મધ્ય નામ',
    lastName: 'અટક',
    motherName: 'માતાનું નામ',
    parentPhone: 'વાલીનો ફોન નંબર',
    whatsappNumber: 'વૉટ્સઍપ નંબર',
    emailId: 'ઈ-મેઈલ આઈડી (વૈકલ્પિક)',
    studentPhone: 'વિદ્યાર્થીનો ફોન નંબર (વૈકલ્પિક)',
    residentialAddress: 'રહેઠાણનું સરનામું',
    academicDetails: 'શૈક્ષણિક વિગતો',
    schoolCollegeLabel: 'શાળા / કૉલેજ',
    school: 'શાળા',
    college: 'કૉલેજ',
    standard: 'ધોરણ',
    board: 'બોર્ડ',
    degree: 'ડિગ્રી',
    semester: 'સેમેસ્ટર',
    university: 'યુનિવર્સિટી (વૈકલ્પિક)',
    year: 'વર્ષ',
    percentage: 'ટકાવારી',
    attachment: 'જોડાણ (પરિણામ)',
    clearForm: 'ફોર્મ સાફ કરો',
    submitForm: 'ફોર્મ સબમિટ કરો',
  },
}

const showConfirmDialog = ref(false)

const standardOptions = ref([])
const boardOptions = ref([])
const degreeOptions = ref([])

/** Helper – returns the translated string for the current language */
function t(key) {
  return translations[lang.value][key] ?? key
}

// ── Form state ────────────────────────────────────────────────────────────────
const resultFile = ref(null)
const uploadError = ref('')
const institutionType = ref('school') // 'school' | 'college'

const semesterOptions = [
  { key: 1, value: 'Semester 1' },
  { key: 2, value: 'Semester 2' },
  { key: 3, value: 'Semester 3' },
  { key: 4, value: 'Semester 4' },
  { key: 5, value: 'Semester 5' },
  { key: 6, value: 'Semester 6' },
  { key: 7, value: 'Semester 7' },
  { key: 8, value: 'Semester 8' },
]

const form = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  mother_name: '',
  parents_phone: '',
  whatsapp_number: '',
  email: '',
  student_phone: '',
  residential_address: '',
  school_standard_id: '',
  school_board_id: '',
  college_degree_id: '',
  semester: '',
  university_name: '',
  result_year: '',
  percentage: '',
})

const showClearDialog = ref(false)

const blnLoading = ref(false)

// ── Handlers ──────────────────────────────────────────────────────────────────
function handleSubmit() {
  // TODO: add your validation logic here before opening the dialog
  showConfirmDialog.value = true
}

async function submitToApi() {
  const formData = new FormData()
  Object.entries(form).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('student_type', institutionType.value)
  if (resultFile.value) {
    formData.append('result_image', resultFile.value)
  }
  api.post('/submissions', formData).then((response) => {
    if (response && response.status === 200) {
      console.log(response)
    }
  })
}

function handleClear() {
  Object.keys(form).forEach((key) => (form[key] = ''))
  resultFile.value = null
  uploadError.value = ''
  institutionType.value = 'school'
}

function getAllDropDownOptions() {
  blnLoading.value = true

  api
    .get('/dropdowns/all')
    .then((response) => {
      if (response && response.status === 200) {
        let objResponseData = response.data.data

        standardOptions.value = objResponseData?.standards
        boardOptions.value = objResponseData?.boards
        degreeOptions.value = objResponseData?.degrees
      }
    })
    .finally(() => {
      blnLoading.value = false
    })
}

// ── Computed ──────────────────────────────────────────────────────────────────
const headerFontSize = computed(() => {
  if ($q.screen.xs) return 'font-20'
  if ($q.screen.sm) return 'font-24'
  return 'font-26'
})

const isFormDirty = computed(() => {
  const hasFormData = Object.values(form).some((val) => val !== '')
  return hasFormData || !!resultFile.value
})

onMounted(() => {
  getAllDropDownOptions()
})

// const isFormValid = computed(() => {
//   const f = form

//   const commonMandatory = [
//     f['first-name'],
//     f['middle-name'],
//     f['last-name'],
//     f['mother-name'],
//     f['parent-phone-number'],
//     f['whatsapp-number'],
//     f['residential-address'],
//     f['year'],
//     f['percentage'],
//   ]

//   const institutionMandatory =
//     institutionType.value === 'school' ? [f['standard'], f['board']] : [f['degree'], f['semester']]

//   const allFields = [...commonMandatory, ...institutionMandatory]

//   const allFieldsFilled = allFields.every((val) => {
//     // null or undefined
//     if (val === null || val === undefined) return false

//     // string check
//     if (typeof val === 'string' && val.trim() === '') return false

//     // array check
//     if (Array.isArray(val) && val.length === 0) return false

//     return true
//   })

//   const attachmentUploaded = !!resultFile.value

//   return allFieldsFilled && attachmentUploaded
// })
</script>

<style scoped lang="scss">
.form-box {
  border: 3px solid #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: calc(100vh - 16px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.form-card {
  border: 2px solid $border-color;
  overflow-y: auto;
}

.form-inner {
  &.row.full-height {
    height: 100%;
    .col {
      overflow-y: auto;
    }
  }
  &.column {
    height: auto;
  }
}

.section-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding-bottom: 10px;
  padding-top: 4px;
}

.lang-toggle {
  flex-shrink: 0;
}

.lang-toggle-wrap {
  border: 2px solid $primary;
  border-radius: 50px;
  padding: 4px 6px;
  background: white;
  gap: 4px;
}

.lang-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  padding: 6px 18px;
  transition:
    background 0.2s,
    color 0.2s;
  line-height: 1.2;

  &--active {
    background: $primary;
    .lang-pill__name,
    .lang-pill__code {
      color: white;
    }
  }

  &--inactive {
    background: transparent;
    .lang-pill__name,
    .lang-pill__code {
      color: $primary;
    }
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
  }

  &__code {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.85;
  }
}

.lang-swap-icon {
  flex-shrink: 0;
}
</style>
