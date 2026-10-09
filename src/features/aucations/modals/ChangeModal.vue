<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  title: '',
  description: '',
})

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.title = val.title || ''
      form.description = val.description || ''
    }
  },
  { immediate: true }
)

function handleClose() {
  emit('close')
}

function handleSubmit() {
  if (!form.title) return
  emit('submit', {
    title: form.title,
    description: form.description,
  })
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-800">Edit Informasi Lelang</h3>
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
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700">Deskripsi</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          ></textarea>
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
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>