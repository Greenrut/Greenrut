import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import apiRouter from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

const devLocalhostPattern = /^http:\/\/localhost(:\d+)?$/

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, Postman)
      if (!origin) return callback(null, true)
      // In development, allow any localhost port so Vite can use 5173, 5174, etc.
      if (config.nodeEnv !== 'production' && devLocalhostPattern.test(origin)) {
        return callback(null, true)
      }
      // In production, only allow the configured CLIENT_ORIGIN
      if (origin === config.clientOrigin) return callback(null, true)
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '2mb' }))

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
