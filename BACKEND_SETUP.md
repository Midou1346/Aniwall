# AniWalls Backend Server Setup Guide

Complete Node.js + Express + SQLite backend for the AniWalls anime wallpaper app with permanent storage, file uploads, and real-time sync.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This installs:
- **express** - Web server framework
- **multer** - File upload handling
- **sqlite3** - Database engine (no external DB needed!)
- **cors** - Cross-origin request handling
- **express-rate-limit** - API rate limiting
- **dotenv** - Environment configuration
- **axios** - HTTP client (for testing)

### 2. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000` with:
- ✓ Database created automatically (`./database/wallpapers.db`)
- ✓ Upload folder created automatically (`./uploads`)
- ✓ All tables initialized

### 3. Open the App
Open your browser to: **http://localhost:3000**

### 4. Test Everything
In another terminal:
```bash
npm test
```

This runs automated tests for all API endpoints.

---

## 📁 How It Works

### Architecture
```
Frontend (React)
    ↓
API Client (browser-based)
    ↓
Backend (Express server)
    ↓
SQLite Database ← Files on Disk
```

### File Structure
```
midou/
├── public/
│   └── index.html          # Main app (React) - already integrated with backend
├── server/
│   ├── backend.js          # Main server (13 API endpoints)
│   ├── test.js             # Automated testing script
│   └── uploads/            # User-uploaded wallpapers (auto-created)
├── database/
│   └── wallpapers.db       # SQLite database (auto-created)
├── package.json            # Dependencies & scripts
├── .env                    # Configuration (optional)
└── .env.example            # Config template
```

---

## 🔌 API Endpoints

### Public Endpoints (No Auth)
```
GET  /api/health
     Returns server status

GET  /api/wallpapers
     Get all wallpapers
     Response: { success: true, wallpapers: [...] }

GET  /api/wallpapers/:id
     Get single wallpaper by ID

POST /api/wallpapers/:id/download
     Record a download (increments counter)
     Response: { success: true, dls: 123 }
```

### Admin Endpoints (Passcode Protected)
```
POST /api/admin/verify
     Verify admin passcode
     Body: { passcode: "15081983" }
     Response: { success: true, token: "..." }

POST /api/wallpapers/upload
     Upload wallpaper with file (multipart form)
     Fields: ten, tar, anime, cat, tags, res, is4k, grad
     File: wallpaper (image)

POST /api/wallpapers/upload-base64
     Upload wallpaper from URL or base64
     Body: { ten, tar, anime, cat, tags, res, is4k, grad, image }
     image: URL or data:image/...;base64,...

DELETE /api/wallpapers/:id
     Delete a wallpaper permanently

GET  /api/admin/stats
     Get total wallpapers, uploads, and downloads

GET  /api/admin/logs
     View admin action history (last 50)
```

---

## 👑 Admin Panel

### Accessing Admin Panel
1. Click the **👑 Admin** button in the app
2. Enter the default passcode: **15081983**
3. Unlock full admin features

### Admin Features
- **Upload Wallpapers** - Add new wallpapers via file or URL
- **Preview Uploads** - See image before publishing
- **Manage Wallpapers** - Delete your uploads
- **View Stats** - See total wallpapers, your uploads, total downloads
- **Download Tracking** - See how many times each wallpaper was downloaded

### Changing Admin Passcode
Edit the environment variable:
```bash
# In .env file
ADMIN_PASS=your_new_passcode
```

⚠️ **Default is 15081983 - change this in production!**

---

## 💾 Database Schema

### wallpapers table
Stores all wallpaper metadata and images

```sql
Column        | Type     | Description
------------------------------------------
id            | TEXT     | Unique ID (auto-generated)
ten           | TEXT     | Title in English
tar           | TEXT     | Title in Arabic
anime         | TEXT     | Series name
cat           | TEXT     | Category (naruto, onepiece, etc)
tags          | TEXT     | JSON array of style tags
res           | TEXT     | Resolution (1080x1920, etc)
is4k          | INTEGER  | 1 if 4K, 0 otherwise
grad          | TEXT     | Gradient theme
img           | TEXT     | Image URL or /uploads/filename
mine          | INTEGER  | 1 if admin uploaded, 0 if external
isNew         | INTEGER  | 1 if recently added, 0 otherwise
dls           | INTEGER  | Download count
created_at    | DATETIME | Upload timestamp
updated_at    | DATETIME | Last modified
```

### upload_logs table
Tracks all file uploads for auditing

### admin_logs table
Records admin actions (login, upload, delete, etc)

---

## 📱 Phone Upload Flow

1. **Open app on phone** → http://localhost:3000 (from computer's IP)
   - Get your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Example: http://192.168.1.100:3000

2. **Click 👑 Admin** → Enter passcode

3. **Click "Upload New Wallpaper"**
   - Fill in English & Arabic titles
   - Select series and category
   - Tap "Choose image from device"
   - Select image from phone gallery

4. **Tap "Publish Wallpaper"**
   - Image uploads to server
   - Appears instantly for all users
   - Download tracking starts immediately

---

## ⚙️ Configuration

### Environment Variables (.env)
```
PORT=3000
ADMIN_PASS=15081983
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE_MB=50
```

### Create a .env file
```bash
cp .env.example .env
# Edit .env with your settings
```

### Production Settings
For deployment, update:
- `PORT` - Use 80 or 443 with reverse proxy
- `ADMIN_PASS` - Use a strong password
- `CORS_ORIGIN` - Allow only your domain
- `NODE_ENV=production` - Enable optimizations

---

## 🐛 Troubleshooting

### "Cannot find module 'sqlite3'"
```bash
npm install
```
Then restart: `npm start`

### "Port 3000 already in use"
```bash
# Use a different port
PORT=3001 npm start
```

### "Invalid passcode"
Default is `15081983` - no extra spaces!

### "File upload fails"
- Max file size is 50MB
- Only JPEG, PNG, WebP allowed
- Check disk space in `./uploads`

### "App shows 'Server Offline'"
- Make sure backend is running: `npm start`
- Check CORS settings if frontend is on different domain
- Open browser console (F12) for error details

### Database corrupted
Delete and recreate:
```bash
rm -rf database/wallpapers.db
npm start
```

---

## 🧪 Testing

### Automated Test Suite
```bash
npm test
```

Tests all API endpoints:
1. ✓ Health check
2. ✓ Admin verification
3. ✓ Fetch wallpapers
4. ✓ Get statistics
5. ✓ Upload base64 image
6. ✓ Record download
7. ✓ Fetch specific wallpaper
8. ✓ Delete wallpaper
9. ✓ Admin logs

### Manual API Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Get all wallpapers
curl http://localhost:3000/api/wallpapers

# Admin verify
curl -X POST http://localhost:3000/api/admin/verify \
  -H "Content-Type: application/json" \
  -d '{"passcode":"15081983"}'

# Get stats
curl http://localhost:3000/api/admin/stats
```

---

## 📊 File Storage

### Database File
- Location: `./database/wallpapers.db`
- Size: Grows with wallpapers (SQLite is efficient)
- Backup: Copy the .db file to backup

### Uploaded Images
- Location: `./uploads/`
- Naming: `wallpaper_TIMESTAMP_RANDOM.ext`
- Size: Each image stored separately
- Cleanup: Deleted when wallpaper is removed via admin panel

### Backup Strategy
```bash
# Backup database
cp database/wallpapers.db database/wallpapers.db.backup

# Backup uploads
cp -r uploads uploads.backup

# Restore
cp database/wallpapers.db.backup database/wallpapers.db
cp -r uploads.backup uploads
npm start
```

---

## 🔒 Security Notes

⚠️ **Default admin passcode must be changed in production!**

Current setup is for **local/private use**. For public deployments:
- [ ] Change `ADMIN_PASS` to a strong password
- [ ] Use HTTPS (not HTTP)
- [ ] Set proper CORS_ORIGIN
- [ ] Implement user authentication
- [ ] Add file size/rate limits
- [ ] Run behind a reverse proxy (nginx)
- [ ] Set up automated backups
- [ ] Monitor disk space usage

---

## 🚀 Deployment

### Local Network Access
From your phone on the same network:
1. Find your computer's IP: `ipconfig` (Windows)
2. Open: `http://YOUR_IP:3000`
3. Use the same admin passcode

### Heroku Deployment
```bash
heroku create aniwalls
heroku config:set ADMIN_PASS=your_password
git push heroku main
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:16
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📚 Frontend Integration

The frontend (`public/index.html`) is already integrated with the backend:

1. **API Client** - Handles all server communication
2. **Admin Panel** - Upload & manage wallpapers
3. **Download Tracking** - Records stats
4. **Fallback** - Works offline with localStorage

No additional frontend changes needed! Just:
1. Install dependencies: `npm install`
2. Start server: `npm start`
3. Open browser: `http://localhost:3000`

---

## 🎯 Next Steps

- [ ] Run `npm install` to download dependencies
- [ ] Run `npm start` to start the server
- [ ] Open http://localhost:3000 in browser
- [ ] Run `npm test` to verify everything works
- [ ] Click 👑 Admin and enter passcode: 15081983
- [ ] Upload your first wallpaper!

---

## 📞 Support

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Review error messages in terminal
3. Check `database/wallpapers.db` exists
4. Verify port 3000 is available
5. Run `npm install` again if modules are missing

---

**Created for the AniWalls Project** ⚡
Simple, beginner-friendly anime wallpaper app with phone uploads and instant sync.
