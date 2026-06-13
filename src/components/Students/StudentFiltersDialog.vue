<template>
  <q-dialog v-model="dialog">
    <q-card style="width: 1100px; max-width: 95vw">
      <q-card-section class="row items-center justify-between">
        <div class="text-h6 font-semibold">Filter Students</div>

        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- Student Name -->
          <div class="col-12 col-md-4">
            <q-input outlined dense v-model="filters.studentName" label="Student Name" />
          </div>

          <!-- Phone -->
          <div class="col-12 col-md-4">
            <q-input outlined dense v-model="filters.phone" label="Phone / WhatsApp" />
          </div>

          <!-- School / College -->
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.studentType"
              :options="studentTypeOptions"
              label="School / College"
              @update:model-value="onStudentTypeChange"
            />
          </div>

          <!-- Standard (only for School) -->
          <div class="col-12 col-md-4" v-if="filters.studentType !== 'college'">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.standard"
              :options="standardOptions"
              label="Standard"
            />
          </div>

          <!-- Degree (only for College) -->
          <div class="col-12 col-md-4" v-if="filters.studentType !== 'school'">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.degree"
              :options="degreeOptions"
              label="Degree"
            />
          </div>

          <!-- Board -->
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.board"
              :options="boardOptions"
              label="Board"
            />
          </div>

          <!-- Year -->
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.year"
              :options="yearOptions"
              label="Year"
            />
          </div>

          <!-- Semester -->
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.semester"
              :options="semesterOptions"
              label="Semester"
            />
          </div>

          <!-- Percentage From -->
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              type="number"
              v-model.number="filters.percentageFrom"
              label="Percentage From"
            />
          </div>

          <!-- Percentage To -->
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              type="number"
              v-model.number="filters.percentageTo"
              label="Percentage To"
            />
          </div>

          <!-- Rank -->
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              type="number"
              v-model.number="filters.rank"
              label="Rank (Top N)"
            />
          </div>

          <!-- Status -->
          <div class="col-12 col-md-4">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="filters.status"
              :options="statusOptions"
              label="Status"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-lg">
        <q-btn outline label="Reset" class="q-px-xl" @click="resetFilters" />

        <q-btn color="primary" label="Apply Filters" class="q-px-xl" @click="onApplyFilters" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  standardOptions: Array,
  degreeOptions: Array,
  boardOptions: Array,
})

const emit = defineEmits(['update:modelValue', 'apply-filters'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const getDefaultFilters = () => ({
  studentName: '',
  phone: '',
  studentType: null,
  standard: null,
  degree: null,
  board: null,
  year: null,
  semester: null,
  percentageFrom: null,
  percentageTo: null,
  rank: null,
  status: null,
})

const filters = ref(getDefaultFilters())

const studentTypeOptions = [
  { label: 'All', value: null },
  { label: 'School', value: 'school' },
  { label: 'College', value: 'college' },
]

const semesterOptions = [
  { label: 'All', value: null },
  ...Array.from({ length: 8 }, (_, i) => ({
    label: `Semester ${i + 1}`,
    value: i + 1,
  })),
]

const statusOptions = [
  { label: 'All', value: null },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'verified' },
  { label: 'Rejected', value: 'rejected' },
]

const currentYear = new Date().getFullYear()

const yearOptions = [
  { label: 'All', value: null },
  { label: `${currentYear}`, value: currentYear },
  { label: `${currentYear - 1}`, value: currentYear - 1 },
]

const onStudentTypeChange = (value) => {
  // Clear out the irrelevant filter when switching type
  if (value === 'school') {
    filters.value.degree = null
  } else if (value === 'college') {
    filters.value.standard = null
  } else {
    filters.value.standard = null
    filters.value.degree = null
  }
}

const resetFilters = () => {
  filters.value = getDefaultFilters()
}

const onApplyFilters = () => {
  emit('apply-filters', { ...filters.value })
  dialog.value = false
}
</script>
