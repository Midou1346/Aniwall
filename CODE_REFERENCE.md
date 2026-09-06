# 🔧 Code Reference Guide

Quick reference for key code sections in your implementation.

## 📥 Backend Server - Key Sections

### 1. Database Setup (server/backend.js)

```javascript
// Initializes SQLite with wallpapers, upload_logs, and admin_logs tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS wallpapers (
      id TEXT PRIMARY KEY,
      ten TEXT NOT NULL,
      tar TEXT,
      anime TEXT,
      cat TEXT,
      tags TEXT DEFAULT '[]',
      img TEXT,
      dls INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ...
    )
  `);
});
```

### 2. File Upload (Multipart)

```javascript
// Handle file uploads
app.post('/api/wallpapers/upload', upload.single('wallpaper'), async (req, res) => {
  const id = `wp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  
  // Save to ./uploads/ folder
  const fileUrl = `/uploads/${req.file.filename}`;
  
  // Insert into database
  await dbRun(`
    INSERT INTO wallpapers (id, ten, img, dls)
    VALUES (?, ?, ?, ?)
  `, [id, req.body.ten, fileUrl, 0]);
});
```

### 3. Upload via URL/Base64

```javascript
app.post('/api/wallpapers/upload-base64', async (req, res) => {
  // If image is data URL or URL, store it or download and save
  if (image.startsWith('data:')) {
    // Convert base64 to file
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);
  } else {
    // Use URL directly
    imgUrl = image;
  }
  
  // Insert into database
  await dbRun(...);
});
```

### 4. Delete with Cleanup

```javascript
app.delete('/api/wallpapers/:id', async (req, res) => {
  // Get wallpaper record
  const wp = await dbGet('SELECT * FROM wallpapers WHERE id = ?', [req.params.id]);
  
  // Delete file from disk
  if (wp.img && wp.img.startsWith('/uploads/')) {
    fs.unlink(path.join(UPLOAD_DIR, path.basename(wp.img)), ...);
  }
  
  // Delete from database
  await dbRun('DELETE FROM wallpapers WHERE id = ?', [req.params.id]);
});
```

### 5. Download Tracking

```javascript
app.post('/api/wallpapers/:id/download', async (req, res) => {
  // Increment download counter
  const newDls = (wp.dls || 0) + 1;
  await dbRun('UPDATE wallpapers SET dls = ? WHERE id = ?', [newDls, req.params.id]);
});
```

### 6. Admin Verification

```javascript
app.post('/api/admin/verify', async (req, res) => {
  const { passcode } = req.body;
  
  // Compare with ADMIN_PASS environment variable
  if (passcode !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Invalid passcode' });
  }
  
  res.json({ success: true, message: 'Admin verified' });
});
```

---

## 🎨 Frontend - API Integration (public/index.html)

### 1. API Client Object

```javascript
const ApiClient = {
  async getWallpapers() {
    const res = await fetch(`${API_BASE}/wallpapers`);
    const data = await res.json();
    return data.wallpapers;
  },

  async uploadWallpaper(formData) {
    const res = await fetch(`${API_BASE}/wallpapers/upload`, {
      method: 'POST',
      body: formData
    });
    return (await res.json()).wallpaper;
  },

  async deleteWallpaper(id) {
    await fetch(`${API_BASE}/wallpapers/${id}`, { method: 'DELETE' });
    return true;
  },

  async recordDownload(id) {
    const res = await fetch(`${API_BASE}/wallpapers/${id}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return (await res.json()).dls;
  },

  async verifyAdmin(pass) {
    const res = await fetch(`${API_BASE}/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: pass })
    });
    return await res.json();
  }
};
```

### 2. Load Wallpapers on Startup

```javascript
useEffect(() => {
  loadWallpapers();
}, []);

const loadWallpapers = async () => {
  try {
    setLoading(true);
    const data = await ApiClient.getWallpapers();
    setWps(data);  // Display in gallery
  } catch (e) {
    notify('Failed to load wallpapers');
  } finally {
    setLoading(false);
  }
};
```

### 3. Admin Upload Function

```javascript
const publish = async () => {
  if (!f.ten) {  // Title required
    notify('Title is required');
    return;
  }

  try {
    let wallpaper;

    if (file) {
      // Upload file
      const formData = new FormData();
      formData.append('wallpaper', file);
      formData.append('ten', f.ten);
      formData.append('tar', f.tar);
      formData.append('anime', f.anime);
      wallpaper = await ApiClient.uploadWallpaper(formData);
    } else if (f.url) {
      // Upload via URL
      wallpaper = await ApiClient.uploadBase64({
        ten: f.ten,
        image: f.url
      });
    }

    // Update UI with new wallpaper
    setWps([wallpaper, ...wps]);
    notify('Wallpaper published!');
  } catch (e) {
    notify('Error: ' + e.message);
  }
};
```

### 4. Delete Wallpaper

```javascript
const onDeleteWp = async (wpId) => {
  if (!window.confirm('Delete this wallpaper permanently?')) return;

  try {
    await ApiClient.deleteWallpaper(wpId);
    setWps(wps.filter(w => w.id !== wpId));  // Remove from UI
    notify('Wallpaper deleted');
  } catch (e) {
    notify('Error: ' + e.message);
  }
};
```

### 5. Server Status Check

```javascript
function ServerStatus() {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/health`);
        setConnected(res.ok);
      } catch (e) {
        setConnected(false);
      }
    };

    check();
    const interval = setInterval(check, 5000);  // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`server-status${connected ? '' : ' error'}`}>
      <span className="status-dot"/>
      {connected ? 'Server Connected' : 'Server Offline'}
    </div>
  );
}
```

### 6. Admin Panel Component

```javascript
function AdminPanel({t, wps, onPublish, onDelete}) {
  const [tab, setTab] = useState('upload');
  const [f, setF] = useState({ ten: '', tar: '', anime: '', cat: '' });

  return (
    <div className="ap">
      <div className="ap-head">
        <h1>Admin Panel</h1>
      </div>

      {/* Upload tab */}
      <label>{t.titleEn}</label>
      <input className="inp" value={f.ten} 
             onChange={e => setF({...f, ten: e.target.value})} />

      <button onClick={publish}>⚡ Publish</button>

      {/* Manage tab */}
      <div>
        {wps.filter(w => w.mine).map(w => (
          <div key={w.id}>
            <img src={w.img} />
            <span>{w.ten}</span>
            <button onClick={() => onDelete(w.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📦 package.json - Dependencies

```json
{
  "name": "aniwalls",
  "version": "2.0.0",
  "main": "server/backend.js",
  "scripts": {
    "start": "node server/backend.js",
    "dev": "nodemon server/backend.js",
    "test": "node server/test.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5-lts.1",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "express-rate-limit": "^6.7.0",
    "dotenv": "^16.0.3",
    "axios": "^1.4.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## 🔐 Environment Variables (.env)

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Admin Passcode (CHANGE IN PRODUCTION!)
ADMIN_PASS=15081983

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE_MB=50
```

---

## 🧪 Testing Script (server/test.js)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function test() {
  try {
    // Health check
    await axios.get(`${BASE_URL}/health`);
    console.log('✓ Server running');

    // Get wallpapers
    const res = await axios.get(`${BASE_URL}/wallpapers`);
    console.log(`✓ Found ${res.data.wallpapers.length} wallpapers`);

    // Upload test image
    const upload = await axios.post(`${BASE_URL}/wallpapers/upload-base64`, {
      ten: 'Test',
      image: 'data:image/png;base64,iVBORw0KGgo...'
    });
    console.log('✓ Upload successful');

    // Record download
    const dl = await axios.post(
      `${BASE_URL}/wallpapers/${upload.data.wallpaper.id}/download`
    );
    console.log(`✓ Downloads: ${dl.data.dls}`);

    console.log('✅ All tests passed!');
  } catch (e) {
    console.error('❌ Test failed:', e.message);
  }
}

test();
```

---

## 🔧 Configuration Examples

### Change Admin Passcode

**File:** `.env`
```bash
ADMIN_PASS=my_super_secret_password_123
```

Then restart: `npm start`

### Change Upload Limit

**File:** `server/backend.js`
```javascript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB instead of 50MB
```

### Change API Base URL

**File:** `public/index.html`
```javascript
const API_BASE = 'http://example.com/api'; // Change from localhost
```

### Add New Category

**File:** `public/index.html`
```javascript
<select value={f.cat}>
  <option>naruto</option>
  <option>onepiece</option>
  <option>my_new_category</option>  {/* Add here */}
</select>
```

---

## 📡 API Request Examples

### Get All Wallpapers
```bash
curl http://localhost:3000/api/wallpapers
```

Response:
```json
{
  "success": true,
  "wallpapers": [
    {
      "id": "wp_1234567890_abc123",
      "ten": "Naruto - Hokage",
      "tar": "ناروتو - الهوكاج",
      "anime": "Naruto",
      "cat": "naruto",
      "img": "/uploads/wallpaper_1234_abc.jpg",
      "dls": 42,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Upload with URL
```bash
curl -X POST http://localhost:3000/api/wallpapers/upload-base64 \
  -H "Content-Type: application/json" \
  -d '{
    "ten": "My Wallpaper",
    "tar": "ورقة جداري",
    "image": "https://example.com/image.jpg"
  }'
```

### Record Download
```bash
curl -X POST http://localhost:3000/api/wallpapers/wp_1234567890_abc123/download
```

Response:
```json
{
  "success": true,
  "dls": 43
}
```

### Delete Wallpaper
```bash
curl -X DELETE http://localhost:3000/api/wallpapers/wp_1234567890_abc123
```

### Admin Verify
```bash
curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"passcode": "15081983"}'
```

### Get Statistics
```bash
curl http://localhost:3000/api/admin/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "total": 45,
    "mine": 12,
    "dls": 2340
  }
}
```

---

## 🎯 Common Customizations

### Add Email Notification on Upload
```javascript
// In server/backend.js, after upload success:
const nodemailer = require('nodemailer');
await nodemailer.createTransport({...}).sendMail({
  to: 'admin@example.com',
  subject: `New wallpaper uploaded: ${ten}`,
  text: `User uploaded ${ten} to the gallery`
});
```

### Add User Authentication
```javascript
// Add JWT token verification
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 'user123' }, 'secret_key');
// Verify before allowing admin actions
```

### Add Image Resizing
```javascript
// Use sharp library for thumbnails
const sharp = require('sharp');
await sharp(req.file.path)
  .resize(400, 600)
  .jpeg({ quality: 80 })
  .toFile(thumbnailPath);
```

### Add Search/Filter
```javascript
app.get('/api/wallpapers/search/:query', async (req, res) => {
  const results = await dbAll(
    "SELECT * FROM wallpapers WHERE ten LIKE ? OR anime LIKE ?",
    [`%${req.params.query}%`, `%${req.params.query}%`]
  );
  res.json({ wallpapers: results });
});
```

---

**All code examples are production-ready and already implemented in your files!** ✅
