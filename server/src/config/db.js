import mongoose from 'mongoose'
import { config } from './env.js'

export async function connectDatabase() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is required')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(config.mongoUri, {
    dbName: config.mongoDbName || undefined,
  })
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}
