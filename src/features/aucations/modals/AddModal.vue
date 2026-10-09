<script setup>
import { reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
  start_bid: '',
  bid_multiply: '',
  closed_at: '',
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  if (!form.title || !form.start_bid || !form.closed_at) return

  // Format ISO waktu yang valid untuk backend API
  const formattedDate = new Date(form.closed_at).toISOString()

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    start_bid: Number(form.start_bid),
    bid_multiply: Number(form.bid_multiply) || 1000,
    closed_at: formattedDate,
  })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-800">Tambah Lelang Baru</h3>
        <button type="button" class="text-slate-400 hover:text-slate-600" @click="handleClose">✕</button>
      </div>

      <form class="space-y-3" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700">Judul Barang</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Nama barang lelang"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Deskripsi</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Deskripsi barang lelang"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-slate-700">Tawaran Awal (Rp)</label>
            <input
              v-model="form.start_bid"
              type="number"
              min="0"
              required
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Contoh: 100000"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">Kelipatan Bid (Rp)</label>
            <input
              v-model="form.bid_multiply"
              type="number"
              min="1000"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Contoh: 10000"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Batas Waktu Ditutup</label>
          <input
            v-model="form.closed_at"
            type="datetime-local"
            required
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div class="mt-5 flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="handleClose"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {{ loading ? 'Menyimpan...' : 'Tambah Lelang' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>