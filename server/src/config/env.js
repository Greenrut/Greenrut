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

const clientOrigins = parseOrigins(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN)

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: clientOrigins[0] || defaultClientOrigins[0],
  clientOrigins: clientOrigins.length ? clientOrigins : defaultClientOrigins,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  mongoDbName: process.env.MONGODB_DB || '',
  jwtSecret: process.env.JWT_SECRET || 'greenrut-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminSignupKey: process.env.ADMIN_SIGNUP_KEY || '',
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
  },
}
