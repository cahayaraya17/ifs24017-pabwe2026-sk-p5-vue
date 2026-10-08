<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '../layouts/AuthLayout.vue'
import { useAuthStore } from '../states/authStore'
import { useInput } from '../../../hooks/useInput'
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper'

const router = useRouter()
const authStore = useAuthStore()

const { value: email } = useInput('')
const { value: password } = useInput('')
const errors = ref({})

function validate() {
  const result = {}

  if (!email.value.trim()) {
    result.email = 'Email wajib diisi'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) {
    result.email = 'Format email tidak valid'
  }

  if (!password.value) {
    result.password = 'Kata sandi wajib diisi'
  } else if (password.value.length < 6) {
    result.password = 'Kata sandi minimal 6 karakter'
  }

  errors.value = result
  return Object.keys(result).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const result = await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })

    if (result.status !== 'success') {
      await showErrorDialog(result.message)
      return
    }

    await showSuccessDialog(result.message)
    router.push('/')
  } catch {
    await showErrorDialog('Tidak dapat terhubung ke server. Coba lagi nanti.')
  }
}
</script>

<template>
  <AuthLayout title="Masuk" subtitle="Silakan masuk untuk mulai mengikuti lelang.">
    <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="nama@email.com"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
      </div>

      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
          Kata sandi
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Minimal 6 karakter"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          :class="{ 'border-red-500': errors.password }"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
      </div>

      <button
        type="submit"
        :disabled="authStore.isAuthLogin"
        class="w-full rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ authStore.isAuthLogin ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Belum punya akun?
      <RouterLink to="/register" class="font-semibold text-indigo-600 hover:underline">
        Daftar sekarang
      </RouterLink>
    </p>
  </AuthLayout>
</template>