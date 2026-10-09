<script setup>
import { ref, onMounted } from 'vue'
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

const aucationId = route.params.aucationId

async function loadDetail() {
  await aucationsStore.fetchAucationById(aucationId)
}

onMounted(() => {
  loadDetail()
})

async function handleChangeSubmit(payload) {
  try {
    await aucationsStore.updateAucation(aucationId, payload)
    showChangeModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengubah data lelang')
  }
}

async function handleCoverSubmit(file) {
  try {
    await aucationsStore.uploadAucationCover(aucationId, file)
    showCoverModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengunggah cover')
  }
}

async function handleBidSubmit(payload) {
  try {
    await aucationsStore.addBid(aucationId, payload)
    showBidModal.value = false
    await loadDetail()
  } catch (err) {
    alert(err?.message || 'Gagal mengajukan tawaran')
  }
}

async function handleDelete() {
  if (confirm('Yakin ingin menghapus item lelang ini?')) {
    try {
      await aucationsStore.deleteAucation(aucationId)
      router.push('/')
    } catch (err) {
      alert(err?.message || 'Gagal menghapus lelang')
    }
  }
}
</script>

<template>
  <div v-if="aucationsStore.isAucation" class="loading">
    Memuat detail lelang...
  </div>

  <div v-else-if="aucationsStore.aucation" class="detail-container">
    <div class="detail-header">
      <router-link to="/" class="back-link">← Kembali ke Dashboard</router-link>
      <div class="actions">
        <button class="btn-action" @click="showCoverModal = true">Ganti Cover</button>
        <button class="btn-action" @click="showChangeModal = true">Edit</button>
        <button class="btn-danger" @click="handleDelete">Hapus</button>
      </div>
    </div>

    <div class="content-layout">
      <!-- Info Utama -->
      <div class="main-info">
        <div class="cover-wrapper">
          <img
            v-if="aucationsStore.aucation.cover"
            :src="aucationsStore.aucation.cover"
            alt="Cover"
          />
          <div v-else class="no-cover">Belum ada cover gambar</div>
        </div>

        <h2>{{ aucationsStore.aucation.title }}</h2>

        <div class="description-section">
          <h4>Deskripsi</h4>
          <MarkdownViewer :content="aucationsStore.aucation.description || ''" />
        </div>
      </div>

      <!-- Sisi Penawaran / Bids -->
      <div class="bid-panel">
        <div class="price-box">
          <span class="label">Harga Awal</span>
          <h3>Rp {{ Number(aucationsStore.aucation.start_bid || 0).toLocaleString() }}</h3>
        </div>

        <button
          class="btn-bid"
          :disabled="aucationsStore.aucation.is_closed"
          @click="showBidModal = true"
        >
          {{ aucationsStore.aucation.is_closed ? 'Lelang Sudah Ditutup' : 'Ajukan Tawaran (Bid)' }}
        </button>

        <div class="history-section">
          <h4>Histori Penawaran</h4>
          <ul
            v-if="aucationsStore.aucation.bids && aucationsStore.aucation.bids.length > 0"
            class="bid-list"
          >
            <li
              v-for="bid in aucationsStore.aucation.bids"
              :key="bid.id"
              class="bid-item"
            >
              <span class="bid-user">{{ bid.user?.name || 'Peserta' }}</span>
              <strong class="bid-val">Rp {{ Number(bid.bid).toLocaleString() }}</strong>
            </li>
          </ul>
          <p v-else class="empty-bid">Belum ada tawaran masuk.</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ChangeModal
      :show="showChangeModal"
      :loading="aucationsStore.isAucationChange"
      :initial-data="aucationsStore.aucation"
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
      :loading="aucationsStore.isBidAdd"
      :current-highest-bid="Number(aucationsStore.aucation.start_bid || 0)"
      @close="showBidModal = false"
      @submit="handleBidSubmit"
    />
  </div>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.back-link {
  color: #0284c7;
  text-decoration: none;
  font-weight: 500;
}
.actions {
  display: flex;
  gap: 8px;
}
.btn-action {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-danger {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.content-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}
.cover-wrapper {
  width: 100%;
  height: 320px;
  background-color: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.main-info h2 {
  margin: 0 0 16px 0;
}
.bid-panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.price-box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
}
.price-box .label {
  font-size: 0.85rem;
  color: #64748b;
}
.price-box h3 {
  margin: 4px 0 0 0;
  color: #0284c7;
}
.btn-bid {
  background: #0284c7;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.btn-bid:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
.history-section h4 {
  margin: 0 0 12px 0;
}
.bid-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bid-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 6px;
  font-size: 0.9rem;
}
.empty-bid,
.loading {
  color: #64748b;
  font-size: 0.9rem;
}
</style>