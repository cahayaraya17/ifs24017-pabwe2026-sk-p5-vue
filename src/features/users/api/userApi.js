import { fetchApi } from '../../../helpers/apiHelper'

export function getUsers(params = {}) {
  return fetchApi('/users', { params })
}

export function getMe() {
  return fetchApi('/users/me')
}

export function updateMe(payload) {
  return fetchApi('/users/me', { method: 'PUT', body: payload })
}

export function uploadMyPhoto(file) {
  const formData = new FormData()
  formData.append('photo', file)

  return fetchApi('/users/me/photo', { method: 'POST', body: formData })
}

/**
 * PUT /users/password
 * Menerima { currentPassword, newPassword } dari halaman profil, lalu
 * mengubahnya ke nama field yang diminta API Delcom.
 */
export function changeMyPassword({ currentPassword, newPassword }) {
  return fetchApi('/users/password', {
    method: 'PUT',
    body: {
      password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPassword,
    },
  })
}