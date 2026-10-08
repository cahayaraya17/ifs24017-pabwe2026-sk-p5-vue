import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from '../helpers/apiHelper'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../features/auth/pages/LoginPage.vue'
import RegisterPage from '../features/auth/pages/RegisterPage.vue'
import UsersPage from '../features/users/pages/UsersPage.vue'
import ProfilePage from '../features/users/pages/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterPage, meta: { guestOnly: true } },
    { path: '/users', name: 'users', component: UsersPage, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfilePage, meta: { requiresAuth: true } },
  ],
})

router.beforeEach((to) => {
  const isLoggedIn = Boolean(getAccessToken())

  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login'
  }

  if (to.meta.guestOnly && isLoggedIn) {
    return '/'
  }
})

export default router