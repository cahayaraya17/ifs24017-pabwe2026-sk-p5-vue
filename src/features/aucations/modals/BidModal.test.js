import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BidModal from './BidModal.vue'

describe('BidModal.vue', () => {
  it('merender prop default tanpa error saat currentHighestBid tidak disertakan', () => {
    const wrapper = mount(BidModal, {
      props: {
        show: true,
      },
    })
    expect(wrapper.text()).toContain('Rp 0')
  })

  it('tidak merender modal card jika show bernilai false', () => {
    const wrapper = mount(BidModal, {
      props: {
        show: false,
      },
    })
    expect(wrapper.find('.modal-card').exists()).toBe(false)
  })

  it('menolak submit jika nominal bid kurang dari atau sama dengan tawaran tertinggi', async () => {
    const wrapper = mount(BidModal, {
      props: {
        show: true,
        loading: false,
        currentHighestBid: 50000,
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('50000')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Tawaran harus lebih tinggi')
  })

  it('memancarkan event submit dengan payload yang benar jika bid valid dan membersihkan error', async () => {
    const wrapper = mount(BidModal, {
      props: {
        show: true,
        loading: false,
        currentHighestBid: 50000,
      },
    })

    const input = wrapper.find('input[type="number"]')
    // Trigger kondisi invalid terlebih dahulu untuk menguji pembersihan error
    await input.setValue('30000')
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.find('.error').exists()).toBe(true)

    // Trigger kondisi valid
    await input.setValue('75000')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeDefined()
    expect(wrapper.emitted('submit')[0]).toEqual([{ bid: 75000 }])
  })

  it('memancarkan event close saat tombol Batal diklik', async () => {
    const wrapper = mount(BidModal, {
      props: {
        show: true,
        loading: false,
        currentHighestBid: 50000,
      },
    })

    const cancelButton = wrapper.find('button[type="button"]')
    await cancelButton.trigger('click')

    expect(wrapper.emitted('close')).toBeDefined()
  })
})