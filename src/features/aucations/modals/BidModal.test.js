import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BidModal from './BidModal.vue'

describe('BidModal.vue', () => {
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

  it('memancarkan event submit dengan payload yang benar jika bid valid', async () => {
    const wrapper = mount(BidModal, {
      props: {
        show: true,
        loading: false,
        currentHighestBid: 50000,
      },
    })

    const input = wrapper.find('input[type="number"]')
    await input.setValue('75000')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeDefined()
    expect(wrapper.emitted('submit')[0]).toEqual([{ bid: 75000 }])
  })
})