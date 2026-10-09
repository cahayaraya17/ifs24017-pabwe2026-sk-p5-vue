import { defineStore } from 'pinia'
import * as aucationApi from '../api/aucationApi'

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
    isAucationDelete: false,
    isAucationDeleted: false,
    isBidAdd: false,
    isBidAdded: false,
    error: null,
  }),

  actions: {
    async fetchAucations(params = {}) {
      this.isAucation = true
      this.error = null
      try {
        const res = await aucationApi.getAucations(params)
        const raw = res?.data ?? []
        this.aucations = Array.isArray(raw) ? raw : (raw.aucations ?? [])
        return res
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
        const res = await aucationApi.getAucationById(id)
        this.aucation = res?.data?.aucation ?? res?.data ?? null
        return res
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
      this.error = null
      try {
        const res = await aucationApi.addAucation(payload)
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
      this.error = null
      try {
        const res = await aucationApi.updateAucation(id, payload)
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
      this.error = null
      try {
        return await aucationApi.uploadAucationCover(id, file)
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
      this.error = null
      try {
        const res = await aucationApi.deleteAucation(id)
        this.isAucationDeleted = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus lelang'
        throw err
      } finally {
        this.isAucationDelete = false
      }
    },

    async addBid(id, payload) {
      this.isBidAdd = true
      this.isBidAdded = false
      this.error = null
      try {
        const res = await aucationApi.addBid(id, payload)
        this.isBidAdded = true
        return res
      } catch (err) {
        this.error = err?.message || 'Gagal mengajukan tawaran'
        throw err
      } finally {
        this.isBidAdd = false
      }
    },

    async deleteBid(id, bidId) {
      try {
        return await aucationApi.deleteBid(id, bidId)
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus tawaran'
        throw err
      }
    },

    async deleteAllAucations() {
      try {
        return await aucationApi.deleteAllAucations()
      } catch (err) {
        this.error = err?.message || 'Gagal menghapus semua lelang'
        throw err
      }
    },
  },
})