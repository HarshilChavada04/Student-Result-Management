import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'
// import { showError } from './notification'?

const PROJECT_BASE_URL = import.meta.env.VITE_PROJECT_BASE_URL

const auth = useAuthStore()

const api = axios.create({
  baseURL: PROJECT_BASE_URL,
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = auth.getToken
    console.log(token)

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
    // Your existing error handling code
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
