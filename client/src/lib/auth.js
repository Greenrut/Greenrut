const USER_AUTH_KEY = 'greenrut:user-auth'
const ADMIN_AUTH_KEY = 'greenrut:admin-auth'

function readStoredValue(key) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

function writeStoredValue(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, value)
}

function removeStoredValue(key) {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(key)
}

function parseStoredAuth(key) {
  const value = readStoredValue(key)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function saveUserAuth(payload) {
  writeStoredValue(USER_AUTH_KEY, JSON.stringify(payload))
}

export function saveAdminAuth(payload) {
  writeStoredValue(ADMIN_AUTH_KEY, JSON.stringify(payload))
}

export function getUserAuth() {
  return parseStoredAuth(USER_AUTH_KEY)
}

export function getAdminAuth() {
  return parseStoredAuth(ADMIN_AUTH_KEY)
}

export function clearUserAuth() {
  removeStoredValue(USER_AUTH_KEY)
}

export function clearAdminAuth() {
  removeStoredValue(ADMIN_AUTH_KEY)
}

export function hasUserAuth() {
  return Boolean(getUserAuth()?.token)
}

export function hasAdminAuth() {
  return Boolean(getAdminAuth()?.token)
}
