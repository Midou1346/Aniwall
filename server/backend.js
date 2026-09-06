/**
 * AniWalls Backend Server - Production Ready
 * 
 * Features:
 * - Express.js server with proper middleware
 * - SQLite database for permanent storage
 * - File upload with Multer
 * - REST API for wallpaper management
 * - CORS enabled for frontend access
 * - Error handling & validation
 * - Rate limiting
 * 
 * Run: npm install && npm start
 */

const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || '15081983';

// ============ DIRECTORIES ============
const uploadsDir = path.join(__dirname, 'public', 'wallpapers');
const dbDir = path.join(__dirname, 'data');

// Create directories if they don't exist
[uploadsDir, dbDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
app.use('/api/', limiter);

// ============ FILE UPLOAD CONFIGURATION ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'wallpaper-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, GIF) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: fileFilter
});

// ============ DATABASE INITIALIZATION ============
const db = new sqlite3.Database(
  path.join(dbDir, 'aniwalls.db'),
  (err) => {
    if (err) {
      console.error('Database error:', err);
    } else {
      console.log('Connected to SQLite database');
      initializeDatabase();
    }
  }
);

function initializeDatabase() {
  db.serialize(() => {
    // Wallpapers table
    db.run(`
      CREATE TABLE IF NOT EXISTS wallpapers (
        id TEXT PRIMARY KEY,
        ten TEXT NOT NULL,
        tar TEXT NOT NULL,
        anime TEXT NOT NULL,
        cat TEXT NOT NULL,
        tags TEXT NOT NULL,
        res TEXT NOT NULL,
        is4k INTEGER DEFAULT 0,
        rate TEXT DEFAULT '4.5',
        likes TEXT DEFAULT '0',
        dls INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        grad TEXT NOT NULL,
        img TEXT NOT NULL,
        mine INTEGER DEFAULT 0,
        isNew INTEGER DEFAULT 0,
        uploadedBy TEXT,
        uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Wallpapers table error:', err);
      else console.log('✓ Wallpapers table ready');
    });

    // Upload sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS upload_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        uploadedBy TEXT NOT NULL,
        uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        wallpaperId TEXT,
        FOREIGN KEY(wallpaperId) REFERENCES wallpapers(id)
      )
    `, (err) => {
      if (err) console.error('Upload logs table error:', err);
      else console.log('✓ Upload logs table ready');
    });

    // Admin actions log
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        wallpaperId TEXT,
        details TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Admin logs table error:', err);
      else console.log('✓ Admin logs table ready');
    });
  });
}

// ============ HELPER FUNCTIONS ============

// Generate unique ID
function generateId() {
  return 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Run database query (Promise wrapper)
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Get all rows from database
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Get single row from database
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// ============ API ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'AniWalls Backend v2.0'
  });
});

// Get all wallpapers
app.get('/api/wallpapers', async (req, res) => {
  try {
    const wallpapers = await dbAll('SELECT * FROM wallpapers ORDER BY uploadedAt DESC');
    
    // Parse JSON fields
    const parsed = wallpapers.map(wp => ({
      ...wp,
      tags: typeof wp.tags === 'string' ? JSON.parse(wp.tags) : wp.tags
    }));
    
    res.json({
      success: true,
      count: parsed.length,
      wallpapers: parsed,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallpapers',
      message: error.message
    });
  }
});

// Get single wallpaper
app.get('/api/wallpapers/:id', async (req, res) => {
  try {
    const wallpaper = await dbGet(
      'SELECT * FROM wallpapers WHERE id = ?',
      [req.params.id]
    );
    
    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        error: 'Wallpaper not found'
      });
    }
    
    wallpaper.tags = typeof wallpaper.tags === 'string' 
      ? JSON.parse(wallpaper.tags) 
      : wallpaper.tags;
    
    res.json({ success: true, wallpaper });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallpaper',
      message: error.message
    });
  }
});

// Upload wallpaper with file
app.post('/api/wallpapers/upload', upload.single('wallpaper'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { ten, tar, anime, cat, tags, res: resolution, is4k, grad } = req.body;

    // Validation
    if (!ten || !tar || !anime || !cat || !tags || !resolution) {
      fs.unlinkSync(req.file.path); // Delete uploaded file
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const id = generateId();
    const imgPath = `/wallpapers/${req.file.filename}`;

    const sql = `
      INSERT INTO wallpapers 
      (id, ten, tar, anime, cat, tags, res, is4k, grad, img, mine, isNew, uploadedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `;

    await dbRun(sql, [
      id,
      ten,
      tar,
      anime,
      cat,
      tags,
      resolution,
      is4k ? 1 : 0,
      grad || 'g1',
      imgPath,
      'admin'
    ]);

    // Log upload
    await dbRun(
      'INSERT INTO upload_logs (filename, uploadedBy, wallpaperId) VALUES (?, ?, ?)',
      [req.file.filename, 'admin', id]
    );

    // Log admin action
    await dbRun(
      'INSERT INTO admin_logs (action, wallpaperId, details) VALUES (?, ?, ?)',
      ['upload', id, `${ten} (${req.file.originalname})`]
    );

    res.json({
      success: true,
      wallpaper: {
        id,
        ten,
        tar,
        anime,
        cat,
        tags: JSON.parse(tags),
        res: resolution,
        is4k: is4k ? 1 : 0,
        rate: '4.5',
        likes: '0',
        dls: 0,
        featured: 0,
        grad: grad || 'g1',
        img: imgPath,
        mine: 1,
        isNew: 1,
        uploadedAt: new Date().toISOString()
      },
      message: 'Wallpaper uploaded successfully!'
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Upload wallpaper with base64
app.post('/api/wallpapers/upload-base64', async (req, res) => {
  try {
    const { ten, tar, anime, cat, tags, res: resolution, is4k, grad, image } = req.body;

    // Validation
    if (!ten || !tar || !anime || !cat || !tags || !resolution || !image) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Decode base64
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');

    if (binaryData.length > 50 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Image too large (max 50MB)'
      });
    }

    // Generate filename
    const filename = 'wallpaper-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7) + '.jpg';
    const filepath = path.join(uploadsDir, filename);

    // Write file
    fs.writeFileSync(filepath, binaryData);

    // Save to database
    const id = generateId();
    const imgPath = `/wallpapers/${filename}`;

    const sql = `
      INSERT INTO wallpapers 
      (id, ten, tar, anime, cat, tags, res, is4k, grad, img, mine, isNew, uploadedBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?)
    `;

    await dbRun(sql, [
      id,
      ten,
      tar,
      anime,
      cat,
      tags,
      resolution,
      is4k ? 1 : 0,
      grad || 'g1',
      imgPath,
      'admin'
    ]);

    res.json({
      success: true,
      wallpaper: {
        id,
        ten,
        tar,
        anime,
        cat,
        tags: JSON.parse(tags),
        res: resolution,
        is4k: is4k ? 1 : 0,
        rate: '4.5',
        likes: '0',
        dls: 0,
        featured: 0,
        grad: grad || 'g1',
        img: imgPath,
        mine: 1,
        isNew: 1,
        uploadedAt: new Date().toISOString()
      },
      message: 'Wallpaper uploaded successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Upload failed',
      message: error.message
    });
  }
});

// Update wallpaper
app.put('/api/wallpapers/:id', async (req, res) => {
  try {
    const { ten, tar, anime, cat, tags, res: resolution, is4k, rate, likes, dls, featured } = req.body;

    const wallpaper = await dbGet('SELECT * FROM wallpapers WHERE id = ?', [req.params.id]);
    
    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        error: 'Wallpaper not found'
      });
    }

    const updates = {
      ten: ten || wallpaper.ten,
      tar: tar || wallpaper.tar,
      anime: anime || wallpaper.anime,
      cat: cat || wallpaper.cat,
      tags: tags || wallpaper.tags,
      res: resolution || wallpaper.res,
      is4k: is4k !== undefined ? (is4k ? 1 : 0) : wallpaper.is4k,
      rate: rate || wallpaper.rate,
      likes: likes || wallpaper.likes,
      dls: dls !== undefined ? dls : wallpaper.dls,
      featured: featured !== undefined ? (featured ? 1 : 0) : wallpaper.featured
    };

    const sql = `
      UPDATE wallpapers 
      SET ten=?, tar=?, anime=?, cat=?, tags=?, res=?, is4k=?, rate=?, likes=?, dls=?, featured=?, updatedAt=CURRENT_TIMESTAMP
      WHERE id=?
    `;

    await dbRun(sql, [
      updates.ten,
      updates.tar,
      updates.anime,
      updates.cat,
      updates.tags,
      updates.res,
      updates.is4k,
      updates.rate,
      updates.likes,
      updates.dls,
      updates.featured,
      req.params.id
    ]);

    res.json({
      success: true,
      message: 'Wallpaper updated successfully',
      wallpaper: { ...wallpaper, ...updates }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update wallpaper',
      message: error.message
    });
  }
});

// Delete wallpaper
app.delete('/api/wallpapers/:id', async (req, res) => {
  try {
    const wallpaper = await dbGet('SELECT * FROM wallpapers WHERE id = ?', [req.params.id]);
    
    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        error: 'Wallpaper not found'
      });
    }

    // Delete image file
    const imgPath = path.join(__dirname, 'public', wallpaper.img);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }

    // Delete from database
    await dbRun('DELETE FROM wallpapers WHERE id = ?', [req.params.id]);

    // Log admin action
    await dbRun(
      'INSERT INTO admin_logs (action, wallpaperId, details) VALUES (?, ?, ?)',
      ['delete', req.params.id, `${wallpaper.ten}`]
    );

    res.json({
      success: true,
      message: 'Wallpaper deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete wallpaper',
      message: error.message
    });
  }
});

// Increment download count
app.post('/api/wallpapers/:id/download', async (req, res) => {
  try {
    const wallpaper = await dbGet('SELECT * FROM wallpapers WHERE id = ?', [req.params.id]);
    
    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        error: 'Wallpaper not found'
      });
    }

    const newDls = (wallpaper.dls || 0) + 1;
    
    await dbRun(
      'UPDATE wallpapers SET dls = ? WHERE id = ?',
      [newDls, req.params.id]
    );

    res.json({
      success: true,
      message: 'Download count updated',
      dls: newDls
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update download count',
      message: error.message
    });
  }
});

// Verify admin access
app.post('/api/admin/verify', (req, res) => {
  const { passcode } = req.body;
  
  if (!passcode) {
    return res.status(400).json({
      success: false,
      error: 'Passcode required'
    });
  }

  if (passcode === ADMIN_PASS) {
    res.json({
      success: true,
      message: 'Admin access granted',
      token: Buffer.from(ADMIN_PASS).toString('base64')
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid passcode'
    });
  }
});

// Get statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalWallpapers = await dbGet('SELECT COUNT(*) as count FROM wallpapers');
    const userUploads = await dbGet('SELECT COUNT(*) as count FROM wallpapers WHERE mine = 1');
    const totalDownloads = await dbGet('SELECT SUM(dls) as total FROM wallpapers');

    res.json({
      success: true,
      stats: {
        total: totalWallpapers?.count || 0,
        mine: userUploads?.count || 0,
        dls: totalDownloads?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// Get admin logs
app.get('/api/admin/logs', async (req, res) => {
  try {
    const logs = await dbAll(
      'SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT 100'
    );
    
    res.json({
      success: true,
      logs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
      message: error.message
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    type: err.name
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║        🚀 AniWalls Backend Server Started!           ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  API Base:    http://localhost:${PORT}                ║
║  App:         http://localhost:${PORT}/               ║
║  Health:      http://localhost:${PORT}/api/health     ║
║  Wallpapers:  http://localhost:${PORT}/api/wallpapers ║
║                                                        ║
║  Database:    SQLite (${path.join(dbDir, 'aniwalls.db')})
║  Uploads:     ${uploadsDir}                           ║
║                                                        ║
║  Admin Pass:  ${ADMIN_PASS}                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  db.close((err) => {
    if (err) console.error(err);
    else console.log('Database connection closed');
    process.exit(0);
  });
});

module.exports = app;
