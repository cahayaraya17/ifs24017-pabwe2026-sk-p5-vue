import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as userApi from '../api/userApi'

export const useUsersStore = defineStore('users', () => {
  // Data
  const users = ref([])
  const user = ref(null)
  const profile = ref(null)

  // Status proses (true selama permintaan ke server berlangsung)
  const isUsersLoading = ref(false)
  const isProfileLoading = ref(false)
  const isProfileUpdating = ref(false)
  const isPhotoUploading = ref(false)
  const isPasswordChanging = ref(false)

  // Pesan kesalahan validasi dari server (kosong jika tidak ada)
  const validationErrors = ref({})

  async function fetchUsers(params = {}) {
    isUsersLoading.value = true

    try {
      const result = await userApi.getUsers(params)

      if (result.status === 'success') {
        users.value = result.data?.users ?? result.data ?? []
      }

      return result
    } finally {
      isUsersLoading.value = false
    }
  }

  async function fetchProfile() {
    isProfileLoading.value = true

    try {
      const result = await userApi.getMe()

      if (result.status === 'success') {
        profile.value = result.data?.user ?? result.data
      }

      return result
    } finally {
      isProfileLoading.value = false
    }
  }

  async function updateProfile(payload) {
    isProfileUpdating.value = true
    validationErrors.value = {}

    try {
      const result = await userApi.updateMe(payload)

      if (result.status === 'success') {
        await fetchProfile()
      } else {
        validationErrors.value = result.data ?? {}
      }

      return result
    } finally {
      isProfileUpdating.value = false
    }
  }

  async function uploadPhoto(file) {
    isPhotoUploading.value = true
    validationErrors.value = {}

    try {
      const result = await userApi.uploadMyPhoto(file)

      if (result.status === 'success') {
        await fetchProfile()
      } else {
        validationErrors.value = result.data ?? {}
      }

      return result
    } finally {
      isPhotoUploading.value = false
    }
  }

  async function changePassword(payload) {
    isPasswordChanging.value = true
    validationErrors.value = {}

    try {
      const result = await userApi.changeMyPassword(payload)

      if (result.status !== 'success') {
        validationErrors.value = result.data ?? {}
      }

      return result
    } finally {
      isPasswordChanging.value = false
    }
  }

  return {
    users,
    user,
    profile,
    isUsersLoading,
    isProfileLoading,
    isProfileUpdating,
    isPhotoUploading,
    isPasswordChanging,
    validationErrors,
    fetchUsers,
    fetchProfile,
    updateProfile,
    uploadPhoto,
    changePassword,
  }
})