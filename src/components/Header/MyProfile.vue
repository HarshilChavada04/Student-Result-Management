<template>
  <q-menu class="shadow-dark-29 pt-20 pb-10 mt-15 r-8">
    <base-user-info
      imageUrl="https://randomuser.me/api/portraits/women/19.jpg"
      fullName="Glysie Love Tan"
      userEmail="gylsiet@meditab.com"
      class="px-14"
    ></base-user-info>
    <q-separator class="bg-separator mt-20 mb-16 mx-14"></q-separator>

    <div class="column">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="row items-baseline gap-10 cursor-pointer px-14 py-4 profile-menu-item r-5"
        @click="item.action && item.action()"
      >
        <q-icon :name="item.icon" class="font-14"></q-icon>
        <span class="font-14" style="letter-spacing: 0.07px">{{ item.label }}</span>
      </div>
    </div>
  </q-menu>
</template>
<script setup>
import BaseUserInfo from 'src/components/General/BaseUserInfo.vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const menuItems = [
  { icon: 'fa-light fa-circle-user', label: 'View Profile' },
  { icon: 'fa-light fa-arrow-right-from-bracket', label: 'Logout', action: logout },
]

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
<style lang="scss">
.profile-menu-item:hover {
  background-color: var(--q-secondary);
  color: var(--q-primary);
}
</style>
