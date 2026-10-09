<script setup>
import { ref } from 'vue'

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
const fileInput = ref(null)
const selectedFile = ref(null)

function handleClose() {
  selectedFile.value = null
  emit('close')
}

function handleFileChange(e) {
  const files = e.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0]
  }
}

function handleSubmit() {
  if (!selectedFile.value) return
  emit('submit', selectedFile.value)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-800">Ubah Sampul Barang</h3>
        <button type="button" class="text-slate-400 hover:text-slate-600" @click="handleClose">✕</button>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700">Pilih Berkas Gambar</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            required
            class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            @change="handleFileChange"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="handleClose"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading || !selectedFile"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {{ loading ? 'Mengunggah...' : 'Unggah Sampul' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>