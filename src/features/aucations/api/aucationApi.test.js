import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as apiHelper from '../../../helpers/apiHelper'
import {
  getAucations,
  getAucationById,
  addAucation,
  updateAucation,
  deleteAucation,
  addBid,
} from './aucationApi'

vi.mock('../../../helpers/apiHelper', () => ({
  fetchApi: vi.fn(),
}))

describe('aucationApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('memanggil GET /aucations dengan query params', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ data: [] })
    await getAucations({ is_me: 1 })

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations', {
      params: { is_me: 1 },
    })
  })

  it('memanggil GET /aucations/:id untuk detail', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ data: { id: 10 } })
    await getAucationById(10)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations/10')
  })

  it('memanggil POST /aucations untuk menambah lelang', async () => {
    const payload = { title: 'Laptop', start_bid: 1000 }
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })
    await addAucation(payload)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations', {
      method: 'POST',
      body: payload,
    })
  })

  it('memanggil PUT /aucations/:id untuk memperbarui lelang', async () => {
    const payload = { title: 'Laptop Baru' }
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })
    await updateAucation(5, payload)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations/5', {
      method: 'PUT',
      body: payload,
    })
  })

  it('memanggil DELETE /aucations/:id untuk menghapus lelang', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })
    await deleteAucation(5)

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations/5', {
      method: 'DELETE',
    })
  })

  it('memanggil POST /aucations/:id/bids untuk mengajukan bid', async () => {
    apiHelper.fetchApi.mockResolvedValueOnce({ status: 'success' })
    await addBid(5, { bid: 50000 })

    expect(apiHelper.fetchApi).toHaveBeenCalledWith('/aucations/5/bids', {
      method: 'POST',
      body: { bid: 50000 },
    })
  })
})