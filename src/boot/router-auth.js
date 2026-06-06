import { useAuthStore } from 'src/stores/auth'

export default ({ router }) => {
  const defaultTitle = process.env.PROJECT_TITLE

  router.beforeEach((to, from, next) => {
    const auth = useAuthStore()
    const isAuthenticated = auth.isAuthenticated
    document.title =
      to.meta?.label && to.meta?.label !== 'Home'
        ? `${to.meta.label} | ${defaultTitle}`
        : defaultTitle

    if (isAuthenticated) {
      if (to.path === '/' || to.path === '/login' || to.name === 'login') {
        next({ path: '/students' })
        return
      }
      if (to?.meta?.is_active === 0) {
        next({ path: '/not-found' })
        return
      }
      next()
    } else {
      // Redirect unauthenticated users to login if trying to access a protected route
      if (to.matched.some((record) => !record.meta.isPublic)) {
        next({ name: 'login', query: { redirect: to.fullPath } })
      } else {
        next()
      }
    }
  })
}
