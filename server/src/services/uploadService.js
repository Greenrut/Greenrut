import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js'
import { config } from '../config/env.js'
import { createHttpError } from '../utils/httpError.js'

function getExtension(filename = '', mimetype = '') {
  const ext = path.extname(filename).toLowerCase()
  if (ext) return ext

  if (mimetype === 'image/png') return '.png'
  if (mimetype === 'image/webp') return '.webp'
  if (mimetype === 'image/gif') return '.gif'
  return '.jpg'
}

function toUploadFile(file, index = 0) {
  if (!file) return null

  if (Buffer.isBuffer(file)) {
    return {
      buffer: file,
      originalname: `upload-${index + 1}.jpg`,
      mimetype: 'image/jpeg',
    }
  }

  if (file.buffer) {
    return file
  }

  return null
}

function buildLocalUrl(baseUrl, folder, filename) {
  const origin = String(baseUrl || 'https://greenrut.onrender.com').replace(/\/$/, '')
  const safeFolder = String(folder || 'uploads').replace(/^\/+|\/+$/g, '')
  return `${origin}/uploads/${safeFolder}/${filename}`
}

async function uploadToLocal(file, options = {}) {
  const folder = String(options.folder || 'greenrut').replace(/^\/+|\/+$/g, '')
  const uploadRoot = path.resolve(process.cwd(), 'uploads', folder)
  await mkdir(uploadRoot, { recursive: true })

  const filename = `${Date.now()}-${randomUUID()}${getExtension(file.originalname, file.mimetype)}`
  const fullPath = path.join(uploadRoot, filename)
  await writeFile(fullPath, file.buffer)

  return {
    secure_url: buildLocalUrl(options.baseUrl, folder, filename),
    public_id: `${folder}/${filename}`,
    width: null,
    height: null,
    resource_type: 'image',
    format: path.extname(filename).slice(1) || 'jpg',
    provider: 'local',
  }
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: options.resource_type || 'image',
        ...(options.upload_preset ? { upload_preset: options.upload_preset } : {}),
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    stream.on?.('error', reject)
    stream.end(buffer)
  })
}

async function uploadWithCloudinarySigned(file, options = {}) {
  const result = await uploadBuffer(file.buffer, {
    folder: options.folder,
    resource_type: 'image',
  })

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    resource_type: result.resource_type,
    format: result.format,
    provider: 'cloudinary',
  }
}

async function uploadWithCloudinaryUnsigned(file, options = {}) {
  const uploadPreset = options.uploadPreset || options.upload_preset || config.cloudinary.uploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET || ''
  if (!uploadPreset) {
    throw createHttpError(500, 'Cloudinary upload preset is not configured')
  }

  const result = await uploadBuffer(file.buffer, {
    folder: options.folder,
    resource_type: 'image',
    upload_preset: uploadPreset,
  })

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height,
    resource_type: result.resource_type,
    format: result.format,
    provider: 'cloudinary',
  }
}

function getCloudinaryUploadPreset(options = {}) {
  return options.uploadPreset || options.upload_preset || config.cloudinary.uploadPreset || process.env.CLOUDINARY_UPLOAD_PRESET || ''
}

export async function uploadImage(file, options = {}) {
  const uploadFile = toUploadFile(file)
  if (!uploadFile?.buffer) {
    throw createHttpError(400, 'Image file is required')
  }

  const uploadPreset = getCloudinaryUploadPreset(options)

  if (isCloudinaryConfigured()) {
    try {
      const hasSignedCredentials = Boolean(config.cloudinary.apiKey && config.cloudinary.apiSecret)

      if (hasSignedCredentials) {
        return await uploadWithCloudinarySigned(uploadFile, options)
      }

      return await uploadWithCloudinaryUnsigned(uploadFile, { ...options, uploadPreset })
    } catch (error) {
      if (uploadPreset) {
        try {
          return await uploadWithCloudinaryUnsigned(uploadFile, { ...options, uploadPreset })
        } catch (unsignedError) {
          if (process.env.NODE_ENV === 'production') {
            throw createHttpError(502, `Cloudinary upload failed: ${unsignedError?.message || error?.message || 'Unknown error'}`)
          }
        }
      }

      if (process.env.NODE_ENV === 'production') {
        throw createHttpError(502, `Cloudinary upload failed: ${error?.message || 'Unknown error'}`)
      }

      console.warn('Cloudinary upload failed, using local fallback:', error?.message || error)
      return uploadToLocal(uploadFile, options)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw createHttpError(500, 'Cloudinary is not configured on the server')
  }

  return uploadToLocal(uploadFile, options)
}

export async function uploadImages(files, options = {}) {
  if (!Array.isArray(files) || files.length === 0) {
    return []
  }

  const uploads = await Promise.all(files.map((file, index) => uploadImage(toUploadFile(file, index), options)))
  return uploads
}
