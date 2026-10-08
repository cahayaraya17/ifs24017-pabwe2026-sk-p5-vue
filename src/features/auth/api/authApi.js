import { fetchApi } from '../../../helpers/apiHelper'

/**
 * POST /auth/login
 * @param {{ email: string, password: string }} payload
 */
export function login({ email, password }) {
  return fetchApi('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

/**
 * POST /auth/register
 * @param {{ name: string, email: string, password: string }} payload
 */
export function register({ name, email, password }) {
  return fetchApi('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })
}

/**
 * POST /auth/logout (memakai token yang tersimpan)
 */
export function logout() {
  return fetchApi('/auth/logout', { method: 'POST' })
}