import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterPage from './RegisterPage.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../states/authStore'
import * as toolsHelper from '../../../helpers/toolsHelper'

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}))

describe('RegisterPage.vue', () => {
  let pinia
  let authStore

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
  })

  function createWrapper() {
    return mount(RegisterPage, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: { template: '<a><slot /></a>' },
          AuthLayout: { template: '<div><slot /></div>' },
        },
      },
    })
  }

  it('validasi form: mendeteksi seluruh field kosong', async () => {
    const wrapper = createWrapper()
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Nama wajib diisi')
    expect(wrapper.text()).toContain('Email wajib diisi')
    expect(wrapper.text()).toContain('Kata sandi wajib diisi')
  })

  it('validasi form: mendeteksi format email tidak valid, password < 6 karakter, dan beda konfirmasi', async () => {
    const wrapper = createWrapper()
    await wrapper.find('input#name').setValue('Budi')
    await wrapper.find('input#email').setValue('budi-bukan-email')
    await wrapper.find('input#password').setValue('123')
    await wrapper.find('input#confirmPassword').setValue('456')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Format email tidak valid')
    expect(wrapper.text()).toContain('Kata sandi minimal 6 karakter')
    expect(wrapper.text()).toContain('Konfirmasi kata sandi tidak sama')
  })

  it('menampilkan teks Memproses... saat isAuthRegister bernilai true', async () => {
    authStore.isAuthRegister = true
    const wrapper = createWrapper()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Memproses...')
  })

  it('submit sukses: memanggil register, dialog sukses, dan berpindah ke /login', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'success',
      message: 'Registrasi berhasil',
    })

    await wrapper.find('input#name').setValue('Budi Santoso')
    await wrapper.find('input#email').setValue('budi@delcom.org')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(authStore.register).toHaveBeenCalledWith({
      name: 'Budi Santoso',
      email: 'budi@delcom.org',
      password: 'password123',
    })
    expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith('Registrasi berhasil')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('submit gagal dari server: menampilkan dialog error dengan pesan server', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockResolvedValueOnce({
      status: 'error',
      message: 'Email sudah terdaftar',
    })

    await wrapper.find('input#name').setValue('Budi Santoso')
    await wrapper.find('input#email').setValue('budi@delcom.org')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith('Email sudah terdaftar')
  })

  it('submit error exception: menangani blok catch', async () => {
    const wrapper = createWrapper()
    vi.spyOn(authStore, 'register').mockRejectedValueOnce(new Error('Koneksi putus'))

    await wrapper.find('input#name').setValue('Budi Santoso')
    await wrapper.find('input#email').setValue('budi@delcom.org')
    await wrapper.find('input#password').setValue('password123')
    await wrapper.find('input#confirmPassword').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      'Tidak dapat terhubung ke server. Coba lagi nanti.'
    )
  })
})
