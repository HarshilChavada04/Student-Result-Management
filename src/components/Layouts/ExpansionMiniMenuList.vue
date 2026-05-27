<template>
  <q-menu fit anchor="top right" self="top left" class="mt-10 ml-10 shadow-29 r-14 menu-bg py-20">
    <div class="column">
      <router-link
        v-for="(child, index) in route"
        :key="index"
        :to="{ name: child.name }"
        class="menu-child font-14 px-30 py-10 cursor-pointer"
        style="text-decoration: none"
        :class="{
          'text-primary font-medium': child.name === currentRoute.name,
        }"
      >
        {{ child.meta.label }}
      </router-link>
    </div>
  </q-menu>
</template>

<script setup>
defineProps({
  route: Object,
  currentRoute: Object,
})
</script>
<style lang="scss">
.menu-bg {
  background-color: $app-bg-menu;
  max-width: 230px !important;
}
.menu-child {
  color: #000000;
}
.menu-child:hover {
  background-color: $app-tab-hover !important;
}
</style>
