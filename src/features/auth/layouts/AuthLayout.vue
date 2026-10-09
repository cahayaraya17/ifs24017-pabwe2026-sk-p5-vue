<script setup>
import { Gavel } from 'lucide-vue-next'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="grid min-h-screen lg:grid-cols-2">
    <!-- Banner visual (disembunyikan di layar kecil) -->
    <aside
      class="hidden flex-col justify-between bg-linear-to-br from-indigo-600 via-indigo-700 to-slate-900 p-12 text-white lg:flex"
    >
      <div class="flex items-center gap-2 text-xl font-bold">
        <Gavel class="size-7" />
        Delcom Auction
      </div>

      <div>
        <h2 class="text-4xl leading-tight font-extrabold">
          Temukan barang impianmu, tawar dengan percaya diri.
        </h2>
        <p class="mt-4 max-w-md text-indigo-100">
          Ikuti lelang, ajukan penawaran terbaikmu, dan pantau setiap perkembangan
          secara langsung.
        </p>
      </div>

      <p class="text-sm text-indigo-200">© 2026 Delcom Auction</p>
    </aside>

    <!-- Kontainer formulir -->
    <main class="flex items-center justify-center bg-slate-50 p-6">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div class="mb-6 flex items-center gap-2 text-lg font-bold text-indigo-600 lg:hidden">
          <Gavel class="size-6" />
          Delcom Auction
        </div>

        <h1 class="text-2xl font-bold text-slate-900" aria-label="Profil Pengguna">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-500">{{ subtitle }}</p>

        <div class="mt-6">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>