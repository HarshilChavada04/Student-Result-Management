const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard/View.vue'),
        meta: {
          icon: 'fa-solid fa-table-columns',
          label: 'Dashboard',
          show_in_menu: true,
          seq_no: 1,
          is_active: 1,
        },
      },
      {
        path: '/students',
        name: 'students',
        component: () => import('pages/Students/View.vue'),
        meta: {
          icon: 'fa-solid fa-graduation-cap',
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { isPublic: true },
  },
]

export default routes
