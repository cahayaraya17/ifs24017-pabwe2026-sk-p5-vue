<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../features/auth/states/authStore'
import { showConfirmDialog } from '../helpers/toolsHelper'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  const ya = await showConfirmDialog('Kamu akan keluar dari akun ini.', 'Keluar?')
  if (!ya) return

  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="mx-auto max-w-xl p-6">
    <h1 class="text-3xl font-bold text-indigo-600">Beranda Delcom Auction</h1>
    <p class="mt-2 text-slate-600">Kamu sudah login. Halaman ini sementara.</p>

    <button
      class="mt-6 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      :disabled="authStore.isAuthLogout"
      @click="handleLogout"
    >
      {{ authStore.isAuthLogout ? 'Memproses...' : 'Keluar' }}
    </button>
  </div>
</template>