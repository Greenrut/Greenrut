import { v2 as cloudinary } from 'cloudinary'
import { config } from './env.js'

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
})

export { cloudinary }

export function isCloudinaryConfigured() {
  const hasCloudName = Boolean(config.cloudinary.cloudName)
  const hasSignedCredentials = Boolean(config.cloudinary.apiKey && config.cloudinary.apiSecret)
  const hasUnsignedPreset = Boolean(config.cloudinary.uploadPreset)
  return hasCloudName && (hasSignedCredentials || hasUnsignedPreset)
}
