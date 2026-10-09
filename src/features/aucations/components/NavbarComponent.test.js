import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavbarComponent from './NavbarComponent.vue'
import * as apiHelper from '../../../helpers/apiHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

describe('NavbarComponent.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('merender link brand dan navigasi dengan benar', () => {
    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Delcom Auction')
    expect(wrapper.text()).toContain('Profil')
    expect(wrapper.text()).toContain('Keluar')
  })

  it('menjalankan proses logout dan berpindah ke /login saat tombol Keluar diklik', async () => {
    const removeTokenSpy = vi.spyOn(apiHelper, 'removeAccessToken')
    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

    await wrapper.find('.btn-logout').trigger('click')

    expect(removeTokenSpy).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})
