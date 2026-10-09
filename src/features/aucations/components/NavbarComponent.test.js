import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavbarComponent from './NavbarComponent.vue'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('NavbarComponent.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('menampilkan elemen brand Delcom Auction', () => {
    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Delcom Auction')
  })

  it('menghapus token dan mengarahkan ke login saat tombol Keluar diklik', async () => {
    localStorage.setItem('token', 'sample-token-123')

    const wrapper = mount(NavbarComponent, {
      global: {
        stubs: {
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const logoutButton = wrapper.find('button.btn-logout')
    await logoutButton.trigger('click')

    expect(localStorage.getItem('token')).toBeNull()
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })
})