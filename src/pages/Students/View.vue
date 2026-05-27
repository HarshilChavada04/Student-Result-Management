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
        <base-btn label="Filters" variant="outline" icon-left="fa-regular fa-filter"></base-btn>
      </div>
      <div>
        <base-btn
          label="Export"
          variant="outline"
          icon-left="fa-regular fa-arrow-down-to-bracket"
          :icon-right="`fa-solid fa-chevron-${blnShowExportMenu ? 'up' : 'down'}`"
        >
          <q-menu v-model="blnShowExportMenu" class="mt-10 mr-30 w-140">
            <div class="column">
              <div class="bg-hover-effect px-10 py-10 cursor-pointer" @click="exportExcel">
                <div class="row gap-8 items-center no-wrap">
                  <q-icon name="fa-regular fa-file-spreadsheet" class="font-20 text-positive" />
                  <span class="font-14 font-medium">Export as Excel</span>
                </div>
              </div>

              <div class="bg-hover-effect px-10 py-10 cursor-pointer" @click="exportPDF">
                <div class="row gap-8 items-center no-wrap ml-2">
                  <q-icon name="fa-regular fa-file-pdf" class="font-18 text-negative" />
                  <span class="font-14 font-medium">Export as PDF</span>
                </div>
              </div>
            </div>
          </q-menu>
        </base-btn>
      </div>
    </div>

    <!-- Table Listing Data -->
    <q-table
      :columns="arrColumns"
      :rows="arrStudentsData"
      class="table-class"
      separator="horizontal"
    >
      <template v-slot:no-data="props">
        <q-tr class="full-width row justify-center" :props="props">
          {{ props.message }}
        </q-tr>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div>
            <span
              class="text-capitalize r-6 font-medium px-8 py-3"
              :class="getStatusStyles(props.value)"
            >
              {{ props.value }}
            </span>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center items-center gap-12">
            <div>
              <q-btn
                dense
                outline
                class="px-7 text-primary r-12"
                style="border: 1px solid var(--primary)"
                @click="viewOtherDetails(props.row)"
              >
                <q-icon name="fa-regular fa-eye" size="12px"></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                dense
                outline
                class="px-7 text-primary r-12"
                style="border: 1px solid var(--primary)"
              >
                <q-icon name="fa-regular fa-arrow-down-to-bracket" size="12px"></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                dense
                round
                outline
                class="font-14 pa-1 text-positive"
                :disable="props.row.status === 'verified'"
                @click="showConfirmationDialog('verified')"
              >
                <q-icon name="fa-regular fa-check" size="12px"></q-icon>
              </q-btn>
            </div>
            <div>
              <q-btn
                dense
                round
                outline
                class="font-14 pa-1 text-negative"
                :disable="props.row.status === 'rejected'"
                @click="showConfirmationDialog('rejected')"
              >
                <q-icon name="fa-regular fa-xmark" size="12px"></q-icon>
              </q-btn>
            </div>
          </div>
        </q-td>
      </template>
    </q-table>

    <view-other-details-dialog v-model="blnShowStudentDetails" :student="objStudentDetails" />
    <confirmation-dialog v-model="blnShowConfirmationDialog" :status="strStatus" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import ViewOtherDetailsDialog from 'src/components/Students/ViewOtherDetailsDialog.vue'
import ConfirmationDialog from 'src/components/Students/ConfirmationDialog.vue'
import BaseCard from 'src/components/General/BaseCard.vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'

const arrStudentsData = ref([])

const blnShowStudentDetails = ref(false)
const blnShowExportMenu = ref(false)
const objStudentDetails = ref({})
const blnShowConfirmationDialog = ref(false)
const strStatus = ref('')

const fetchStudentsData = () => {
  api.get('/v1/get-students-listing').then((response) => {
    if (response && response.status === 200) {
      arrStudentsData.value = response.data.data
    }
  })
}

const viewOtherDetails = (studentDetails) => {
  blnShowStudentDetails.value = true
  objStudentDetails.value = studentDetails
}

const showConfirmationDialog = (strStudentStatus) => {
  blnShowConfirmationDialog.value = true
  strStatus.value = strStudentStatus
}

const exportExcel = () => {
  const exportColumns = arrColumns.value.slice(0, -1)

  const headerRow = exportColumns.map((col) => col.label)
  const bodyRows = arrStudentsData.value.map((row) => exportColumns.map((col) => row[col.field]))

  const sheetData = [headerRow, ...bodyRows]

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData)

  // Auto fit column widths
  worksheet['!cols'] = exportColumns.map((col) => {
    const maxLength = Math.max(
      col.label.length,
      ...arrStudentsData.value.map((row) => String(row[col.field] ?? '').length),
    )
    return { wch: maxLength + 2 }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  XLSX.writeFile(workbook, 'table-export.xlsx')
}

const exportPDF = () => {
  const doc = new jsPDF('landscape')

  doc.setFontSize(14)
  doc.text('Students Data', 14, 14)

  const exportColumns = arrColumns.value.slice(0, -1)
  const headerRow = exportColumns.map((col) => col.label)
  const bodyRows = arrStudentsData.value.map((row) => exportColumns.map((col) => row[col.field]))

  autoTable(doc, {
    head: [headerRow],
    body: bodyRows,
    startY: 22,
    horizontalPageBreak: true, // splits remaining columns on next page
    horizontalPageBreakRepeatHead: true, // repeats header on each broken page
    tableWidth: 'auto',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'ellipsize', // cuts off long text with '...' instead of breaking
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
  })

  doc.save('table-export.pdf')
}

const arrKpiCardsData = computed(() => {
  const students = arrStudentsData.value || []

  const totalStudents = students.length

  const pendingStudents = students.filter((student) => student.status === 'pending').length

  const approvedStudents = students.filter((student) => student.status === 'approved').length

  const rejectedStudents = students.filter((student) => student.status === 'rejected').length

  return [
    {
      label: 'Total Students',
      subLabel: 'All Registered',
      icon: 'fa-light fa-users',
      iconColor: 'text-info',
      iconBgColor: 'bg-info-bg',
      count: totalStudents,
    },
    {
      label: 'Pending',
      subLabel: 'Awaiting Review',
      icon: 'fa-light fa-clock',
      iconColor: 'text-warning',
      iconBgColor: 'bg-warning-bg',
      count: pendingStudents,
    },
    {
      label: 'Approved',
      subLabel: 'Verified Students',
      icon: 'fa-regular fa-circle-check',
      iconColor: 'text-positive',
      iconBgColor: 'bg-positive-bg',
      count: approvedStudents,
    },
    {
      label: 'Rejected',
      subLabel: 'Not Approved',
      icon: 'fa-regular fa-circle-xmark',
      iconColor: 'text-negative',
      iconBgColor: 'bg-negative-bg',
      count: rejectedStudents,
    },
  ]
})

const arrColumns = ref([
  {
    name: 'studentId',
    label: 'Student ID',
    field: 'studentId',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 5%',
  },
  {
    name: 'studentName',
    label: 'Student Name',
    field: 'studentName',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 8%',
  },
  {
    name: 'parentName',
    label: 'Parent Name',
    field: 'parentName',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 8%',
  },
  {
    name: 'standard',
    label: 'Standard',
    field: 'standard',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 5%',
  },
  {
    name: 'percentage',
    label: 'Percentage',
    field: 'percentage',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 10%',
  },
  {
    name: 'board',
    label: 'Board',
    field: 'board',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 5%',
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 10%',
  },
  {
    name: 'parentPhone',
    label: 'Parent Phone',
    field: 'phoneNumber',
    sortable: false,
    align: 'left',
    headerStyle: 'width: 6%',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'left',
    headerStyle: 'width:6%',
  },
  {
    name: 'actions',
    label: 'Actions',
    sortable: false,
    align: 'center',
    headerStyle: 'width: 15%',
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

onMounted(fetchStudentsData)
</script>

<style scoped>
.sticky-filters {
  position: sticky;
  top: 100px;
  z-index: 10;
  background: white;
  padding: 10px 0;
}
</style>
