<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../states/authStore'
import AuthLayout from '../layouts/AuthLayout.vue'
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email wajib diisi'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Kata sandi minimal 6 karakter'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const res = await authStore.login({
      email: form.email,
      password: form.password,
    })

    if (res?.status === 'success') {
      await showSuccessDialog(res.message || 'Login berhasil')
      router.push('/')
    } else {
      await showErrorDialog(res?.message || 'Login gagal')
    }
  } catch (err) {
    await showErrorDialog('Tidak dapat terhubung ke server. Coba lagi nanti.')
  }
}
</script>

<template>
  <AuthLayout>
    <div class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Masuk ke Akun</h2>
        <p class="mt-2 text-sm text-slate-600">
          Atau
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
            daftar akun baru jika belum punya
          </router-link>
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label for="login-email-input" class="block text-sm font-medium text-slate-700">Email</label>
          <input
            id="login-email-input"
            v-model="form.email"
            type="email"
            autocomplete="email"
            class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="nama@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
        </div>

        <div>
          <label for="login-password-input" class="block text-sm font-medium text-slate-700">Kata Sandi</label>
          <input
            id="login-password-input"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
        </div>

        <div>
          <button
            id="login-submit-button"
            type="submit"
            :disabled="authStore.isAuthLogin"
            class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {{ authStore.isAuthLogin ? 'Memproses...' : 'Masuk' }}
          </button>
        </div>
      </form>
    </div>
  </AuthLayout>
</template>