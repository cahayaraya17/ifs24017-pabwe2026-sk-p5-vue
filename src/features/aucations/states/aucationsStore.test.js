import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAucationsStore } from './aucationsStore'
import * as aucationApi from '../api/aucationApi'

vi.mock('../api/aucationApi', () => ({
  getAucations: vi.fn(),
  getAucationById: vi.fn(),
  addAucation: vi.fn(),
  updateAucation: vi.fn(),
  uploadAucationCover: vi.fn(),
  deleteAucation: vi.fn(),
  addBid: vi.fn(),
  deleteBid: vi.fn(),
  deleteAllAucations: vi.fn(),
}))

describe('aucationsStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAucationsStore()
    vi.clearAllMocks()
  })

  it('fetchAucations mengisi data list aucations', async () => {
    const dummy = [{ id: 1, title: 'Item Lelang 1' }]
    aucationApi.getAucations.mockResolvedValueOnce({ data: dummy })

    await store.fetchAucations()

    expect(store.aucations).toEqual(dummy)
    expect(store.isAucation).toBe(false)
  })

  it('fetchAucationById mengisi data aucation aktif', async () => {
    const detail = { id: 10, title: 'Barang Antik' }
    aucationApi.getAucationById.mockResolvedValueOnce({ data: detail })

    await store.fetchAucationById(10)

    expect(store.aucation).toEqual(detail)
    expect(store.isAucation).toBe(false)
  })

  it('addAucation mengubah status isAucationAdded menjadi true', async () => {
    aucationApi.addAucation.mockResolvedValueOnce({ status: 'success' })

    await store.addAucation({ title: 'Barang Baru' })

    expect(store.isAucationAdded).toBe(true)
    expect(store.isAucationAdd).toBe(false)
  })

  it('updateAucation mengubah status isAucationChanged menjadi true', async () => {
    aucationApi.updateAucation.mockResolvedValueOnce({ status: 'success' })

    await store.updateAucation(1, { title: 'Barang Baru' })

    expect(store.isAucationChanged).toBe(true)
    expect(store.isAucationChange).toBe(false)
  })

  it('deleteAucation mengubah status isAucationDeleted menjadi true', async () => {
    aucationApi.deleteAucation.mockResolvedValueOnce({ status: 'success' })

    await store.deleteAucation(1)

    expect(store.isAucationDeleted).toBe(true)
    expect(store.isAucationDelete).toBe(false)
  })

  it('addBid mengubah status isBidAdded menjadi true', async () => {
    aucationApi.addBid.mockResolvedValueOnce({ status: 'success' })

    await store.addBid(1, { bid: 150000 })

    expect(store.isBidAdded).toBe(true)
    expect(store.isBidAdd).toBe(false)
  })
})