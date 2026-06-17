import { requestJson } from './api.js'
import { getUserAuth } from './auth.js'

function getAccountToken() {
  return getUserAuth()?.token || ''
}

export function accountRequest(path, options = {}) {
  return requestJson(path, {
    ...options,
    token: options.token || getAccountToken(),
  })
}
