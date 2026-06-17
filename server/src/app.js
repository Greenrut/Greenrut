import express from 'express'
import cors from 'cors'
import { config } from './config/env.js'
import apiRouter from './routes/index.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: config.clientOrigin,
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
