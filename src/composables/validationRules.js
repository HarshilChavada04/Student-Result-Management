import { computed } from 'vue'

export function useValidation(props) {
  const validationRules = computed(() => {
    const rules = []

    if (props.mandatory) {
      const label = props.label.toLowerCase()
      rules.push((val) => {
        // For strings (q-input, q-textarea, etc.)
        if (typeof val === 'string') {
          return (!!val && val.trim().length > 0) || `Please enter ${label}`
        }

        // For arrays (q-select multiple)
        if (Array.isArray(val)) {
          return val.length > 0 || `Please select ${label}`
        }

        // For single values (q-select single, numbers, objects, etc.)
        return !!val || `Please select ${label}`
      })
    }

    return rules
  })

  return { validationRules }
}
