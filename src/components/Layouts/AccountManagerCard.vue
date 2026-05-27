<template>
  <base-card
    extraClass="mx-26 column"
    padding="pa-14"
    radius="r-14"
    shadow="shadow-none"
    cardTitle="Your Account Manager"
    cardTitleFontSize="font-14"
  >
    <base-user-info
      :imageUrl="imageUrl"
      :fullName="fullName"
      :userEmail="userEmail"
      showCopyEmailIcon
    ></base-user-info>
  </base-card>
</template>
<script setup>
import BaseCard from 'src/components/General/BaseCard.vue'
import BaseUserInfo from 'src/components/General/BaseUserInfo.vue'

defineProps({
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
})
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
