import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { config } from './config/env.js'
import apiRouter from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

const devLocalhostPattern = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/
const uploadsDir = path.resolve(process.cwd(), 'uploads')
const allowedOrigins = new Set(
  (config.clientOrigins || [config.clientOrigin])
    .filter(Boolean)
    .map((origin) => String(origin).replace(/\/$/, '')),
)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (config.nodeEnv !== 'production' && devLocalhostPattern.test(origin)) {
      return callback(null, true)
    }
    const normalizedOrigin = String(origin).replace(/\/$/, '')
    if (allowedOrigins.has(normalizedOrigin)) return callback(null, true)
    return callback(null, false)
  },
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json({ limit: '2mb' }))
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'greenrut-api',
    env: config.nodeEnv,
  })
})

app.use('/api', apiRouter)

app.use(notFound)
app.use(errorHandler)

export default app
