import { defineStore } from 'pinia'
import {
  getAucations,
  getAucationById,
  addAucation,
  updateAucation,
  uploadAucationCover,
  deleteAucation,
  addBid,
  deleteBid,
  deleteAllAucations,
} from '../api/aucationApi'

export const useAucationsStore = defineStore('aucations', {
  state: () => ({
    aucations: [],
    aucation: null,
    isAucation: false,
    isAucationAdd: false,
    isAucationAdded: false,
    isAucationChange: false,
    isAucationChanged: false,
    isAucationChangeCover: false,
    isAucationDeleted: false,
    isAucationDelete: false,
    isBidAdd: false,
    isBidAdded: false,
    error: null,
  }),

  actions: {
    async fetchAucations(params = {}) {
      this.isAucation = true
      this.error = null
      try {
        const res = await getAucations(params)
        this.aucations = res.data || []
      } catch (err) {
        this.error = err?.message || 'Gagal mengambil data lelang'
        throw err
      } finally {
        this.isAucation = false
      }
    },

    async fetchAucationById(id) {
      this.isAucation = true
      this.error = null
      try {
        const res = await getAucationById(id)
        this.aucation = res.data || null
      } catch (err) {
        this.error = err?.message || 'Gagal mengambil detail lelang'
        throw err
      } finally {
        this.isAucation = false
      }
    },

    async addAucation(payload) {
      this.isAucationAdd = true
      this.isAucationAdded = false
      try {
        const res = await addAucation(payload)
        this.isAucationAdded = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal menambahkan lelang'
        throw err
      } finally {
        this.isAucationAdd = false
      }
    },

    async updateAucation(id, payload) {
      this.isAucationChange = true
      this.isAucationChanged = false
      try {
        const res = await updateAucation(id, payload)
        this.isAucationChanged = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal memperbarui lelang'
        throw err
      } finally {
        this.isAucationChange = false
      }
    },

    async uploadAucationCover(id, file) {
      this.isAucationChangeCover = true
      try {
        return await uploadAucationCover(id, file)
      } catch (err) {
        this.error = err?.message || 'Gagal mengunggah cover lelang'
        throw err
      } finally {
        this.isAucationChangeCover = false
      }
    },

    async deleteAucation(id) {
      this.isAucationDelete = true
      this.isAucationDeleted = false
      try {
        const res = await deleteAucation(id)
        this.isAucationDeleted = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus lelang'
        throw err
      } finally {
        this.isAucationDelete = false
      }
    },

    async addBid(aucationId, payload) {
      this.isBidAdd = true
      this.isBidAdded = false
      try {
        const res = await addBid(aucationId, payload)
        this.isBidAdded = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal mengajukan tawaran'
        throw err
      } finally {
        this.isBidAdd = false
      }
    },

    async deleteBid(aucationId, bidId) {
      try {
        return await deleteBid(aucationId, bidId)
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus tawaran'
        throw err
      }
    },

    async deleteAllAucations() {
      try {
        return await deleteAllAucations()
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus semua lelang'
        throw err
      }
    },
  },
})
