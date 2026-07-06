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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (config.nodeEnv !== 'production' && devLocalhostPattern.test(origin)) {
        return callback(null, true)
      }
      if (origin === config.clientOrigin) return callback(null, true)
      return callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true,
  })
)
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
