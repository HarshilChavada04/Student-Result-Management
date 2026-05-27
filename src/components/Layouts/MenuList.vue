<template>
  <transition
    appear
    enter-active-class="animated slideInLeft slow"
    leave-active-class="animated slideOutRight"
  >
    <q-list>
      <template v-for="route in menuRoutes" :key="route.path">
        <ExpansionMenuItem
          v-if="route.children"
          :route="route"
          :mini-state="miniState"
          :current-route="currentRoute"
        />
        <MenuItem
          v-else
          :route="route"
          :mini-state="miniState"
          :current-route="currentRoute"
          @click="$emit('route-click', route)"
        />
      </template>
    </q-list>
  </transition>
</template>

<script setup>
import ExpansionMenuItem from 'src/components/Layouts/ExpansionMenuItem.vue'
import MenuItem from 'src/components/Layouts/MenuItem.vue'

defineProps({
  menuRoutes: Array,
  miniState: Boolean,
  currentRoute: Object,
})

defineEmits(['route-click'])
</script>
