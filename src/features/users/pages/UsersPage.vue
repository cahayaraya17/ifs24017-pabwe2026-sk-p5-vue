<script setup>
import { computed, onMounted, ref } from 'vue'
import { useUsersStore } from '../states/usersStore'

const usersStore = useUsersStore()
const keyword = ref('')

onMounted(() => {
  usersStore.fetchUsers()
})

const filteredUsers = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return usersStore.users

  return usersStore.users.filter((u) => {
    const name = (u.name ?? '').toLowerCase()
    const email = (u.email ?? '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
})

function getInitial(u) {
  return (u.name ?? '?').charAt(0).toUpperCase()
}
</script>

<template>
  <div class="mx-auto max-w-3xl p-6">
    <h1 class="mb-4 text-2xl font-bold">Daftar Pengguna</h1>

    <input
      v-model="keyword"
      type="text"
      placeholder="Cari nama atau email..."
      class="mb-4 w-full rounded border border-gray-300 px-3 py-2"
    />

    <p v-if="usersStore.isUsersLoading" class="text-gray-500">Memuat data...</p>

    <p v-else-if="filteredUsers.length === 0" class="text-gray-500">
      Tidak ada pengguna yang ditemukan.
    </p>

    <ul v-else class="divide-y rounded border border-gray-200">
      <li
        v-for="u in filteredUsers"
        :key="u.id"
        class="flex items-center gap-3 p-3"
      >
        <img
          v-if="u.photo"
          :src="u.photo"
          :alt="u.name"
          class="h-10 w-10 rounded-full object-cover"
        />
        <div
          v-else
          class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-semibold"
        >
          {{ getInitial(u) }}
        </div>

        <div>
          <p class="font-medium">{{ u.name }}</p>
          <p class="text-sm text-gray-500">{{ u.email }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
