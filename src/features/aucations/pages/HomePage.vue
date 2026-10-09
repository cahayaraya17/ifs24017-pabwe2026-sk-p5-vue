<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAucationsStore } from '../states/aucationsStore'
import AddModal from '../modals/AddModal.vue'

const route = useRoute()
const aucationsStore = useAucationsStore()

const searchQuery = ref('')
const activeTab = ref('all') // 'all', 'me', 'ongoing', 'closed'
const showAddModal = ref(false)

async function loadData() {
  const params = {}
  if (activeTab.value === 'me' || route.query.filter === 'me') {
    params.is_me = 1
  }
  if (activeTab.value === 'ongoing') {
    params.is_closed = 0
  }
  if (activeTab.value === 'closed') {
    params.is_closed = 1
  }
  await aucationsStore.fetchAucations(params)
}

watch(
  () => route.query.filter,
  (newFilter) => {
    if (newFilter === 'me') {
      activeTab.value = 'me'
    }
    loadData()
  }
)

onMounted(() => {
  if (route.query.filter === 'me') {
    activeTab.value = 'me'
  }
  loadData()
})

function setTab(tab) {
  activeTab.value = tab
  loadData()
}

const filteredAucations = computed(() => {
  const list = aucationsStore.aucations || []
  if (!searchQuery.value.trim()) return list

  const query = searchQuery.value.toLowerCase()
  return list.filter(
    (item) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
  )
})

async function handleAddSubmit(payload) {
  try {
    await aucationsStore.addAucation(payload)
    showAddModal.value = false
    await loadData()
  } catch (err) {
    alert(err?.message || 'Gagal menambahkan lelang')
  }
}
</script>

<template>
  <div class="home-container">
    <div class="header-section">
      <h2>Dashboard Lelang</h2>
      <button class="btn-primary" @click="showAddModal = true">
        + Tambah Lelang
      </button>
    </div>

    <!-- Filter & Pencarian -->
    <div class="toolbar">
      <div class="tabs">
        <button
          :class="['tab-btn', { active: activeTab === 'all' }]"
          @click="setTab('all')"
        >
          Semua Lelang
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'me' }]"
          @click="setTab('me')"
        >
          Lelang Saya
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'ongoing' }]"
          @click="setTab('ongoing')"
        >
          Berlangsung
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'closed' }]"
          @click="setTab('closed')"
        >
          Ditutup
        </button>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari lelang berdasarkan judul..."
        />
      </div>
    </div>

    <!-- Status Memuat -->
    <div v-if="aucationsStore.isAucation" class="loading-state">
      Memuat daftar lelang...
    </div>

    <!-- Daftar Kartu Lelang -->
    <div
      v-else-if="filteredAucations.length > 0"
      class="auction-grid"
    >
      <div
        v-for="item in filteredAucations"
        :key="item.id"
        class="auction-card"
      >
        <div class="card-cover">
          <img
            v-if="item.cover"
            :src="item.cover"
            :alt="item.title"
          />
          <div v-else class="no-cover">Tidak ada cover</div>
        </div>
        <div class="card-body">
          <h2 class="card-title">{{ item.title }}</h2>
          <p class="card-desc">{{ item.description }}</p>
          <div class="card-meta">
            <div>
              <span class="meta-label">Mulai dari:</span>
              <strong>Rp {{ Number(item.start_bid).toLocaleString() }}</strong>
            </div>
            <div>
              <span class="meta-label">Status:</span>
              <span :class="['status-badge', item.is_closed ? 'closed' : 'open']">
                {{ item.is_closed ? 'Ditutup' : 'Berlangsung' }}
              </span>
            </div>
          </div>
          <router-link
            :to="`/aucations/${item.id}`"
            class="btn-detail"
          >
            Lihat Detail
          </router-link>
        </div>
      </div>
    </div>

    <!-- Data Kosong -->
    <div v-else class="empty-state">
      Tidak ada data lelang yang ditemukan.
    </div>

    <!-- Modal Tambah -->
    <AddModal
      :show="showAddModal"
      :loading="aucationsStore.isAucationAdd"
      @close="showAddModal = false"
      @submit="handleAddSubmit"
    />
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-primary {
  background-color: #0369a1;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary:hover {
  background-color: #0369a1;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.tabs {
  display: flex;
  gap: 8px;
}
.tab-btn {
  background: #e2e8f0;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}
.tab-btn.active {
  background: #0f172a;
  color: #fff;
}
.search-box input {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 250px;
}
.auction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
.auction-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.card-cover {
  height: 140px;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-cover {
  color: #475569;
  font-size: 0.85rem;
}
.card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-title {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
}
.card-desc {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-meta {
  margin-top: auto;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}
.meta-label {
  color: #64748b;
  margin-right: 4px;
}
.status-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}
.status-badge.open {
  background-color: #dcfce7;
  color: #166534;
}
.status-badge.closed {
  background-color: #fee2e2;
  color: #991b1b;
}
.btn-detail {
  display: block;
  text-align: center;
  background-color: #f1f5f9;
  color: #0f172a;
  text-decoration: none;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.9rem;
}
.btn-detail:hover {
  background-color: #e2e8f0;
}
.loading-state,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #64748b;
  background: #fff;
  border-radius: 8px;
}
</style>