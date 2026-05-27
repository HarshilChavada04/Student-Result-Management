<template>
  <div>
    <q-layout view="hHh lpR fFf" style="min-height: 0 !important">
      <!-- @mouseenter="miniState = false"
          @mouseleave="miniState = true" -->
      <SideDrawer />

      <q-page-container>
        <div
          style="clip-path: inset(0 0 0 0 round 40px 0 0 40px); height: 100vh"
          class="bg-white overflow-auto smooth-scroll"
        >
          <transition
            appear
            enter-active-class="animated slideInDown slow"
            leave-active-class="animated slideOutRight"
          >
            <main-header></main-header>
          </transition>

          <router-view v-slot="{ Component }">
            <transition
              appear
              enter-active-class="animated slideInLeft slow"
              leave-active-class="animated slideOutRight"
              mode="out-in"
            >
              <component :is="Component" class="py-2 px-40" />
            </transition>
          </router-view>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import SideDrawer from 'src/components/Layouts/SideDrawer.vue'
import MainHeader from 'src/components/Layouts/MainHeader.vue'
</script>

<style lang="scss" scoped>
:deep(.q-item__section--avatar) {
  min-width: var(--font-45);
  margin-left: 26px;
}
:deep(.q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item) {
  justify-content: left;
  align-items: left;
}
:deep(.q-item) {
  text-align: left;
  justify-content: left;
}
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

:deep(.q-expansion-item__toggle-icon) {
  font-size: var(--font-14) !important;
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
    border: 1px solid $primary;
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
