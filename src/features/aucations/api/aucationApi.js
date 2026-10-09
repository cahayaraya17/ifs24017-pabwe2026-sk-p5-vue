import { fetchApi } from '../../../helpers/apiHelper'

/**
 * Mengambil daftar lelang
 * Mendukung query params: is_me, is_closed, dll.
 */
export function getAucations(params = {}) {
  return fetchApi('/aucations', { params })
}

/**
 * Mengambil detail lengkap item lelang berdasarkan ID
 */
export function getAucationById(id) {
  return fetchApi(`/aucations/${id}`)
}

/**
 * Menambahkan lelang barang baru
 * payload: { title, description, start_bid, closed_at }
 */
export function addAucation(payload) {
  return fetchApi('/aucations', {
    method: 'POST',
    body: payload,
  })
}

/**
 * Memperbarui data lelang
 */
export function updateAucation(id, payload) {
  return fetchApi(`/aucations/${id}`, {
    method: 'PUT',
    body: payload,
  })
}

/**
 * Mengunggah/mengganti foto cover barang lelang
 */
export function uploadAucationCover(id, file) {
  const formData = new FormData()
  formData.append('cover', file)

  return fetchApi(`/aucations/${id}/cover`, {
    method: 'POST',
    body: formData,
  })
}

/**
 * Menghapus item lelang berdasarkan ID
 */
export function deleteAucation(id) {
  return fetchApi(`/aucations/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Mengajukan tawaran lelang / bid
 * payload: { bid }
 */
export function addBid(id, payload) {
  return fetchApi(`/aucations/${id}/bids`, {
    method: 'POST',
    body: payload,
  })
}

/**
 * Membatalkan/menghapus tawaran lelang
 */
export function deleteBid(id) {
  return fetchApi(`/aucations/${id}/bids`, {
    method: 'DELETE',
  })
}

/**
 * Menghapus seluruh item lelang milik pengguna
 */
export function deleteAllAucations() {
  return fetchApi('/aucations', {
    method: 'DELETE',
  })
}