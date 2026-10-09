import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthLayout from './AuthLayout.vue'

describe('AuthLayout.vue', () => {
  it('merender dengan prop default dan konten slot', () => {
    const wrapper = mount(AuthLayout, {
      slots: {
        default: '<div class="konten-anak">Form Auth</div>',
      },
    })
    expect(wrapper.find('.konten-anak').exists()).toBe(true)
    expect(wrapper.text()).toContain('Delcom Auction')
  })

  it('merender judul dan subjudul kustom jika diberikan', () => {
    const wrapper = mount(AuthLayout, {
      props: {
        title: 'Judul Kustom',
        subtitle: 'Subjudul Kustom',
      },
    })
    expect(wrapper.text()).toContain('Judul Kustom')
    expect(wrapper.text()).toContain('Subjudul Kustom')
  })
})
