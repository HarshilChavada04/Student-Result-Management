const routes = [
  {
    path: '/',
    redirect: '/student-form',
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard/View.vue'),
        meta: {
          icon: 'dashboard', // Material Icon
          label: 'Dashboard',
          show_in_menu: false,
          seq_no: 1,
          is_active: 0,
        },
      },
      {
        path: '/students',
        name: 'students',
        component: () => import('pages/Students/View.vue'),
        meta: {
          icon: 'school', // Material Icon
          label: 'Students',
          show_in_menu: true,
          seq_no: 2,
          is_active: 1,
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/Auth/LoginPage.vue'),
    name: 'login',
    meta: { label: 'Login', isPublic: true },
  },
  {
    path: '/student-form',
    component: () => import('src/pages/StudentForm/View.vue'),
    name: 'student-form',
    meta: { label: 'Student Form', isPublic: true },
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { isPublic: true },
  },
]

export default routes
