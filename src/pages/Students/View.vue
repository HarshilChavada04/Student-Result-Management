<template>
  <div>
    <!-- KPI Cards -->
    <div class="row gap-30">
      <base-card class="col" v-for="(data, index) in arrKpiCardsData" :key="index">
        <div class="row justify-start items-center gap-16">
          <div :class="[data.iconColor, data.iconBgColor, 'r-16', 'px-14', 'py-20']">
            <q-icon :name="data.icon" class="font-30"></q-icon>
          </div>
          <div class="column gap-2">
            <div class="font-16 text-grey-8 font-medium">{{ data.label }}</div>
            <div class="font-semibold font-22">{{ data.count }}</div>
            <div class="font-16 text-grey-8 font-medium">{{ data.subLabel }}</div>
          </div>
        </div>
      </base-card>
    </div>

    <!-- Filters & Export Section -->
    <div class="row justify-end gap-10 my-25 sticky-filters">
      <div>
        <base-btn
          label="Filters"
          variant="outline"
          icon-left="filter_list"
          @click="blnShowFiltersDialog = true"
        />
      </div>
      <div>
        <base-btn
          label="Export"
          variant="outline"
          icon-left="download"
          :icon-right="blnShowExportMenu ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        >
          <q-menu v-model="blnShowExportMenu" class="mt-10 mr-30 w-140">
            <div class="column">
              <div class="bg-hover-effect px-10 py-10 cursor-pointer" @click="exportExcel">
                <div class="row gap-8 items-center no-wrap">
                  <q-icon name="table_view" class="font-20 text-positive" />
                  <span class="font-14 font-medium">Export as Excel</span>
                </div>
              </div>

              <div class="bg-hover-effect px-10 py-10 cursor-pointer" @click="exportPDF">
                <div class="row gap-8 items-center no-wrap ml-2">
                  <q-icon name="picture_as_pdf" class="font-18 text-negative" />
                  <span class="font-14 font-medium">Export as PDF</span>
                </div>
              </div>
            </div>
          </q-menu>
        </base-btn>
      </div>
    </div>

    <!-- Table Listing Data -->
    <!-- Table Listing Data -->
    <div v-if="blnLoading" class="column items-center justify-center q-py-xl">
      <q-spinner color="primary" size="3em" />
      <div class="font-14 text-grey-8 q-mt-sm">Loading students data...</div>
    </div>

    <div v-else>
      <div v-for="[groupName, students] in groupedStudents" :key="groupName" class="q-mb-xl">
        <div
          class="text-h6 text-white text-center bg-primary py-2"
          style="border-radius: 10px 10px 0 0"
        >
          {{ groupName }}
        </div>

        <q-table
          :rows="students"
          :columns="displayColumns"
          flat
          bordered
          hide-bottom
          separator="horizontal"
          :rows-per-page-options="[0]"
        >
          <template #body-cell-rank="props">
            <q-td :props="props">
              {{ props.row.rank || '-' }}
            </q-td>
          </template>

          <template #body-cell-status="props">
            <q-td :props="props">
              <span
                class="px-10 py-5 r-20 text-capitalize"
                :class="getStatusStyles(props.row.submission_status)"
              >
                {{ props.row.submission_status }}
              </span>
            </q-td>
          </template>

          <template #body-cell-standard_degree="props">
            <q-td :props="props">
              {{
                getSchoolDegreeValue(
                  props.row.student_type,
                  props.row.student_type === 'school'
                    ? props.row.school_standard_id
                    : props.row.college_degree_id,
                  props.row,
                )
              }}
            </q-td>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row justify-center gap-5">
                <q-btn flat round icon="visibility" size="sm" @click="viewOtherDetails(props.row)">
                  <base-tooltip> View Details </base-tooltip>
                </q-btn>

                <q-btn flat round icon="rate_review" size="sm" @click="openResultDialog(props.row)">
                  <base-tooltip> Review Submission </base-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <div v-if="groupedStudents.length === 0" class="text-center text-grey-7 q-py-xl">
        No students found.
      </div>
    </div>

    <view-other-details-dialog v-model="blnShowStudentDetails" :student="objStudentDetails" />
    <confirmation-dialog v-model="blnShowConfirmationDialog" :status="strStatus" />
    <StudentFiltersDialog
      v-model="blnShowFiltersDialog"
      :standard-options="[
        { label: 'All', value: null },
        ...arrStandardsData.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      ]"
      :degree-options="[
        { label: 'All', value: null },
        ...arrDegreeData.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      ]"
      :board-options="[
        { label: 'All', value: null },
        ...arrBoardData.map((item) => ({
          label: item.value,
          value: item.key,
        })),
      ]"
      @apply-filters="applyFilters"
    />

    <ReviewSubmissionDialog
      v-model="blnShowResultDialog"
      :student="objReviewStudent"
      @status-change="fetchStudentsData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import { api } from 'src/boot/axios'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import 'src/fonts/NotoSansGujarati'
import * as XLSX from 'xlsx'
import ViewOtherDetailsDialog from 'src/components/Students/ViewOtherDetailsDialog.vue'
import ConfirmationDialog from 'src/components/Students/ConfirmationDialog.vue'
import StudentFiltersDialog from 'src/components/Students/StudentFiltersDialog.vue'
import ReviewSubmissionDialog from 'src/components/Students/ReviewSubmissionDialog.vue'
import BaseCard from 'src/components/General/BaseCard.vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'
import BaseTooltip from 'src/components/General/BaseTooltip.vue'

const blnShowResultDialog = ref(false)

const objReviewStudent = ref({})

const blnShowFiltersDialog = ref(false)
const objFilters = ref({})

const arrStudentsData = ref([])
const arrOriginalStudentsData = ref([])

const blnLoading = ref(false)

const arrStandardsData = ref([])
const arrDegreeData = ref([])
const arrBoardData = ref([])

const blnShowStudentDetails = ref(false)
const blnShowExportMenu = ref(false)
const objStudentDetails = ref({})
const blnShowConfirmationDialog = ref(false)
const strStatus = ref('')

const getSortedStudents = (students) => {
  const standardOrderMap = {}
  const degreeOrderMap = {}

  arrStandardsData.value.forEach((item, index) => {
    standardOrderMap[item.key] = index
  })

  arrDegreeData.value.forEach((item, index) => {
    degreeOrderMap[item.key] = index
  })

  return [...students].sort((a, b) => {
    // School always before College
    if (a.student_type !== b.student_type) {
      return a.student_type === 'school' ? -1 : 1
    }

    // School students
    if (a.student_type === 'school') {
      return (
        (standardOrderMap[a.school_standard_id] ?? 9999) -
        (standardOrderMap[b.school_standard_id] ?? 9999)
      )
    }

    // College students
    return (
      (degreeOrderMap[a.college_degree_id] ?? 9999) - (degreeOrderMap[b.college_degree_id] ?? 9999)
    )
  })
}

const applyFilters = (filters) => {
  objFilters.value = filters

  let data = [...arrOriginalStudentsData.value]

  if (filters.studentName) {
    data = data.filter((student) =>
      getStudentFullName(student).toLowerCase().includes(filters.studentName.toLowerCase()),
    )
  }

  if (filters.phone) {
    data = data.filter((student) =>
      String(student.whatsapp_number || student.parents_phone).includes(filters.phone),
    )
  }

  if (filters.studentType) {
    data = data.filter((student) => student.student_type === filters.studentType)
  }

  if (filters.status) {
    data = data.filter((student) => student.submission_status === filters.status)
  }

  if (filters.semester) {
    data = data.filter((student) => Number(student.semester) === Number(filters.semester))
  }

  if (filters.percentageFrom) {
    data = data.filter((student) => Number(student.percentage) >= Number(filters.percentageFrom))
  }

  if (filters.percentageTo) {
    data = data.filter((student) => Number(student.percentage) <= Number(filters.percentageTo))
  }

  if (filters.standard) {
    data = data.filter((student) => student.school_standard_id === filters.standard)
  }

  if (filters.degree) {
    data = data.filter((student) => student.college_degree_id === filters.degree)
  }

  if (filters.year) {
    data = data.filter((student) => student.result_year === filters.year)
  }

  if (filters.board) {
    data = data.filter((student) => student.school_board_id === filters.board)
  }

  if (filters.rank) {
    const groupedData = {}

    data.forEach((student) => {
      const baseKey =
        student.student_type === 'school'
          ? `school_${student.school_standard_id}`
          : `college_${student.college_degree_id}`

      const groupKey = student.semester ? `${baseKey}_sem${student.semester}` : baseKey

      if (!groupedData[groupKey]) {
        groupedData[groupKey] = []
      }

      groupedData[groupKey].push(student)
    })

    const rankedStudents = []

    Object.values(groupedData).forEach((group) => {
      const sortedGroup = [...group].sort((a, b) => Number(b.percentage) - Number(a.percentage))

      let currentRank = 0
      let previousPercentage = null

      const rankedGroup = sortedGroup.map((student) => {
        const percentage = Number(student.percentage)

        if (percentage !== previousPercentage) {
          currentRank += 1
        }

        previousPercentage = percentage

        return {
          ...student,
          rank: currentRank,
        }
      })

      const rankLimit = Number(filters.rank)

      rankedStudents.push(...rankedGroup.filter((student) => student.rank <= rankLimit))
    })

    data = rankedStudents
  }

  arrStudentsData.value = getSortedStudents(data)
}

const getStandards = async () => {
  const response = await api.get('/dropdowns/standards')

  if (response?.status === 200) {
    arrStandardsData.value = response.data.data.map((item) => ({
      key: item.key,
      value: item.value,
    }))
  }
}

const getDegrees = async () => {
  const response = await api.get('/dropdowns/degrees')

  if (response?.status === 200) {
    arrDegreeData.value = response.data.data.map((item) => ({
      key: item.key,
      value: item.value,
    }))
  }
}

const getBoards = async () => {
  const response = await api.get('/dropdowns/boards')

  if (response?.status === 200) {
    arrBoardData.value = response.data.data.map((item) => ({
      key: item.key,
      value: item.value,
    }))
  }
}

const openResultDialog = (student) => {
  objReviewStudent.value = {
    ...student,

    full_name: getStudentFullName(student),

    standard_degree: getSchoolDegreeValue(
      student.student_type,
      student.student_type === 'school' ? student.school_standard_id : student.college_degree_id,
      student,
    ),
  }

  blnShowResultDialog.value = true
}

const fetchStudentsData = async () => {
  const response = await api.get('/admin/submissions')

  if (response?.status === 200) {
    const sortedData = getSortedStudents(response.data.data)

    arrStudentsData.value = sortedData
    arrOriginalStudentsData.value = sortedData
  }
}

const getSchoolDegreeValue = (strCategoryType, strValue, row = null) => {
  if (strCategoryType === 'school') {
    const standard = arrStandardsData.value.find((item) => item.key == strValue)
    return standard?.value || '-'
  }

  const degree = arrDegreeData.value.find((item) => item.key == strValue)

  if (degree?.key === 'other') {
    return `Other - ${row?.other_degree_name || '-'}`
  }

  return degree?.value || '-'
}

const viewOtherDetails = (student) => {
  objStudentDetails.value = {
    ...student,

    full_name: getStudentFullName(student),

    phone_number: student.whatsapp_number || student.parents_phone,

    standard_degree: getSchoolDegreeValue(
      student.student_type,
      student.student_type === 'school' ? student.school_standard_id : student.college_degree_id,
      student,
    ),

    submitted_date: formatDateTime(student.submitted_at),

    student_type_display: student.student_type.toUpperCase(),
  }

  blnShowStudentDetails.value = true
}

const formatDateTime = (strDate) => {
  return date.formatDate(strDate, "DD MMM 'YY")
}

// const showConfirmationDialog = (strStudentStatus) => {
//   blnShowConfirmationDialog.value = true
//   strStatus.value = strStudentStatus
// }

const exportExcel = () => {
  const exportColumns = displayColumns.value.filter((column) => column.name !== 'actions')

  const headerRow = exportColumns.map((col) => col.label)

  const sheetData = []

  groupedStudents.value.forEach(([groupName, students]) => {
    // Group Heading
    sheetData.push([groupName])

    // Table Header
    sheetData.push(headerRow)

    // Table Data
    students.forEach((student) => {
      sheetData.push(exportColumns.map((col) => getExportValue(student, col)))
    })

    // Empty row between groups
    sheetData.push([])
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto column width
  worksheet['!cols'] = exportColumns.map((col, index) => {
    const maxLength = Math.max(
      col.label.length,
      ...sheetData
        .filter((row) => row.length > index)
        .map((row) => String(row[index] ?? '').length),
    )

    return {
      wch: maxLength + 2,
    }
  })

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')

  XLSX.writeFile(workbook, 'students-data.xlsx')
}

const exportPDF = () => {
  const doc = new jsPDF('landscape')

  doc.setFont('NotoSansGujarati-Regular')
  doc.setFontSize(14)
  doc.text('Students Data', 14, 14)

  const exportColumns = displayColumns.value.filter((column) => column.name !== 'actions')

  const headerRow = exportColumns.map((col) => col.label)

  let startY = 20

  groupedStudents.value.forEach(([groupName, students]) => {
    doc.setFontSize(12)
    doc.text(groupName, 14, startY)

    const bodyRows = students.map((student) =>
      exportColumns.map((col) => getExportValue(student, col)),
    )

    autoTable(doc, {
      startY: startY + 5,
      head: [headerRow],
      body: bodyRows,
      styles: {
        font: 'NotoSansGujarati-Regular',
        fontSize: 8,
      },
      headStyles: {
        font: 'NotoSansGujarati-Regular',
      },
    })

    startY = doc.lastAutoTable.finalY + 15

    if (startY > 180) {
      doc.addPage()
      startY = 20
    }
  })

  doc.save('students-data.pdf')
}

const arrKpiCardsData = computed(() => {
  const students = arrStudentsData.value || []

  const totalStudents = students.length

  const pendingStudents = students.filter(
    (student) => student.submission_status === 'pending',
  ).length

  const approvedStudents = students.filter(
    (student) => student.submission_status === 'verified',
  ).length

  const rejectedStudents = students.filter(
    (student) => student.submission_status === 'rejected',
  ).length

  return [
    {
      label: 'Total Students',
      subLabel: 'All Registered',
      icon: 'groups',
      iconColor: 'text-info',
      iconBgColor: 'bg-info-bg',
      count: totalStudents,
    },
    {
      label: 'Pending',
      subLabel: 'Awaiting Review',
      icon: 'schedule',
      iconColor: 'text-warning',
      iconBgColor: 'bg-warning-bg',
      count: pendingStudents,
    },
    {
      label: 'Approved',
      subLabel: 'Verified Students',
      icon: 'check_circle',
      iconColor: 'text-positive',
      iconBgColor: 'bg-positive-bg',
      count: approvedStudents,
    },
    {
      label: 'Rejected',
      subLabel: 'Not Approved',
      icon: 'cancel',
      iconColor: 'text-negative',
      iconBgColor: 'bg-negative-bg',
      count: rejectedStudents,
    },
  ]
})

const groupedStudents = computed(() => {
  const groups = new Map()

  arrStudentsData.value.forEach((student) => {
    const standardDegree = getSchoolDegreeValue(
      student.student_type,
      student.student_type === 'school' ? student.school_standard_id : student.college_degree_id,
      student,
    )

    const semesterLabel = student.semester ? `Semester ${student.semester}` : null

    const key = semesterLabel ? `${standardDegree} - ${semesterLabel}` : standardDegree

    if (!groups.has(key)) {
      groups.set(key, [])
    }

    groups.get(key).push(student)
  })

  groups.forEach((students) => {
    students.sort((a, b) => Number(b.percentage) - Number(a.percentage))
  })

  return Array.from(groups.entries())
})

const displayColumns = computed(() => {
  const columns = [...arrColumns.value]

  if (objFilters.value.rank) {
    columns.unshift({
      name: 'rank',
      label: 'Rank',
      field: 'rank',
      align: 'center',
      sortable: true,
      headerStyle: 'width: 5%',
    })
  }

  return columns
})

const arrColumns = ref([
  {
    name: 'student_name',
    label: 'Student Name',
    field: (row) => getStudentFullName(row),
    align: 'left',
    sortable: false,
    headerStyle: 'width: 5%',
  },
  {
    name: 'phone_number',
    label: 'Phone / WhatsApp',
    field: (row) => row.whatsapp_number || row.parents_phone,
    align: 'left',
    sortable: false,
    headerStyle: 'width: 5%',
  },
  {
    name: 'student_type',
    label: 'Type',
    field: (row) => (row.student_type ? row.student_type.toUpperCase() : '-'),
    align: 'left',
    sortable: false,
    headerStyle: 'width: 5%',
  },
  {
    name: 'standard_degree',
    label: 'Standard / Degree',
    align: 'left',
    sortable: false,
    headerStyle: 'width: 15%',
  },
  {
    name: 'semester',
    label: 'Semester',
    field: 'semester',
    align: 'left',
    sortable: false,
    headerStyle: 'width: 8%',
  },
  {
    name: 'percentage',
    label: 'Percentage',
    field: 'percentage',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 8%',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'submission_status',
    align: 'left',
    sortable: true,
    headerStyle: 'width: 8%',
  },
  {
    name: 'submitted_at',
    label: 'Submitted On',
    field: (row) => formatDateTime(row.submitted_at),
    align: 'left',
    sortable: true,
    headerStyle: 'width: 10%',
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    sortable: false,
    headerStyle: 'width: 10%',
  },
])

const getStatusStyles = (strStatus) => {
  const statusMap = {
    verified: 'text-positive bg-positive-bg',
    pending: 'text-warning bg-warning-bg',
    rejected: 'text-negative bg-negative-bg',
  }
  return statusMap[strStatus] ?? 'text-grey-7 bg-grey-2'
}

const getStudentFullName = (row) => {
  return `${row.first_name} ${row.middle_name} ${row.last_name}`
}

const getExportValue = (row, col) => {
  // If field is a function, execute it
  if (typeof col.field === 'function') {
    return col.field(row)
  }

  // Handle Standard / Degree column
  if (col.name === 'standard_degree') {
    return getSchoolDegreeValue(
      row.student_type,
      row.student_type === 'school' ? row.school_standard_id : row.college_degree_id,
      row,
    )
  }

  // Handle normal string fields
  if (typeof col.field === 'string') {
    return row[col.field]
  }

  return ''
}

onMounted(async () => {
  try {
    blnLoading.value = true

    await Promise.all([getStandards(), getDegrees(), getBoards()])

    await fetchStudentsData()
  } catch (error) {
    console.error(error)
  } finally {
    blnLoading.value = false
  }
})
</script>

<style scoped>
.sticky-filters {
  position: sticky;
  top: 100px;
  z-index: 10;
  background: white;
  padding: 10px 0;
}

:deep(th) {
  color: var(--q-primary) !important;
  font-weight: 600 !important;
}
</style>
