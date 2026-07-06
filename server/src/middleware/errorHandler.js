import multer from 'multer'

export function errorHandler(err, _req, res, _next) {
  const status =
    err?.status ||
    (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE' ? 413 : 500)

  const message =
    err?.message ||
    (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE'
      ? 'Image is too large. Please upload a file smaller than 10 MB.'
      : 'Internal Server Error')

  res.status(status).json({
    ok: false,
    error: message,
  })
}
