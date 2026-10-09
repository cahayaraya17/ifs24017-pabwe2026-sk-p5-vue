<script setup>
import { useRouter } from 'vue-router'
import { removeAccessToken } from '../../../helpers/apiHelper'

const router = useRouter()

function handleLogout() {
  removeAccessToken()
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand-link">Delcom Auction</router-link>
    </div>
    <div class="navbar-actions">
      <router-link to="/profile" class="nav-item">Profil</router-link>
      <button @click="handleLogout" class="btn-logout">Keluar</button>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: #1e293b;
  color: #fff;
}
.brand-link {
  font-weight: bold;
  font-size: 1.25rem;
  color: #38bdf8;
  text-decoration: none;
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-item {
  color: #cbd5e1;
  text-decoration: none;
}
.nav-item:hover {
  color: #fff;
}
.btn-logout {
  background-color: #ef4444;
  color: #fff;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-logout:hover {
  background-color: #dc2626;
}
</style>