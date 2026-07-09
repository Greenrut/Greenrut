import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js'

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

async function uploadWithCloudinary(file, options = {}) {
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

export async function uploadImage(file, options = {}) {
  const uploadFile = toUploadFile(file)
  if (!uploadFile?.buffer) {
    const error = new Error('Image file is required')
    error.status = 400
    throw error
  }

  if (isCloudinaryConfigured()) {
    try {
      return await uploadWithCloudinary(uploadFile, options)
    } catch (error) {
      console.warn('Cloudinary upload failed, using local fallback:', error?.message || error)
      return uploadToLocal(uploadFile, options)
    }
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


