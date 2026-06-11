import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
import { showError } from './notification'

const PROJECT_BASE_URL = import.meta.env.VITE_PROJECT_BASE_URL

const api = axios.create({
  baseURL: PROJECT_BASE_URL,
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.getToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore()

    const status = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    switch (status) {
      case 401:
        showError(message)

        // Logout user
        auth.logout()

        // Optional: Redirect to login page
        // window.location.href = '/login'

        break

      case 403:
      case 409:
      case 400:
      case 404:
      case 422:
      case 500:
        showError(message)
        break

      default:
        showError(message)
        break
    }

    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
