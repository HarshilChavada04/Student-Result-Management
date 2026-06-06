<template>
  <div class="row justify-between items-center sticky-header bg-white px-40 py-44">
    <div class="font-24 font-medium" style="letter-spacing: 0.12px">
      {{ currentLabel === 'Home' ? 'Hello Harshil Chavada!' : currentLabel }}
    </div>
    <div class="row gap-20">
      <base-btn variant="flat" round @click="logout">
        <q-icon name="logout" size="xs" />
        <base-tooltip>Logout</base-tooltip>
      </base-btn>
    </div>
  </div>
</template>
<script setup>
import { api } from 'src/boot/axios'
import { showSuccess } from 'src/boot/notification'
import BaseBtn from 'src/components/General/BaseBtn.vue'
import BaseTooltip from 'src/components/General/BaseTooltip.vue'
import { useCurrentLabel } from 'src/composables/useCurrentLabel'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const { currentLabel } = useCurrentLabel()
const auth = useAuthStore()
const router = useRouter()

function logout() {
  api.post('/admin/logout').then((response) => {
    if (response && response.status === 200) {
      showSuccess(response?.data?.message)
      auth.logout()
      router.push('/login')
    }
  })
}
</script>

<style lang="scss" scoped>
.sticky-header {
  position: sticky;
  z-index: 1 !important;
  top: 0;
}
</style>
