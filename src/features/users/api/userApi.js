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

export function changeMyPassword(payload) {
  return fetchApi('/users/me/password', { method: 'PUT', body: payload })
}