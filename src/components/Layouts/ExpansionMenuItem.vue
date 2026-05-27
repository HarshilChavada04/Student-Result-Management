<template>
  <q-expansion-item
    :label="route.meta.label"
    group="menu"
    :default-opened="currentRoute.path.startsWith(route.path)"
    :class="[
      {
        'has-active-style menu-item active-class-style':
          miniState && currentRoute.path.startsWith(route.path),
      },
    ]"
  >
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon
          :name="route.meta.icon"
          style="padding: 0 !important"
          class="font-18"
          :class="
            currentRoute.path.startsWith(route.path) && miniState ? 'text-primary' : 'text-black'
          "
        />
      </q-item-section>
      <q-item-section class="font-14">{{ route.meta.label }}</q-item-section>
      <ExpansionMiniMenuList v-if="miniState" :route="routeChildren" :currentRoute="currentRoute" />
      <base-tooltip
        v-if="miniState"
        transition-show="jump-right"
        transition-hide="jump-left"
        anchor="center right"
        self="center left"
        bgColor="bg-primary"
        color="text-white"
      >
        {{ route.meta.label }}
      </base-tooltip>
    </template>
    <div class="children-list">
      <q-item
        v-for="(child, index) in routeChildren"
        :key="index"
        class="row items-center child-item menu-item right-align"
        :active="currentRoute.name === child.name"
        active-class="font-medium has-active-style"
      >
        <div class="w-24" style="border-bottom: 2px solid #145da04d"></div>
        <q-item-section>
          <router-link :to="{ name: child.name }" class="child-link font-14">
            {{ child.meta.label }}
          </router-link>
        </q-item-section>
      </q-item>
    </div>
  </q-expansion-item>
</template>

<script setup>
import { computed } from 'vue'
import ExpansionMiniMenuList from 'src/components/Layouts/ExpansionMiniMenuList.vue'
import BaseTooltip from 'src/components/General/BaseTooltip.vue'
import { getFilteredRoutes } from 'src/Helpers/routeHelpers'

const props = defineProps({
  route: Object,
  miniState: Boolean,
  currentRoute: Object,
})

const routeChildren = computed(() => getFilteredRoutes(props.route.children))
</script>
<style lang="scss" scoped>
.menu-item {
  position: relative;
  overflow: visible;
}

/* default (left align) */
:deep(.menu-item)::before,
:deep(.menu-item)::after {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scaleX(0);
  transform-origin: left center;
  border-radius: 0 4px 4px 0;
  background-color: var(--q-primary);
  opacity: 0;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.45s ease-out;
  pointer-events: none;
}

:deep(.menu-item)::before {
  left: 1px;
  width: 4px;
  height: 40px;
  z-index: 2;
}
:deep(.menu-item)::after {
  left: 3px;
  width: 4px;
  height: 38px;
  filter: blur(5px);
  z-index: 1;
}

/* active state */
:deep(.menu-item.has-active-style)::before,
:deep(.menu-item.has-active-style)::after {
  transform: translateY(-50%) scaleX(1.2);
  opacity: 1;
}

:deep(.menu-item.right-align)::before,
:deep(.menu-item.right-align)::after {
  left: 254px;
  border-radius: 4px 0 0 4px;
  transform-origin: right center;
}

:deep(.q-item) {
  padding: 0 !important;
  margin-bottom: 12px;
  margin-right: 18px;
  border-radius: 0 50px 50px 0;
}
:deep(.child-link) {
  display: block;
  border-radius: 14px;
  padding: 10px 12px;
  color: #000000;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #ffffff;
  }

  &.router-link-exact-active {
    background: #ffffff;
    font-weight: 500 !important;
    color: var(--q-primary);
  }
}

:deep(.q-expansion-item__toggle-icon) {
  font-size: 14px !important;
  color: #000000 !important;
  margin-right: 10px;
  font-weight: 600;
}

.children-list {
  position: relative;
  border-left: 1px solid $primary-30;
  margin-left: 35px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1px solid var(--q-primary);
    background-color: $app-bg-primary;
    left: -4px;
  }
  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
}
:deep(.active-class-style .q-expansion-item__container .q-item--clickable) {
  background-color: $app-active-tab !important;
}
</style>
