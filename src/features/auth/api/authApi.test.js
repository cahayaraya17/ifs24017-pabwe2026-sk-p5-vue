import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import { login, register, logout } from './authApi'

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memanggil endpoint POST /auth/login dengan payload yang sesuai', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success', data: { token: 'token123' } })
    const payload = { email: 'user@delcom.org', password: 'password123' }

    const res = await login(payload)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: payload,
    })
    expect(res.data.token).toBe('token123')
  })

  it('memanggil endpoint POST /auth/register dengan payload yang sesuai', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })
    const payload = { name: 'User Test', email: 'user@delcom.org', password: 'password123' }

    const res = await register(payload)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: payload,
    })
    expect(res.status).toBe('success')
  })

  it('memanggil endpoint POST /auth/logout', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })

    const res = await logout()

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/auth/logout', {
      method: 'POST',
    })
    expect(res.status).toBe('success')
  })
})