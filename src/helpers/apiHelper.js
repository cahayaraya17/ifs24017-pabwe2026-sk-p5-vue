const ACCESS_TOKEN_KEY = 'accessToken'

/**
 * Mengambil token akses dari localStorage.
 * @returns {string|null} token, atau null jika belum login
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Menyimpan token akses ke localStorage.
 * @param {string} token
 */
export function putAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

/**
 * Menghapus token akses dari localStorage (dipakai saat logout).
 */
export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

/**
 * Menyusun URL lengkap beserta query parameters.
 * Parameter yang bernilai undefined, null, atau string kosong diabaikan.
 * @param {string} path contoh: '/auctions'
 * @param {Object} params contoh: { page: 1, search: 'laptop' }
 * @returns {string}
 */
function buildUrl(path, params) {
  const url = new URL(`${DELCOM_BASEURL}${path}`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value)
    }
  })

  return url.toString()
}

/**
 * Wrapper fetch untuk REST API Delcom.
 *
 * - Query parameters dipasang otomatis dari `params`.
 * - Header Authorization: Bearer <token> dipasang otomatis jika token ada.
 * - Body object dikirim sebagai JSON, body FormData dikirim apa adanya.
 *
 * @param {string} path
 * @param {Object} [options]
 * @param {string} [options.method='GET']
 * @param {Object} [options.params={}]
 * @param {Object|FormData} [options.body]
 * @returns {Promise<Object>} hasil response yang sudah di-parse dari JSON
 */
export async function fetchApi(path, options = {}) {
  const { method = 'GET', params = {}, body } = options

  const headers = {}

  const token = getAccessToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = { method, headers }

  if (body instanceof FormData) {
    config.body = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(body)
  }

  const response = await fetch(buildUrl(path, params), config)

  return response.json()
}