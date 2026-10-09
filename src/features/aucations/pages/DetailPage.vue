<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import ChangeModal from '../modals/ChangeModal.vue'
import ChangeCoverModal from '../modals/ChangeCoverModal.vue'
import BidModal from '../modals/BidModal.vue'

const route = useRoute()
const router = useRouter()
const aucationsStore = useAucationsStore()

const showChangeModal = ref(false)
const showCoverModal = ref(false)
const showBidModal = ref(false)

const aucationId = computed(() => route.params.id || route.params.aucationId)

async function loadDetail() {
  if (aucationId.value) {
    await aucationsStore.fetchAucationById(aucationId.value)
  }
}

onMounted(() => {
  loadDetail()
})

async function handleChangeSubmit(payload) {
  try {
    await aucationsStore.updateAucation(aucationId.value, payload)
    showChangeModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengubah data lelang')
  }
}

async function handleCoverSubmit(file) {
  try {
    await aucationsStore.uploadAucationCover(aucationId.value, file)
    showCoverModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengunggah cover')
  }
}

async function handleBidSubmit(payload) {
  try {
    await aucationsStore.addBid(aucationId.value, payload)
    showBidModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengajukan tawaran')
  }
}

async function handleDelete() {
  if (confirm('Yakin ingin menghapus item lelang ini?')) {
    try {
      await aucationsStore.deleteAucation(aucationId.value)
      router.push('/')
    } catch (err) {
      alert(err?.message || 'Gagal menghapus lelang')
    }
  }
}
</script>

<template>
  <div v-if="aucationsStore.isAucation" class="p-8 text-center text-slate-500">
    Memuat detail lelang...
  </div>

  <div v-else-if="aucationsStore.aucation" class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <router-link to="/" class="text-sm font-semibold text-indigo-600 hover:underline">
        ← Kembali ke Daftar Lelang
      </router-link>
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          @click="showCoverModal = true"
        >
          Ganti Cover
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          @click="showChangeModal = true"
        >
          Edit Info
        </button>
        <button
          type="button"
          class="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          @click="handleDelete"
        >
          Hapus
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="aucationsStore.aucation.cover" class="h-64 bg-slate-100 flex items-center justify-center overflow-hidden">
        <img :src="aucationsStore.aucation.cover" :alt="aucationsStore.aucation.title" class="w-full h-full object-cover" />
      </div>

      <div class="p-6 space-y-4">
        <div class="flex justify-between items-start gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-800">{{ aucationsStore.aucation.title }}</h1>
            <p class="text-sm text-slate-500 mt-1">Dibuat oleh {{ aucationsStore.aucation.user?.name || 'Pengguna' }}</p>
          </div>
          <span :class="['px-3 py-1 rounded-full text-xs font-semibold', aucationsStore.aucation.is_closed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700']">
            {{ aucationsStore.aucation.is_closed ? 'Ditutup' : 'Berlangsung' }}
          </span>
        </div>

        <div class="prose max-w-none text-slate-700 pt-2">
          <MarkdownViewer :content="aucationsStore.aucation.description || 'Tidak ada deskripsi.'" />
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
          <div>
            <span class="text-slate-500 block">Tawaran Awal:</span>
            <strong class="text-base text-slate-800">Rp {{ Number(aucationsStore.aucation.start_bid || 0).toLocaleString() }}</strong>
          </div>
          <div>
            <span class="text-slate-500 block">Penawaran Tertinggi:</span>
            <strong class="text-base text-indigo-600">Rp {{ Number(aucationsStore.aucation.highest_bid || aucationsStore.aucation.start_bid || 0).toLocaleString() }}</strong>
          </div>
          <div>
            <span class="text-slate-500 block">Batas Waktu:</span>
            <strong class="text-slate-800">{{ aucationsStore.aucation.closed_at ? new Date(aucationsStore.aucation.closed_at).toLocaleString() : '-' }}</strong>
          </div>
        </div>

        <div v-if="!aucationsStore.aucation.is_closed" class="pt-4">
          <button
            type="button"
            class="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 transition"
            @click="showBidModal = true"
          >
            Ajukan Tawaran (Bid)
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ChangeModal
      :show="showChangeModal"
      :initial-data="aucationsStore.aucation"
      :loading="aucationsStore.isAucationChange"
      @close="showChangeModal = false"
      @submit="handleChangeSubmit"
    />

    <ChangeCoverModal
      :show="showCoverModal"
      :loading="aucationsStore.isAucationChangeCover"
      @close="showCoverModal = false"
      @submit="handleCoverSubmit"
    />

    <BidModal
      :show="showBidModal"
      :current-highest-bid="Number(aucationsStore.aucation.highest_bid || aucationsStore.aucation.start_bid || 0)"
      :loading="aucationsStore.isBidAdd"
      @close="showBidModal = false"
      @submit="handleBidSubmit"
    />
  </div>

  <div v-else class="p-8 text-center text-slate-500">
    Data lelang tidak ditemukan.
  </div>
</template>