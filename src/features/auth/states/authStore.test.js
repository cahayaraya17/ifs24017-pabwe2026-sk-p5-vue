import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from './authStore'
import * as authApi from '../api/authApi'
import * as apiHelper from '../../../helpers/apiHelper'

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}))

vi.mock('../../../helpers/apiHelper', () => ({
  getAccessToken: vi.fn(() => 'initial-token'),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}))

describe('authStore', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    store = useAuthStore()
  })

  it('memiliki nilai awal token dari getAccessToken dan menghitung isAuthenticated', () => {
    expect(store.token).toBe('initial-token')
    expect(store.isAuthenticated).toBe(true)
  })

  it('login sukses: menyimpan token, data user, dan memanggil putAccessToken', async () => {
    authApi.login.mockResolvedValueOnce({
      status: 'success',
      data: {
        token: 'new-token',
        user: { id: 1, name: 'Delcom User' },
      },
    })

    const res = await store.login({ email: 'test@delcom.org', password: '123' })

    expect(store.token).toBe('new-token')
    expect(store.user).toEqual({ id: 1, name: 'Delcom User' })
    expect(apiHelper.putAccessToken).toHaveBeenCalledWith('new-token')
    expect(store.isAuthLogin).toBe(false)
    expect(res.status).toBe('success')
  })

  it('login gagal: mengisi validationErrors dan menangani fallback data kosong', async () => {
    // Skenario error dengan pesan data
    authApi.login.mockResolvedValueOnce({
      status: 'error',
      data: { email: 'Email tidak ditemukan' },
    })

    await store.login({ email: 'wrong@delcom.org', password: '123' })
    expect(store.validationErrors).toEqual({ email: 'Email tidak ditemukan' })

    // Skenario error dengan data null (menguji percabangan ??)
    authApi.login.mockResolvedValueOnce({
      status: 'error',
      data: null,
    })

    await store.login({ email: 'wrong@delcom.org', password: '123' })
    expect(store.validationErrors).toEqual({})
    expect(store.isAuthLogin).toBe(false)
  })

  it('register sukses: tidak mengisi validationErrors', async () => {
    authApi.register.mockResolvedValueOnce({
      status: 'success',
    })

    const res = await store.register({ name: 'User', email: 'u@delcom.org', password: '123' })

    expect(res.status).toBe('success')
    expect(store.validationErrors).toEqual({})
    expect(store.isAuthRegister).toBe(false)
  })

  it('register gagal: mengisi validationErrors dan menangani fallback data kosong', async () => {
    // Skenario error dengan data
    authApi.register.mockResolvedValueOnce({
      status: 'error',
      data: { password: 'Password minimal 8 karakter' },
    })

    await store.register({ name: 'User', email: 'u@delcom.org', password: '123' })
    expect(store.validationErrors).toEqual({ password: 'Password minimal 8 karakter' })

    // Skenario error dengan data null
    authApi.register.mockResolvedValueOnce({
      status: 'error',
      data: null,
    })

    await store.register({ name: 'User', email: 'u@delcom.org', password: '123' })
    expect(store.validationErrors).toEqual({})
    expect(store.isAuthRegister).toBe(false)
  })

  it('logout: memanggil logout API dan membersihkan sesi lokal pada blok finally', async () => {
    authApi.logout.mockResolvedValueOnce({ status: 'success' })

    await store.logout()

    expect(apiHelper.removeAccessToken).toHaveBeenCalled()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthLogout).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('logout: tetap membersihkan sesi lokal meskipun API logout gagal/melempar error', async () => {
    authApi.logout.mockRejectedValueOnce(new Error('Koneksi terputus'))

    await expect(store.logout()).rejects.toThrow('Koneksi terputus')

    expect(apiHelper.removeAccessToken).toHaveBeenCalled()
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthLogout).toBe(false)
  })
})