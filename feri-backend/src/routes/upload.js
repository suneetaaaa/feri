// FERI — Cloudinary Upload Routes
const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { authenticate } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','video/mp4','video/mov','video/quicktime'];
    cb(null, allowed.includes(file.mimetype));
  }
});

const uploadToCloudinary = (buffer, options) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
    if (error) reject(error);
    else resolve(result);
  });
  stream.end(buffer);
});

// POST /api/upload/images
router.post('/images', authenticate, upload.array('images', 8), async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const results = await Promise.all(
      req.files.map(file =>
        uploadToCloudinary(file.buffer, {
          folder: 'feri/products',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
          ]
        })
      )
    );

    res.json({
      urls: results.map(r => r.secure_url),
      cloudinaryIds: results.map(r => r.public_id)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// POST /api/upload/video
router.post('/video', authenticate, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No video uploaded' });

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'feri/videos',
      resource_type: 'video',
      transformation: [{ quality: 'auto' }]
    });

    res.json({ url: result.secure_url, cloudinaryId: result.public_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Video upload failed' });
  }
});

// POST /api/upload/avatar
router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'feri/avatars',
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]
    });
    res.json({ url: result.secure_url, cloudinaryId: result.public_id });
  } catch (err) {
    res.status(500).json({ error: 'Avatar upload failed' });
  }
});

module.exports = router;
