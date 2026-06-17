import { requestJson } from './api.js'

export function publicRequest(path, options = {}) {
  return requestJson(path, options)
}
