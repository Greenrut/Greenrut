import { config } from '../config/env.js'
import { createHttpError } from '../utils/httpError.js'
import { verifyToken } from '../utils/auth.js'

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return null
  }

  return token
}

export function requireAuth(req, _res, next) {
  const token = getBearerToken(req)

  if (!token) {
    return next(createHttpError(401, 'Authorization token is required'))
  }

  const payload = verifyToken(token, config.jwtSecret)
  if (!payload) {
    return next(createHttpError(401, 'Invalid or expired token'))
  }

  req.auth = payload
  next()
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.auth) {
      return next(createHttpError(401, 'Authorization token is required'))
    }

    const currentRole = String(req.auth.role || '').trim().toLowerCase()
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role || '').trim().toLowerCase())
    const roleMatches = (role) => {
      if (!role) return false
      if (currentRole === role) return true
      const adminAliases = new Set(['admin', 'administrator'])
      return adminAliases.has(currentRole) && adminAliases.has(role)
    }

    if (allowedRoles.length > 0 && !normalizedAllowedRoles.some(roleMatches)) {
      return next(createHttpError(403, 'You do not have access to this resource'))
    }

    next()
  }
}
