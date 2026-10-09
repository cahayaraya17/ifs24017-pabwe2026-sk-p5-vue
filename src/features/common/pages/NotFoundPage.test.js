import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundPage from './NotFoundPage.vue'

describe('NotFoundPage.vue', () => {
  it('merender teks 404 dan tautan kembali ke beranda', () => {
    const wrapper = mount(NotFoundPage, {
      global: {
        stubs: {
          'router-link': {
            template: '<a href="/"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Halaman yang Anda cari tidak ditemukan.')
    expect(wrapper.text()).toContain('Kembali ke Beranda')
  })
})