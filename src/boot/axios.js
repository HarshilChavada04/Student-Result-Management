import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { showError } from './notification'

const PROJECT_BASE_URL = import.meta.env.VITE_PROJECT_BASE_URL
console.log(PROJECT_BASE_URL)

const api = axios.create({ baseURL: PROJECT_BASE_URL })

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response, // pass through successful responses

  (error) => {
    const status = error.response?.status
    const errors = error.response?.data?.errors // array of { message } or strings

    // Helper: show one notification per error message in the array,
    // falling back to a generic message if the array is absent/empty
    const showErrors = (fallbackMessage) => {
      if (Array.isArray(errors) && errors.length > 0) {
        errors.forEach((err) => {
          // support both { message: '...' } objects and plain strings
          showError(err?.message ?? err)
        })
      } else {
        showError(fallbackMessage)
      }
    }

    switch (status) {
      case 400:
        showErrors('Bad request. Please check the submitted data.')
        break

      case 401:
        showErrors('Unauthorized. Please log in and try again.')
        // optional: redirect to login
        // Router.push('/login')
        break

      case 403:
        showErrors('Forbidden. You do not have permission to perform this action.')
        break

      case 404:
        showErrors('The requested resource was not found.')
        break

      case 409:
        showErrors('Conflict. The resource already exists or is in a conflicting state.')
        break

      case 422:
        showErrors('Validation failed. Please review your input.')
        break

      case 429:
        showErrors('Too many requests. Please slow down and try again later.')
        break

      case 500:
        showErrors('Internal server error. Please try again later.')
        break

      case 502:
        showErrors('Bad gateway. The server received an invalid response.')
        break

      case 503:
        showErrors('Service unavailable. The server is temporarily down.')
        break

      default:
        if (status) {
          showErrors(`Unexpected error (${status}). Please try again.`)
        } else {
          // Network error / no response (e.g. server unreachable, CORS, timeout)
          showError('Network error. Please check your internet connection.')
        }
    }

    return Promise.reject(error) // still propagate so callers can handle if needed
  },
)

// ─── Boot ────────────────────────────────────────────────────────────────────
export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
