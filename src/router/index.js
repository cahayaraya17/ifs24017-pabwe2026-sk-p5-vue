import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from '../helpers/apiHelper'

const routes = [
  {
    path: '/',
    component: () => import('../features/aucations/layouts/AucationLayout.vue'),
    children: [
      {
        path: '',
        name: 'aucations-home',
        component: () => import('../features/aucations/pages/HomePage.vue'),
      },
      {
        path: 'aucations/:id',
        name: 'aucations-detail',
        component: () => import('../features/aucations/pages/DetailPage.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../features/users/pages/UsersPage.vue'),
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../features/users/pages/ProfilePage.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../features/auth/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../features/auth/pages/RegisterPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../features/common/pages/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = getAccessToken()

  if (to.meta.guestOnly && token) {
    return next({ path: '/' })
  }

  next()
})

export default router