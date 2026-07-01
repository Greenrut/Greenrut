import { User } from '../models/User.js'
import { config } from '../config/env.js'
import { seedAccountForUser } from './accountController.js'
import { createHttpError } from '../utils/httpError.js'
import { createToken, hashPassword, serializeUser, verifyPassword } from '../utils/auth.js'

function buildAuthResponse(user) {
  const token = createToken(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    config.jwtSecret,
    config.jwtExpiresIn
  )

  return {
    ok: true,
    user: serializeUser(user),
    token,
  }
}

async function findUserByEmail(email, includePassword = false) {
  const query = User.findOne({ email: String(email).trim().toLowerCase() })
  if (includePassword) {
    query.select('+passwordHash')
  }

  return query
}

async function loginWithRole(req, res, next, allowedRole) {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return next(createHttpError(400, 'Email and password are required'))
    }

    const user = await findUserByEmail(email, true)
    if (!user) {
      return next(createHttpError(401, 'Invalid credentials'))
    }

    if (allowedRole && user.role !== allowedRole) {
      return next(createHttpError(403, 'You do not have access to this account'))
    }

    if (user.status !== 'active') {
      return next(createHttpError(403, 'This account is inactive'))
    }

    const isValidPassword = verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return next(createHttpError(401, 'Invalid credentials'))
    }

    user.lastActive = new Date()
    await user.save()

    res.json(buildAuthResponse(user))
  } catch (error) {
    next(error)
  }
}

export async function signupUser(req, res, next) {
  try {
    const { name, email, password } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!name || !normalizedEmail || !password) {
      return next(createHttpError(400, 'Name, email and password are required'))
    }

    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      return next(createHttpError(409, 'An account with that email already exists'))
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: 'Viewer',
      status: 'active',
      lastActive: new Date(),
    })

    await seedAccountForUser(user._id)

    res.status(201).json(buildAuthResponse(user))
  } catch (error) {
    next(error)
  }
}

export function loginUser(req, res, next) {
  return loginWithRole(req, res, next, 'Viewer')
}

export async function signupAdmin(req, res, next) {
  try {
    const { name, email, password, signupKey } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!name || !normalizedEmail || !password) {
      return next(createHttpError(400, 'Name, email and password are required'))
    }

    if (config.adminSignupKey && signupKey !== config.adminSignupKey) {
      return next(createHttpError(403, 'Invalid admin signup key'))
    }

    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
      return next(createHttpError(409, 'An account with that email already exists'))
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      role: 'Administrator',
      status: 'active',
      lastActive: new Date(),
    })

    await seedAccountForUser(user._id)

    res.status(201).json(buildAuthResponse(user))
  } catch (error) {
    next(error)
  }
}

export function loginAdmin(req, res, next) {
  return loginWithRole(req, res, next, 'Administrator')
}

export async function getAuthUser(req, res, next) {
  try {
    const user = await User.findById(req.auth.sub)
    if (!user) {
      return next(createHttpError(404, 'Account not found'))
    }

    res.json({
      ok: true,
      user: serializeUser(user),
    })
  } catch (error) {
    next(error)
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body || {}

    if (!currentPassword || !newPassword) {
      return next(createHttpError(400, 'Current password and new password are required'))
    }

    if (String(newPassword).length < 6) {
      return next(createHttpError(400, 'New password must be at least 6 characters'))
    }

    const user = await User.findById(req.auth.sub).select('+passwordHash')
    if (!user) {
      return next(createHttpError(404, 'Account not found'))
    }

    const isValidPassword = verifyPassword(currentPassword, user.passwordHash)
    if (!isValidPassword) {
      return next(createHttpError(401, 'Current password is incorrect'))
    }

    user.passwordHash = hashPassword(String(newPassword))
    user.lastActive = new Date()
    await user.save()

    res.json({ ok: true })
  } catch (error) {
    next(error)
  }
}
