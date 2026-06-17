import crypto from 'node:crypto'

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url')
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function parseDurationToMs(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  const match = /^(\d+)([smhd])?$/.exec(String(value || '').trim())
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000
  }

  const amount = Number(match[1])
  const unit = match[2] || 'd'
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }

  return amount * multipliers[unit]
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}

export function verifyPassword(password, passwordHash) {
  const [salt, hash] = String(passwordHash || '').split(':')
  if (!salt || !hash) {
    return false
  }

  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  const hashBuffer = Buffer.from(hash, 'hex')
  const derivedBuffer = Buffer.from(derivedKey, 'hex')

  if (hashBuffer.length !== derivedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(hashBuffer, derivedBuffer)
}

export function createToken(payload, secret, expiresIn = '7d') {
  const header = { alg: 'HS256', typ: 'JWT' }
  const expiresInMs = parseDurationToMs(expiresIn)
  const now = Date.now()
  const tokenPayload = {
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + expiresInMs) / 1000),
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token, secret) {
  try {
    const [encodedHeader, encodedPayload, signature] = String(token || '').split('.')
    if (!encodedHeader || !encodedPayload || !signature) {
      return null
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url')

    const actualBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload))
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function serializeUser(user) {
  return {
    id: user._id?.toString?.() || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActive: user.lastActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
