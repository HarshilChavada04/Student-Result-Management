<template>
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    :width="266"
    :mini-width="86"
    :breakpoint="500"
    @mouseenter="handleAutoCollapse('enter')"
    @mouseleave="handleAutoCollapse('leave')"
    class="app-bg-primary"
  >
    <q-scroll-area class="full-width full-height">
      <!-- Title -->
      <div class="logo-wrapper flex flex-center">
        <q-img
          src="../../assets/images/ahir_samaj_favicon.png"
          class="sidebar-logo"
          :class="{ 'sidebar-logo--mini': miniState }"
        />
      </div>
      <q-separator class="bg-separator mx-24 mb-24"></q-separator>
      <!-- Menu List -->
      <MenuList
        :menu-routes="menuRoutes"
        :mini-state="miniState"
        :current-route="currentRoute"
        @route-click="handleRouteClick"
      />
    </q-scroll-area>

    <!-- Mini toggle -->
    <q-btn
      dense
      round
      unelevated
      @click="handleMiniState"
      class="bg-white absolute"
      style="top: 100px; right: -16px"
    >
      <template v-slot:default>
        <q-icon
          :name="miniState ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'"
          class="font-18"
        ></q-icon>
      </template>
    </q-btn>
  </q-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import routes from 'src/router/routes'
import { useRoute, useRouter } from 'vue-router'
import MenuList from 'src/components/Layouts/MenuList.vue'
import { useAuthStore } from 'src/stores/auth'
import { getFilteredRoutes } from 'src/Helpers/routeHelpers'

const auth = useAuthStore()
const miniState = ref(auth.getSideBarPreference ?? false)
const currentRoute = useRoute()
const menuRoutes = getFilteredRoutes(routes[0].children)
// const menuRoutes = routes[0].children
//   .filter((item) => item.meta?.show_in_menu && item.meta?.is_active === 1)
//   .sort((a, b) => (a.meta?.seq_no || 0) - (b.meta?.seq_no || 0))
const drawer = ref(true)
const router = useRouter()
const menu = ref(false)

const strSelectedMenuOption = ref('Manual')

const handleAutoCollapse = (strEvent) => {
  if (strSelectedMenuOption.value === 'Auto-collapse') {
    if (strEvent === 'enter') {
      miniState.value = false // expand on hover
    } else if (strEvent === 'leave') {
      console.log(menu.value)

      if (!menu.value) {
        miniState.value = true
      }
    }
  }
}

watch(strSelectedMenuOption, (val) => {
  if (val === 'Auto-collapse') {
    miniState.value = true
  }
})

function handleRouteClick(route) {
  if (route.meta?.redirectTo) {
    window.open(route.meta.redirectTo, '_blank')
    return
  }
  router.push(route.path)
}

function handleMiniState() {
  miniState.value = !miniState.value
  auth.setSideBarPreference(miniState.value)
}
</script>

<style scoped>
.logo-wrapper {
  height: 120px;
  overflow: hidden;
}

.sidebar-logo {
  width: 110px;
  transition:
    width 0.25s ease,
    transform 0.25s ease,
    opacity 0.25s ease;
}

.sidebar-logo--mini {
  width: 80px;
  transform: scale(0.9);
}
</style>
