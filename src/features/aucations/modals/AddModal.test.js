import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AddModal from './AddModal.vue'

describe('AddModal.vue', () => {
  it('merender modal ketika prop show bernilai true dan memancarkan event close', async () => {
    const wrapper = mount(AddModal, {
      props: { show: true, loading: false },
    })

    expect(wrapper.text()).toContain('Tambah Lelang Baru')
    await wrapper.find('button[type="button"]').trigger('click')
    expect(wrapper.emitted('close')).toBeDefined()
  })

  it('memancarkan submit saat form diisi dengan data valid', async () => {
    const wrapper = mount(AddModal, {
      props: { show: true, loading: false },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Vespa Klasik')
    await wrapper.find('textarea').setValue('Kondisi prima')
    await inputs[1].setValue('15000000')
    await inputs[2].setValue('50000')
    await inputs[3].setValue('2026-12-31T23:59')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeDefined()
    expect(wrapper.emitted('submit')[0][0]).toEqual({
      title: 'Vespa Klasik',
      description: 'Kondisi prima',
      start_bid: 15000000,
      bid_multiply: 50000,
      closed_at: new Date('2026-12-31T23:59').toISOString(),
    })
  })
})