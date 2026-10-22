const path = require('path');
const multer = require('multer');
const fs = require('fs');

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname || '').toLowerCase();
    const ext = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.png';
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const rawExt = path.extname(file.originalname || '').toLowerCase();
    if (file.mimetype.startsWith('image/') && ALLOWED_EXTENSIONS.has(rawExt)) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files (JPG, PNG, WebP, SVG, GIF) are allowed'), false);
    }
  }
});

const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const baseUrl = process.env.UPLOAD_BASE_URL || '';
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, url });
};

module.exports = {
  upload,
  handleImageUpload,
  uploadsDir
};
