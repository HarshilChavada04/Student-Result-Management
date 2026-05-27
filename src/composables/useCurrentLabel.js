import {computed} from 'vue'
import {useRoute} from 'vue-router'

export function useCurrentLabel(){
    const route = useRoute()

    const currentLabel = computed(() => {
        const matched = route.matched[route.matched.length - 1]
        return matched?.meta.label || ''
    })

    return {
        currentLabel
    }
}