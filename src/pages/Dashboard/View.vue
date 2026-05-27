<template>
  <div>
    <div class="row gap-25">
      <base-card extraClass="column col" cardTitle="Card Component">
        <q-avatar>
          <img :src="userImage" alt="Random User" />
        </q-avatar>
      </base-card>
      <base-card
        extraClass="col"
        cardTitle="Card Component With Action Button"
        cardActionBtnTitle="See All"
        @card-action-click="console.log('See All Clicked')"
      >
        <q-avatar>
          <img :src="userImage" alt="Random User" />
        </q-avatar>
      </base-card>
    </div>
    <div class="row gap-25 my-25">
      <base-card
        extraClass="col"
        cardTitle="Button Components"
        @card-action-click="console.log('See All Clicked')"
      >
        <div class="row gap-30">
          <q-item class="row items-center gap-10">
            <q-item-label class="font-16 font-semibold">Primary Button: </q-item-label>
            <q-item-section>
              <BaseBtn label="Hello"> </BaseBtn>
            </q-item-section>
            <!-- <base-tooltip :model-value="true" no-parent-event>Hello </base-tooltip> -->
          </q-item>
          <q-item class="row items-center gap-10">
            <q-item-label class="font-16 font-semibold">Outline Button: </q-item-label>
            <q-item-section>
              <BaseBtn variant="outline" label="Hello"> </BaseBtn>
            </q-item-section>
            <!-- <base-tooltip :model-value="true" no-parent-event>Hello </base-tooltip> -->
          </q-item>
          <q-item class="row items-center gap-10">
            <q-item-label class="font-16 font-semibold">Icon Button: </q-item-label>
            <q-item-section>
              <BaseBtn icon="fa-solid fa-eye" variant="text" :round="true"> </BaseBtn>
            </q-item-section>
            <!-- <base-tooltip :model-value="true" no-parent-event>Hello </base-tooltip> -->
          </q-item>
          <q-item class="row items-center gap-10">
            <q-item-label class="font-16 font-semibold">Disable: </q-item-label>
            <q-item-section>
              Outline:
              <BaseBtn variant="outline" label="Hello" disable> </BaseBtn>
            </q-item-section>
            <q-item-section>
              Primary:
              <BaseBtn variant="solid" label="Hello" disable> </BaseBtn>
            </q-item-section>
            <!-- <base-tooltip :model-value="true" no-parent-event>Hello </base-tooltip> -->
          </q-item>
        </div>
      </base-card>
      <base-card extraClass="col" cardTitle="Input Component">
        <div class="row">
          <div class="col-6">
            <base-input
              label="Name"
              :mandatory="true"
              disable
              v-model="strInputTxt"
              :autogrow="true"
            ></base-input>
          </div>
          <div class="col-6">
            <base-input
              label="Search"
              placeholder="Search"
              :mandatory="false"
              v-model="strInputTxt2"
              :clearable="true"
              iconName="fa-solid fa-magnifying-glass"
            ></base-input>
          </div>
        </div>
      </base-card>
    </div>
    <div class="row gap-26">
      <base-card cardTitle="Checkbox Component" extraClass="col">
        <base-checkbox
          v-model:modelValue="blnCheckBox"
          label="I agree to the information provided above."
        ></base-checkbox>
        <base-checkbox v-model:modelValue="blnCheckBox2" :disable="true"></base-checkbox>
      </base-card>
      <base-card cardTitle="Dialog Component" extraClass="col">
        <div class="row gap-20">
          <base-btn label="Basic Dialog" @click="blnShowBasicDialog = true"></base-btn>
          <base-btn label="Persistent Dialog" @click="blnShowPersistentDialog = true"></base-btn>
          <base-btn label="Maximized Dialog" @click="blnShowMaximizedDialog = true"></base-btn>
        </div>
      </base-card>
    </div>
    <div class="row gap-26 mt-25">
      <base-card class="col" cardTitle="Select Component">
        <div class="row gap-25">
          <base-select
            v-model:select="intSelectedOption"
            :arr-options="arrOptions"
            str-label="Employment Stage"
            mandatory-field
            clear
          />
          <base-select
            v-model:select="arrSelectedOption"
            :arr-options="arrOptions"
            str-label="Employment Stage"
            mandatory-field
            multiple
            clear
          />
        </div>
      </base-card>
      <base-card class="col" cardTitle="Toggle Component">
        <div class="row gap-25">
          <base-toggle v-model="blnToggle" />
          <base-toggle v-model="blnToggle" disable />
        </div>
      </base-card>
    </div>
    <div class="row gap-26 my-26">
      <base-card class="col" cardTitle="Table Component ">
        <q-table
          :rows="rows"
          :columns="columns"
          class="table-class"
          hide-pagination
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        >
          <template v-slot:no-data="{ message }">
            <base-no-data :message="message"></base-no-data>
          </template>
        </q-table>
        <base-pagination
          v-model="pagination"
          total-pages="2"
          noteText="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Enim similique error est sunt voluptatum assumenda. "
        ></base-pagination>
      </base-card>
    </div>
    <base-dialog
      v-model:showDialog="blnShowBasicDialog"
      :persistent="false"
      title="Profile"
      width="20vw"
    ></base-dialog>
    <base-dialog
      v-model:showDialog="blnShowPersistentDialog"
      :persistent="true"
      title="Persistent Dialog"
      width="20vw"
    ></base-dialog>
    <base-dialog
      v-model:showDialog="blnShowMaximizedDialog"
      :persistent="false"
      :maximized="true"
      position="right"
      title="Maximized Dialog"
      width="20vw"
    >
    </base-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import BaseCard from 'src/components/General/BaseCard.vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'
import BaseCheckbox from 'src/components/General/BaseCheckbox.vue'
import BaseInput from 'src/components/General/BaseInput.vue'
import BaseDialog from 'src/components/General/BaseDialog.vue'
import BasePagination from 'src/components/General/BasePagination.vue'
import BaseNoData from 'src/components/General/BaseNoData.vue'
import BaseSelect from 'src/components/General/BaseSelect.vue'
import BaseToggle from 'src/components/General/BaseToggle.vue'

const userImage = ref('')
const strInputTxt = ref('')
const strInputTxt2 = ref('')
const blnCheckBox = ref(false)
const blnCheckBox2 = ref(true)
const blnToggle = ref(false)
const blnShowBasicDialog = ref(false)
const blnShowPersistentDialog = ref(false)
const blnShowMaximizedDialog = ref(false)
const arrOptions = ref([
  { key: 'AL', value: 'Alabama' },
  { key: 'AK', value: 'Alaska' },
  { key: 'AS', value: 'American Samoa' },
  { key: 'AZ', value: 'Arizona' },
  { key: 'AR', value: 'Arkansas' },
  { key: '', value: 'Western half of state' },
  { key: 'CA', value: 'California' },
  { key: 'CO', value: 'Colorado' },
  { key: 'CT', value: 'Connecticut' },
  { key: 'DE', value: 'Delaware' },
  { key: 'FM', value: 'Federated States of Micronesia' },
  { key: 'FL', value: 'Florida' },
  { key: 'GA', value: 'Georgia' },
  { key: 'GJ', value: 'GJ' },
  { key: 'GU', value: 'Guam' },
  { key: 'HI', value: 'Hawaii' },
  { key: 'ID', value: 'Idaho' },
  { key: 'IL', value: 'Illinois' },
  { key: 'IN', value: 'Indiana' },
  { key: 'IA', value: 'Iowa' },
  { key: 'KS', value: 'Kansas' },
  { key: 'KY', value: 'Kentucky' },
  { key: 'locat', value: 'location state' },
  { key: 'LA', value: 'Louisiana' },
  { key: 'ME', value: 'Maine' },
  { key: 'MH', value: 'Marshall Islands' },
  { key: 'MD', value: 'Maryland' },
  { key: 'MA', value: 'Massachusetts' },
  { key: 'MI', value: 'Michigan' },
  { key: 'MN', value: 'Minnesota' },
  { key: 'MS', value: 'Mississippi' },
  { key: 'MO', value: 'Missouri' },
  { key: 'MT', value: 'Montana' },
  { key: 'NE', value: 'Nebraska' },
  { key: 'NV', value: 'Nevada' },
  { key: 'NH', value: 'New Hampshire' },
  { key: 'NJ', value: 'New Jersey' },
  { key: 'NM', value: 'New Mexico' },
  { key: 'NY', value: 'New York' },
  { key: 'NC', value: 'North Carolina' },
  { key: 'ND', value: 'North Dakota' },
  { key: 'MP', value: 'Northern Mariana Islands' },
  { key: 'OH', value: 'Ohio' },
  { key: 'OK', value: 'Oklahoma' },
  { key: 'OR', value: 'Oregon' },
  { key: 'PW', value: 'Palau' },
  { key: 'PA', value: 'Pennsylvania' },
  { key: 'PR', value: 'Puerto Rico' },
  { key: 'RI', value: 'Rhode Island' },
  { key: 'SC', value: 'South Carolina' },
  { key: 'SD', value: 'South Dakota' },
  { key: 'state', value: 'state' },
  { key: 'TN', value: 'Tennessee' },
  { key: 'TX', value: 'Texas' },
  { key: 'UT', value: 'Utah' },
  { key: 'VT', value: 'Vermont' },
  { key: 'VI', value: 'Virgin Islands' },
  { key: 'VA', value: 'Virginia' },
  { key: 'WA', value: 'Washington' },
  { key: 'DC', value: 'Washington, DC' },
  { key: 'WV', value: 'West Virginia' },
  { key: 'WI', value: 'Wisconsin' },
  { key: 'WY', value: 'Wyoming' },
])
// const arrSelectedOptions = ref([])
const arrSelectedOption = ref([])
const intSelectedOption = ref(null)

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: 'id',
  descending: false,
})

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  { name: 'protein', label: 'Protein (g)', field: 'protein' },
  { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'iron',
    label: 'Iron (%)',
    field: 'iron',
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
]

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: '14%',
    iron: '1%',
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: '8%',
    iron: '1%',
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: '6%',
    iron: '7%',
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: '3%',
    iron: '8%',
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
    sodium: 327,
    calcium: '7%',
    iron: '16%',
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
    sodium: 50,
    calcium: '0%',
    iron: '0%',
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
    sodium: 38,
    calcium: '0%',
    iron: '2%',
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
    sodium: 562,
    calcium: '0%',
    iron: '45%',
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
    sodium: 326,
    calcium: '2%',
    iron: '22%',
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
    sodium: 54,
    calcium: '12%',
    iron: '6%',
  },
]

// fetch random user from API
async function fetchUser() {
  try {
    const response = await fetch('https://randomuser.me/api/')
    const data = await response.json()
    userImage.value = data.results[0].picture.large // get user image
  } catch (err) {
    console.error('Error fetching user:', err)
  }
}

// load one user by default
onMounted(fetchUser)
</script>
