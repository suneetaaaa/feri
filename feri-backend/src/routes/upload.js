const router = require('express').Router()
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { authenticate } = require('../middleware/auth')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/jpg','video/mp4','video/mov','video/quicktime']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('File type not allowed'), false)
    }
  }
})

const uploadToCloudinary = (buffer, options) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
    if (error) reject(error)
    else resolve(result)
  })
  stream.end(buffer)
})

// POST /api/upload/images
router.post('/images', authenticate, (req, res) => {
  upload.array('images', 8)(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err)
      return res.status(400).json({ error: err.message || 'Upload error' })
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }
    try {
      const results = await Promise.all(
        req.files.map(file =>
          uploadToCloudinary(file.buffer, {
            folder: 'feri/products',
            resource_type: 'image',
            transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
          })
        )
      )
      res.json({
        urls: results.map(r => r.secure_url),
        cloudinaryIds: results.map(r => r.public_id)
      })
    } catch (error) {
      console.error('Cloudinary error:', error)
      res.status(500).json({ error: 'Image upload failed: ' + error.message })
    }
  })
})

// POST /api/upload/video
router.post('/video', authenticate, (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' })
    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'feri/videos',
        resource_type: 'video',
        transformation: [{ quality: 'auto' }]
      })
      res.json({ url: result.secure_url, cloudinaryId: result.public_id })
    } catch (error) {
      res.status(500).json({ error: 'Video upload failed' })
    }
  })
})

// POST /api/upload/avatar
router.post('/avatar', authenticate, (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'feri/avatars',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
      })
      res.json({ url: result.secure_url, cloudinaryId: result.public_id })
    } catch (error) {
      res.status(500).json({ error: 'Avatar upload failed' })
    }
  })
})

module.exports = router
