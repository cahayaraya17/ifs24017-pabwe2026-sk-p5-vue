import { fetchApi } from '../../../helpers/apiHelper'

/**
 * GET /aucations
 *
 * Mengambil daftar lelang.
 *
 * @param {Object} options
 * @param {boolean} options.is_me - Hanya lelang milik user
 * @param {boolean} options.is_closed - Hanya lelang yang sudah ditutup
 */
export function getAucations({ is_me, is_closed } = {}) {
  return fetchApi('/aucations', {
    method: 'GET',
    params: {
      is_me,
      is_closed,
    },
  })
}

/**
 * GET /aucations/:id
 *
 * Mengambil detail satu lelang.
 *
 * @param {string|number} id
 */
export function getAucation(id) {
  return fetchApi(`/aucations/${id}`, {
    method: 'GET',
  })
}

/**
 * POST /aucations
 *
 * Membuat lelang baru.
 *
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.description
 * @param {number} payload.start_bid
 * @param {string} payload.closed_at
 */
export function addAucation({
  title,
  description,
  start_bid,
  closed_at,
}) {
  return fetchApi('/aucations', {
    method: 'POST',
    body: {
      title,
      description,
      start_bid,
      closed_at,
    },
  })
}

/**
 * PUT /aucations/:id
 *
 * Mengubah data lelang.
 *
 * @param {string|number} id
 * @param {Object} payload
 */
export function changeAucation(
  id,
  {
    title,
    description,
    start_bid,
    closed_at,
  },
) {
  return fetchApi(`/aucations/${id}`, {
    method: 'PUT',
    body: {
      title,
      description,
      start_bid,
      closed_at,
    },
  })
}

/**
 * POST /aucations/:id/cover
 *
 * Mengunggah / mengganti cover lelang.
 *
 * @param {string|number} id
 * @param {File} file
 */
export function changeAucationCover(id, file) {
  const formData = new FormData()

  formData.append('cover', file)

  return fetchApi(`/aucations/${id}/cover`, {
    method: 'POST',
    body: formData,
  })
}

/**
 * DELETE /aucations/:id
 *
 * Menghapus satu lelang.
 *
 * @param {string|number} id
 */
export function deleteAucation(id) {
  return fetchApi(`/aucations/${id}`, {
    method: 'DELETE',
  })
}

/**
 * POST /aucations/:id/bids
 *
 * Mengajukan penawaran / bid.
 *
 * @param {string|number} id
 * @param {number} bid
 */
export function addBid(id, bid) {
  return fetchApi(`/aucations/${id}/bids`, {
    method: 'POST',
    body: {
      bid,
    },
  })
}

/**
 * DELETE /aucations/:id/bids
 *
 * Membatalkan / menghapus tawaran milik user.
 *
 * @param {string|number} id
 */
export function deleteBid(id) {
  return fetchApi(`/aucations/${id}/bids`, {
    method: 'DELETE',
  })
}

/**
 * DELETE /aucations
 *
 * Menghapus seluruh lelang milik user.
 */
export function deleteAllAucations() {
  return fetchApi('/aucations', {
    method: 'DELETE',
  })
}