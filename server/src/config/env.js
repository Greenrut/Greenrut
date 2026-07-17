import dotenv from 'dotenv'

dotenv.config()

function parseOrigins(value) {
  return String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const defaultClientOrigins = [
  'https://www.greenrut.com',
  'https://greenrut.com',
  'https://greenrut.onrender.com',
  'http://localhost:5173',
]

const configuredClientOrigins = parseOrigins(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN)
const clientOrigins = Array.from(new Set([...defaultClientOrigins, ...configuredClientOrigins]))

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: clientOrigins[0] || defaultClientOrigins[0],
  clientUrl: String(process.env.CLIENT_URL || process.env.CLIENT_ORIGIN || clientOrigins[0] || defaultClientOrigins[0]).replace(/\/$/, ''),
  clientOrigins,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDbName: process.env.MONGODB_DB || '',
  jwtSecret: process.env.JWT_SECRET || 'greenrut-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSignupKey: process.env.ADMIN_SIGNUP_KEY || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    rejectUnauthorized: String(process.env.SMTP_REJECT_UNAUTHORIZED || 'true').toLowerCase() !== 'false',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.MAIL_FROM || 'Greenrut <no-reply@greenrut.com>',
  },
  paystack: {
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || '',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    folder: process.env.CLOUDINARY_FOLDER || 'greenrut',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
  },
}

