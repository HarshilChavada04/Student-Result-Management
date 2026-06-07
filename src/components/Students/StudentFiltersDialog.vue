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
            />
          </div>

          <!-- Standard -->
          <div class="col-12 col-md-4">
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

          <!-- Degree -->
          <div class="col-12 col-md-4">
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
              v-model="filters.percentageFrom"
              label="Percentage From"
            />
          </div>

          <!-- Percentage To -->
          <div class="col-12 col-md-4">
            <q-input
              outlined
              dense
              type="number"
              v-model="filters.percentageTo"
              label="Percentage To"
            />
          </div>

          <!-- Rank -->
          <div class="col-12 col-md-4">
            <q-input outlined dense type="number" v-model="filters.rank" label="Rank (Top N)" />
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

        <q-btn color="primary" label="Apply Filters" class="q-px-xl" @click="applyFilters" />
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
})

const emit = defineEmits(['update:modelValue', 'apply-filters'])

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const filters = ref({
  studentName: '',
  phone: '',
  studentType: null,
  standard: null,
  board: null,
  year: null,
  degree: null,
  semester: null,
  percentageFrom: null,
  percentageTo: null,
  rank: null,
  status: null,
})

const studentTypeOptions = [
  { label: 'All', value: null },
  { label: 'School', value: 'school' },
  { label: 'College', value: 'college' },
]

const boardOptions = [{ label: 'All', value: null }]

const yearOptions = [{ label: 'All', value: null }]

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

const resetFilters = () => {
  filters.value = {
    studentName: '',
    phone: '',
    studentType: null,
    standard: null,
    board: null,
    year: null,
    degree: null,
    semester: null,
    percentageFrom: null,
    percentageTo: null,
    rank: null,
    status: null,
  }
}

const applyFilters = () => {
  emit('apply-filters', { ...filters.value })
  dialog.value = false
}
</script>
