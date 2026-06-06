q
<template>
  <base-dialog v-model:show-dialog="isOpen" title="Student Details">
    <!-- Body -->
    <div class="column gap-12">
      <div v-for="(item, index) in detailRows" :key="index" class="row items-start">
        <div class="detail-label font-14 text-grey-8">{{ item.label }}</div>
        <div class="detail-colon font-14 text-grey-8">:</div>
        <div class="detail-value font-14 text-grey-9">{{ item.value ?? '—' }}</div>
      </div>
    </div>

    <q-separator class="my-16" />

    <!-- Footer -->
    <q-card-section class="row justify-center pt-0">
      <base-btn label="Close" variant="outline" @click="isOpen = false" />
    </q-card-section>
  </base-dialog>
</template>

<script setup>
import { date } from 'quasar'
import { computed } from 'vue'
import BaseDialog from 'src/components/General/BaseDialog.vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'

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

const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const detailRows = computed(() => [
  { label: 'Student Name', value: props.student.full_name },
  { label: "Mother's Name", value: props.student.mother_name },
  { label: 'Parent Phone Number', value: props.student.parents_phone },
  { label: 'WhatsApp Number', value: props.student.whatsapp_number },
  { label: 'Student Phone Number', value: props.student.student_phone },
  { label: 'Other Contact Number', value: props.student.otherContactNumber },
  { label: 'Home Address', value: props.student.residential_address },
  { label: 'Email ID', value: props.student.email },
  { label: 'Category Type', value: props.student.student_type_display },
  { label: 'Standard/Degree', value: props.student.standard_degree },
  { label: 'Result Year', value: props.student.result_year },
  { label: 'Percentage', value: props.student.percentage },
  { label: 'Board', value: props.student.school_board_id },
  { label: 'Submitted At', value: formatDateTime(props.student.submitted_at) },
])

const formatDateTime = (strDateTime) => {
  return date.formatDate(strDateTime, "DD MMM 'YY")
}
</script>

<style scoped lang="scss">
.detail-label {
  width: 160px;
  min-width: 160px;
  font-weight: 500;
}

.detail-colon {
  width: 20px;
  text-align: center;
}

.detail-value {
  flex: 1;
}
</style>
