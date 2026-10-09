import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from './HomePage.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAucationsStore } from '../states/aucationsStore'

let mockRouteQuery = {}
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: mockRouteQuery,
  }),
}))

describe('HomePage.vue', () => {
  let pinia
  let store

  beforeEach(() => {
    mockRouteQuery = {}
    pinia = createPinia()
    setActivePinia(pinia)
    store = useAucationsStore()
    vi.clearAllMocks()
  })

  function createWrapper() {
    return mount(HomePage, {
      global: {
        plugins: [pinia],
        stubs: {
          'router-link': { template: '<a><slot /></a>' },
          AddModal: { template: '<div></div>' },
        },
      },
    })
  }

  it('memuat data lelang pada saat onMounted dan merender kartu lelang', async () => {
    vi.spyOn(store, 'fetchAucations').mockImplementation(async () => {
      store.aucations = [
        {
          id: 1,
          title: 'Laptop Gaming',
          description: 'Spesifikasi tinggi',
          start_bid: 5000000,
          is_closed: 0,
          cover: 'https://example.com/laptop.jpg',
        },
        {
          id: 2,
          title: 'Monitor 4K',
          description: 'Layar jernih',
          start_bid: 2000000,
          is_closed: 1,
          cover: null,
        },
      ]
      store.isAucation = false
    })

    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    expect(store.fetchAucations).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Laptop Gaming')
    expect(wrapper.text()).toContain('Monitor 4K')
    expect(wrapper.text()).toContain('Tidak ada cover')
  })

  it('memfilter data lelang berdasarkan kata kunci pencarian', async () => {
    vi.spyOn(store, 'fetchAucations').mockImplementation(async () => {
      store.aucations = [
        { id: 1, title: 'Kamera DSLR', description: 'Lensa kit', start_bid: 3000000 },
        { id: 2, title: 'Smartphone', description: 'Baterai awet', start_bid: 1500000 },
      ]
      store.isAucation = false
    })

    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('.search-box input')
    await searchInput.setValue('Kamera')

    expect(wrapper.text()).toContain('Kamera DSLR')
    expect(wrapper.text()).not.toContain('Smartphone')
  })

  it('mengganti tab filter dan memanggil fetchAucations dengan parameter yang benar', async () => {
    const fetchSpy = vi.spyOn(store, 'fetchAucations').mockResolvedValue({})
    const wrapper = createWrapper()

    const tabButtons = wrapper.findAll('.tab-btn')
    await tabButtons[1].trigger('click')
    expect(fetchSpy).toHaveBeenCalledWith({ is_me: 1 })

    await tabButtons[2].trigger('click')
    expect(fetchSpy).toHaveBeenCalledWith({ is_closed: 0 })

    await tabButtons[3].trigger('click')
    expect(fetchSpy).toHaveBeenCalledWith({ is_closed: 1 })
  })

  it('menangani submit lelang baru via handleAddSubmit', async () => {
    vi.spyOn(store, 'addAucation').mockResolvedValue({})
    const fetchSpy = vi.spyOn(store, 'fetchAucations').mockResolvedValue({})
    const wrapper = createWrapper()

    await wrapper.vm.handleAddSubmit({ title: 'Barang Tes', start_bid: 100000, end_at: '2026-12-31' })

    expect(store.addAucation).toHaveBeenCalled()
    expect(fetchSpy).toHaveBeenCalled()
  })
})
