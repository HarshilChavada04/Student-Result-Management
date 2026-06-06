<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="full-page pa-20">
        <base-card class="row full-height" style="padding: 0 !important">
          <div v-if="!$q.screen.lt.md" class="col-8 full-height">
            <q-carousel
              v-model="slide"
              swipeable
              animated
              navigation
              autoplay
              infinite
              class="full-height r-10"
            >
              <q-carousel-slide
                v-for="(data, index) in arrCarouselData"
                :key="index"
                :name="data.name"
                class="pa-0 overflow-hidden"
              >
                <img :src="data.src" class="full-width full-height" />
              </q-carousel-slide>
            </q-carousel>
          </div>

          <div class="column col justify-center items-center full-height">
            <div class="pa-50">
              <div class="text-center">
                <div>
                  <q-img :src="logoImage" style="width: 50%" />
                </div>

                <div class="column gap-10">
                  <span class="font-semibold font-26">Welcome Back!</span>
                  <span class="font-medium font-18"> Please login to your admin account </span>
                </div>
              </div>

              <q-form class="row justify-center gap-30 q-mt-lg">
                <base-input
                  v-model="strAdminEmailId"
                  class="col-12"
                  label="Admin Email ID"
                  label-class="font-medium"
                  placeholder="Enter admin email id"
                  icon-name="person"
                />

                <base-input
                  v-model="strPassword"
                  class="col-12"
                  label="Password"
                  label-class="font-medium"
                  placeholder="Enter password"
                  icon-name="lock"
                />

                <base-btn
                  class="col-12 font-18 h-50"
                  label="Login"
                  @click="handleLogin"
                  :loading="blnLoading"
                />
              </q-form>
            </div>
          </div>
        </base-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import BaseCard from 'src/components/General/BaseCard.vue'
import BaseInput from 'src/components/General/BaseInput.vue'
import BaseBtn from 'src/components/General/BaseBtn.vue'
import carouselImage1 from 'src/assets/images/carousel-image1.png'
import carouselImage2 from 'src/assets/images/carousel-image2.png'
import logoImage from 'src/assets/images/ahir_samaj_logo.png'
import { api } from 'src/boot/axios'
import { showSuccess } from 'src/boot/notification'
import { useNavigation } from 'src/composables/useNavigation'
import { useAuthStore } from 'src/stores/auth'

const slide = ref('img-1')
const $q = useQuasar()
const auth = useAuthStore()

const arrCarouselData = [
  {
    name: 'img-1',
    src: carouselImage1,
  },
  {
    name: 'img-2',
    src: carouselImage2,
  },
]

const { redirectTo } = useNavigation()

const strAdminEmailId = ref('')
const strPassword = ref('')
const blnLoading = ref(false)

const handleLogin = () => {
  const objBody = {
    email: strAdminEmailId.value,
    password: strPassword.value,
  }
  blnLoading.value = true
  api
    .post('/admin/login', objBody)
    .then((response) => {
      if (response && response.status === 200) {
        auth.setToken(response.data.token)
        redirectTo('students')
        showSuccess('Login Successfully')
      }
    })
    .finally(() => {
      blnLoading.value = false
    })
}
</script>

<style scoped>
.full-page {
  height: 100vh;
}
</style>
