import { useRouter } from 'vue-router'

export const useNavigation = () => {
  const router = useRouter()

  const redirectTo = (routeName, params = {}, query = {}) => {
    router.push({
      name: routeName,
      params,
      query,
    })
  }

  const redirectToPath = (path) => {
    router.push(path)
  }

  return {
    redirectTo,
    redirectToPath,
  }
}
