// Simple Express.js Upload Server for AniWalls
// Run with: node upload-server.js
// Access at: http://localhost:3000

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '..')));
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wallpaper-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Only allow images
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Upload endpoint
app.post('/api/upload', upload.single('wallpaper'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    timestamp: new Date().toISOString()
  });
});

// Base64 upload endpoint
app.post('/api/upload-base64', (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  try {
    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const filename = 'wallpaper-' + Date.now() + '.jpg';
    const filepath = path.join(uploadsDir, filename);

    // Write file
    fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));

    res.json({
      success: true,
      url: `/uploads/${filename}`,
      filename: filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Get all wallpapers
app.get('/api/wallpapers', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read wallpapers' });
    }

    const wallpapers = files.map(file => ({
      filename: file,
      url: `/uploads/${file}`,
      uploaded: fs.statSync(path.join(uploadsDir, file)).birthtime
    }));

    res.json({ wallpapers, count: wallpapers.length });
  });
});

// Delete wallpaper
app.delete('/api/wallpapers/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(uploadsDir, filename);

  // Security: prevent directory traversal
  if (!filepath.startsWith(uploadsDir)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  fs.unlink(filepath, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.json({ success: true, message: 'Wallpaper deleted' });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AniWalls Upload Server 🚀           ║
╠════════════════════════════════════════╣
║                                        ║
║  Server running at:                    ║
║  👉 http://localhost:${PORT}              ║
║                                        ║
║  Upload endpoint: POST /api/upload     ║
║  List wallpapers: GET /api/wallpapers  ║
║  Delete: DELETE /api/wallpapers/:file  ║
║                                        ║
║  Uploads saved to: ${uploadsDir}       ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nServer shutting down...');
  process.exit(0);
});
