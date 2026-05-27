<template>
  <div class="row gap-14 items-center">
    <AccountManagerAvatar :imageUrl="imageUrl" />
    <div class="col column font-regular">
      <div class="font-14 text-left">{{ fullName }}</div>
      <div class="row items-baseline">
        <span class="font-12 text-captions text-ellipsis">
          {{ userEmail }}
        </span>
        <q-icon
          v-show="showCopyEmailIcon"
          name="fa-solid fa-copy"
          class="font-10 cursor-pointer ml-2 text-info"
          @click="copyEmail"
        >
          <base-tooltip>{{ userEmail }}</base-tooltip>
        </q-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { copyToClipboard } from 'quasar'
import AccountManagerAvatar from 'src/components/Layouts/AccountManagerAvatar.vue'
import BaseTooltip from 'src/components/General/BaseTooltip.vue'
import { showSuccess } from 'src/boot/notification'

const props = defineProps({
  imageUrl: {
    type: String,
    default: '',
  },
  fullName: {
    type: String,
    default: '',
  },
  userEmail: {
    type: String,
    default: '',
  },
  showCopyEmailIcon: {
    type: Boolean,
    default: false,
  },
})
function copyEmail() {
  copyToClipboard(props.userEmail)
    .then(() => {
      showSuccess('Email Copied')
    })
    .catch(() => {
      showSuccess('Email Copied')
    })
}
</script>
<style lang="scss" scoped>
.text-ellipsis {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 140px;
}
</style>
