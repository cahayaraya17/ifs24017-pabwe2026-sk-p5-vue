import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '../api/authApi'
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from '../../../helpers/apiHelper'

export const useAuthStore = defineStore('auth', () => {
  // Data sesi
  const token = ref(getAccessToken())
  const user = ref(null)

  // Status proses (true selama permintaan ke server berlangsung)
  const isAuthLogin = ref(false)
  const isAuthRegister = ref(false)
  const isAuthLogout = ref(false)

  // Status validasi: pesan kesalahan dari server (kosong jika tidak ada)
  const validationErrors = ref({})

  const isAuthenticated = computed(() => Boolean(token.value))

  async function login(payload) {
    isAuthLogin.value = true
    validationErrors.value = {}

    try {
      const result = await authApi.login(payload)

      if (result.status === 'success') {
        token.value = result.data.token
        user.value = result.data.user
        putAccessToken(result.data.token)
      } else {
        validationErrors.value = result.data ?? {}
      }

      return result
    } finally {
      isAuthLogin.value = false
    }
  }

  async function register(payload) {
    isAuthRegister.value = true
    validationErrors.value = {}

    try {
      const result = await authApi.register(payload)

      if (result.status !== 'success') {
        validationErrors.value = result.data ?? {}
      }

      return result
    } finally {
      isAuthRegister.value = false
    }
  }

  async function logout() {
    isAuthLogout.value = true

    try {
      return await authApi.logout()
    } finally {
      // Sesi lokal selalu dibersihkan, apa pun hasil dari server
      removeAccessToken()
      token.value = null
      user.value = null
      isAuthLogout.value = false
    }
  }

  return {
    token,
    user,
    isAuthLogin,
    isAuthRegister,
    isAuthLogout,
    validationErrors,
    isAuthenticated,
    login,
    register,
    logout,
  }
})