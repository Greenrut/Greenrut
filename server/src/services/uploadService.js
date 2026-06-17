import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary.js'

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

    stream.end(buffer)
  })
}

export async function uploadImage(buffer, options = {}) {
  if (!isCloudinaryConfigured()) {
    const error = new Error('Cloudinary is not configured')
    error.status = 503
    throw error
  }

  return uploadBuffer(buffer, {
    folder: options.folder,
    resource_type: 'image',
  })
}

export async function uploadImages(buffers, options = {}) {
  if (!Array.isArray(buffers) || buffers.length === 0) {
    return []
  }

  const uploads = await Promise.all(buffers.map((buffer) => uploadImage(buffer, options)))
  return uploads
}
