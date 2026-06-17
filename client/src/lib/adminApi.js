import { requestJson } from './api.js'
import { getAdminAuth } from './auth.js'

function getAdminToken() {
  return getAdminAuth()?.token || ''
}

export function adminRequest(path, options = {}) {
  return requestJson(path, {
    ...options,
    token: options.token || getAdminToken(),
  })
}
