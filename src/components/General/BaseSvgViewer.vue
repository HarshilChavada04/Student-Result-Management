<template>
  <component v-if="requiredSvg" :is="requiredSvg" :width="width" :height="height" />
</template>
<script setup>
import { defineAsyncComponent, computed } from 'vue'
const NewsPaperSvg = defineAsyncComponent(() => import('src/components/Svgs/NewsPaperSvg.vue'))
const CommentSmileSvg = defineAsyncComponent(
  () => import('src/components/Svgs/CommentSmileSvg.vue'),
)
const HeadSetSvg = defineAsyncComponent(() => import('src/components/Svgs/HeadSetSvg.vue'))
const PenToSquareSvg = defineAsyncComponent(() => import('src/components/Svgs/PenToSquareSvg.vue'))
const PrintFullSvg = defineAsyncComponent(() => import('src/components/Svgs/PrintFullSvg.vue'))
const UserProfileSvg = defineAsyncComponent(() => import('src/components/Svgs/UserProfileSvg.vue'))

const props = defineProps({
  svgIcon: {
    type: [Object, Function],
  },
  width: {
    type: String,
    default: '20',
  },
  height: {
    type: String,
    default: '20',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  name: {
    type: String,
    default: '',
  },
})

const componentsMap = {
  NewsPaperSvg,
  CommentSmileSvg,
  HeadSetSvg,
  PenToSquareSvg,
  PrintFullSvg,
  UserProfileSvg,
}

const requiredSvg = computed(() => (props.name ? componentsMap[props.name] : ''))
</script>
