import crypto from 'node:crypto'
import { User } from '../models/User.js'
import { config } from '../config/env.js'
import { seedAccountForUser } from './accountController.js'
import { createHttpError } from '../utils/httpError.js'
import { createToken, hashPassword, serializeUser, verifyPassword } from '../utils/auth.js'
import { sendEmail } from '../services/emailService.js'

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

async function findUserByEmail(email, includePassword = false, role = '') {
  const query = User.findOne({ email: String(email).trim().toLowerCase(), ...(role ? { role } : {}) })
  if (includePassword) {
    query.select('+passwordHash +resetPasswordTokenHash +resetPasswordExpires')
  }

  return query
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(String(token || '')).digest('hex')
}

function buildResetLink({ token, email, role }) {
  const params = new URLSearchParams({ token, email, role })
  return `${config.clientUrl}/reset-password?${params.toString()}`
}

async function sendPasswordResetEmail({ user, token, role }) {
  const resetLink = buildResetLink({ token, email: user.email, role })
  const appName = 'Greenrut'

  const subject = `${appName} password reset`
  const text = [
    `Hi ${user.name || 'there'},`,
    '',
    `We received a request to reset your ${appName} password.`,
    `Reset your password here: ${resetLink}`,
    '',
    'If you did not request this, you can ignore this email.',
    '',
    'This link expires in 1 hour.',
  ].join('\n')

  const html = `
    <p>Hi ${user.name || 'there'},</p>
    <p>We received a request to reset your ${appName} password.</p>
    <p><a href="${resetLink}">Reset your password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
    <p>This link expires in 1 hour.</p>
  `

  try {
    await sendEmail({
      to: user.email,
      subject,
      text,
      html,
    })
  } catch (error) {
    console.error('Password reset email failed:', {
      email: user.email,
      role,
      message: error?.message,
    })
    if (config.resend.apiKey) {
      throw createHttpError(502, 'Password reset email could not be sent')
    }
  }

  return resetLink
}

async function loginWithRole(req, res, next, allowedRole) {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return next(createHttpError(400, 'Email and password are required'))
    }

    const user = await findUserByEmail(email, true, allowedRole)
    if (!user) {
      return next(createHttpError(401, 'Invalid credentials'))
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

async function requestPasswordResetWithRole(req, res, next, role) {
  try {
    const { email } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail) {
      return next(createHttpError(400, 'Email is required'))
    }

    const user = await findUserByEmail(normalizedEmail, true, role)
    if (!user || user.status !== 'active') {
      return res.json({ ok: true, message: 'If the account exists, a reset link will be sent shortly.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordTokenHash = hashResetToken(token)
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    const resetLink = await sendPasswordResetEmail({ user, token, role: role === 'Administrator' ? 'admin' : 'user' })

    res.json({
      ok: true,
      message: 'If the account exists, a reset link will be sent shortly.',
      ...(config.nodeEnv !== 'production' ? { debugResetLink: resetLink } : {}),
    })
  } catch (error) {
    next(error)
  }
}

async function resetPasswordWithRole(req, res, next, role) {
  try {
    const { email, token, newPassword } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!normalizedEmail || !token || !newPassword) {
      return next(createHttpError(400, 'Email, token, and new password are required'))
    }

    if (String(newPassword).length < 6) {
      return next(createHttpError(400, 'New password must be at least 6 characters'))
    }

    const user = await findUserByEmail(normalizedEmail, true, role)
    if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpires) {
      return next(createHttpError(400, 'The reset link is invalid or has expired'))
    }

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      return next(createHttpError(400, 'The reset link is invalid or has expired'))
    }

    if (user.resetPasswordTokenHash !== hashResetToken(token)) {
      return next(createHttpError(400, 'The reset link is invalid or has expired'))
    }

    user.passwordHash = hashPassword(String(newPassword))
    user.resetPasswordTokenHash = ''
    user.resetPasswordExpires = null
    user.lastActive = new Date()
    await user.save()

    res.json({ ok: true, message: 'Password updated successfully.' })
  } catch (error) {
    next(error)
  }
}

export function forgotPassword(req, res, next) {
  return requestPasswordResetWithRole(req, res, next, 'Viewer')
}

export function adminForgotPassword(req, res, next) {
  return requestPasswordResetWithRole(req, res, next, 'Administrator')
}

export function resetPassword(req, res, next) {
  return resetPasswordWithRole(req, res, next, 'Viewer')
}

export function adminResetPassword(req, res, next) {
  return resetPasswordWithRole(req, res, next, 'Administrator')
}
