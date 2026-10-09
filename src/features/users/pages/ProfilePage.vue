<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useUsersStore } from '../states/usersStore'

const usersStore = useUsersStore()

const profileForm = reactive({ name: '', email: '' })
const passwordForm = reactive({ currentPassword: '', newPassword: '' })

const profileMessage = ref('')
const photoMessage = ref('')
const passwordMessage = ref('')

onMounted(async () => {
  await usersStore.fetchProfile()
  fillForm()
})

function fillForm() {
  profileForm.name = usersStore.profile?.name ?? ''
  profileForm.email = usersStore.profile?.email ?? ''
}

async function handleUpdateProfile() {
  profileMessage.value = ''
  const result = await usersStore.updateProfile({ ...profileForm })
  profileMessage.value =
    result.status === 'success' ? 'Profil berhasil diperbarui.' : result.message ?? 'Gagal memperbarui profil.'
}

async function handleUploadPhoto(event) {
  const file = event.target.files[0]
  if (!file) return

  photoMessage.value = ''
  const result = await usersStore.uploadPhoto(file)
  photoMessage.value =
    result.status === 'success' ? 'Foto berhasil diunggah.' : result.message ?? 'Gagal mengunggah foto.'
  event.target.value = ''
}

async function handleChangePassword() {
  passwordMessage.value = ''
  const result = await usersStore.changePassword({ ...passwordForm })

  if (result.status === 'success') {
    passwordMessage.value = 'Kata sandi berhasil diganti.'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
  } else {
    passwordMessage.value = result.message ?? 'Gagal mengganti kata sandi.'
  }
}
</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 p-6">
    <h1 class="text-2xl font-bold">Profil Saya</h1>

    <p v-if="usersStore.isProfileLoading" class="text-gray-500">Memuat data...</p>

    <template v-else>
      <!-- Foto -->
      <section class="space-y-2">
        <h2 class="text-lg font-semibold">Foto Profil</h2>
        <img
          v-if="usersStore.profile?.photo"
          :src="usersStore.profile.photo"
          alt="Foto profil"
          class="h-24 w-24 rounded-full object-cover"
        />
        <input id="profile-avatar-input" type="file" accept="image/*" aria-label="Unggah foto profil" :disabled="usersStore.isPhotoUploading" @change="handleUploadPhoto" />
        <p v-if="usersStore.isPhotoUploading" class="text-sm text-gray-500">Mengunggah...</p>
        <p v-if="photoMessage" class="text-sm">{{ photoMessage }}</p>
      </section>

      <!-- Data profil -->
      <section class="space-y-2">
        <h2 class="text-lg font-semibold">Data Profil</h2>
        <input
          v-model="profileForm.name"
          type="text"
          placeholder="Nama"
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          v-model="profileForm.email"
          type="email"
          placeholder="Email"
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
        <button
          class="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          :disabled="usersStore.isProfileUpdating"
          @click="handleUpdateProfile"
        >
          {{ usersStore.isProfileUpdating ? 'Menyimpan...' : 'Simpan Profil' }}
        </button>
        <p v-if="profileMessage" class="text-sm">{{ profileMessage }}</p>
      </section>

      <!-- Kata sandi -->
      <section class="space-y-2">
        <h2 class="text-lg font-semibold">Ganti Kata Sandi</h2>
        <input
          v-model="passwordForm.currentPassword"
          type="password"
          placeholder="Kata sandi saat ini"
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="Kata sandi baru"
          class="w-full rounded border border-gray-300 px-3 py-2"
        />
        <button
          class="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          :disabled="usersStore.isPasswordChanging"
          @click="handleChangePassword"
        >
          {{ usersStore.isPasswordChanging ? 'Menyimpan...' : 'Ganti Kata Sandi' }}
        </button>
        <p v-if="passwordMessage" class="text-sm">{{ passwordMessage }}</p>
      </section>
    </template>
  </div>
</template>