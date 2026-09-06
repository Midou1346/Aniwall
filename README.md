# ⚡ AniWalls - Anime Wallpaper App with Backend Server

**A modern, beginner-friendly anime wallpaper app with a complete Node.js backend, permanent database storage, phone uploads, and real-time sync across all users.**

[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)]()
[![Node.js](https://img.shields.io/badge/Node.js-14+-green)]()
[![SQLite](https://img.shields.io/badge/SQLite-3-blue)]()
[![License](https://img.shields.io/badge/License-MIT-purple)]()

## 🎯 What is AniWalls?

AniWalls is a futuristic anime wallpaper application that combines:

- **Beautiful Frontend** - React-based, gradient UI optimized for mobile
- **Powerful Backend** - Express.js server with SQLite database
- **Permanent Storage** - All wallpapers, uploads, and stats persist
- **Phone Uploads** - Upload wallpapers directly from your phone browser
- **Real-time Sync** - Changes appear instantly for all users
- **Admin Panel** - Full control: upload, delete, view statistics
- **Download Tracking** - See which wallpapers are most popular
- **Zero Configuration** - Works out of the box, no external databases needed

## 🚀 Quick Start (3 Steps)

### 1. Install
```bash
npm install
```

### 2. Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

### 3. Open App
Visit `http://localhost:3000` in your browser

**That's it!** ✅ See **QUICK_START.md** for detailed walkthrough.

## 👑 Admin Features

Click the **👑 Admin** button and enter passcode **15081983** to:

- 📤 **Upload Wallpapers** - Add new wallpapers via file or URL
- 🗑️ **Delete Wallpapers** - Remove wallpapers permanently
- 📊 **View Statistics** - See total uploads, downloads, and more
- 🔍 **Manage Uploads** - Browse and manage your contributions
- 📱 **Phone Uploads** - Upload directly from phone browser

## 📁 Project Structure

```
aniwalls/
├── 📄 README.md                 ← You are here
├── 🚀 QUICK_START.md            ← 3-step guide
├── 📚 BACKEND_SETUP.md          ← Detailed documentation
├── 📦 package.json              ← Dependencies & scripts
├── 🔐 .env.example              ← Configuration template
│
├── 📁 public/
│   └── index.html               ← React app (already integrated)
│
├── 📁 server/
│   ├── backend.js               ← Express server
│   ├── test.js                  ← Automated tests
│   └── uploads/                 ← User images (auto-created)
│
├── 📁 database/
│   └── wallpapers.db            ← SQLite database (auto-created)
│
└── 📁 docs/
    └── (Additional guides)
```

## 💾 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | Interactive UI |
| **Backend** | Express.js | Web server & API |
| **Database** | SQLite3 | Persistent storage |
| **File Upload** | Multer | Handle image uploads |
| **CORS** | cors | Cross-origin support |
| **Rate Limiting** | express-rate-limit | Production safety |

## 📱 Features

✅ **Real-time Database** - SQLite with permanent storage  
✅ **File Upload** - Multipart forms and base64 images  
✅ **Admin Panel** - Full CRUD operations  
✅ **Phone Upload** - Direct browser access from phone  
✅ **Download Tracking** - Statistics and popularity metrics  
✅ **Beautiful UI** - Gradient design, optimized for mobile  
✅ **Bilingual** - English & Arabic support with RTL  
✅ **Zero Config** - No external databases needed  
✅ **Beginner Friendly** - Just run `npm install && npm start`  
✅ **Production Ready** - Rate limiting, error handling, CORS  

## 🌍 Accessing from Phone

### On Same WiFi Network:

1. Find your computer's IP:
   ```bash
   # Windows PowerShell
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

2. On your phone, open browser and go to:
   ```
   http://192.168.1.100:3000
   ```
   (Replace with your actual IP)

3. Click 👑 Admin → Unlock → Upload wallpaper

**Changes appear instantly for all users!**

## 🧪 Testing

Verify everything works:

```bash
npm test
```

Tests all API endpoints and returns:
```
✅ All tests passed! Backend is working correctly.
📱 Frontend ready at: http://localhost:3000
👑 Admin panel passcode: 15081983
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):

```bash
PORT=3000
ADMIN_PASS=15081983
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE_MB=50
```

**⚠️ Change `ADMIN_PASS` in production!**

## 🔒 Security

This setup is designed for **local/private use**. For production:

- [ ] Change admin passcode to something strong
- [ ] Use HTTPS instead of HTTP
- [ ] Set up proper CORS configuration
- [ ] Implement user authentication
- [ ] Run behind nginx/Apache reverse proxy
- [ ] Enable rate limiting
- [ ] Set up automated backups
- [ ] Monitor disk space

See **BACKEND_SETUP.md** for production deployment guide.

## 💾 Data Storage

### Database
- **Location:** `./database/wallpapers.db`
- **Type:** SQLite3 (single file)
- **No setup needed** - automatically created

### Images
- **Location:** `./uploads/`
- **Naming:** `wallpaper_TIMESTAMP_RANDOM.ext`
- **Auto-cleanup** - deleted when wallpaper is removed

### Backup
```bash
# Backup everything
cp -r database database.backup
cp -r uploads uploads.backup

# Restore
cp -r database.backup database
cp -r uploads.backup uploads
npm start
```

## 🚀 NPM Scripts

```bash
npm start       # Start production server
npm run dev     # Start with auto-reload (requires nodemon)
npm test        # Run automated tests
```

## 📚 Documentation

- **QUICK_START.md** - Get running in 5 minutes
- **BACKEND_SETUP.md** - Complete technical documentation

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Command not found: npm" | Install [Node.js](https://nodejs.org) |
| "Port 3000 already in use" | `PORT=3001 npm start` |
| "Admin passcode rejected" | Passcode is exactly: `15081983` |
| "Can't connect from phone" | Use your computer's IP, not "localhost" |
| "Upload fails" | Check file size (max 50MB), file type (JPEG/PNG/WebP) |
| "Database error" | Delete `database/wallpapers.db` and restart |

## 🏁 Getting Started Right Now

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open browser
# http://localhost:3000

# 4. Click 👑 Admin, enter: 15081983

# 5. Upload your first wallpaper!
```

---

**Made with ⚡ for anime lovers**

*A complete, beginner-friendly anime wallpaper app with production-ready backend and database storage.*
├── docs/
│   ├── PHONE_UPLOAD_GUIDE.md      # Beginner-friendly phone upload guide
│   ├── ADMIN_SETUP.md             # Admin setup instructions
│   └── API_REFERENCE.md           # API documentation
│
├── package.json                   # Project metadata
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🚀 Quick Start

### 1. **Use Directly (No Setup)**
Simply open `public/index.html` in a web browser. The app works completely offline with localStorage.

### 2. **Enable Phone Uploads** (Recommended)

You have two options:

#### **Option A: Use the Simple Upload Form** (Easiest for Beginners)
1. Open the Admin Panel (tap crown icon 3 times)
2. Enter passcode: `15081983`
3. Click "Choose image from device"
4. Fill in the wallpaper details
5. Click "⚡ Publish Wallpaper"
6. Wallpaper appears instantly for all users!

#### **Option B: Set Up Node.js Server** (For Multiple Users)

```bash
cd server
npm install
node upload-server.js
```

Then access: `http://localhost:3000`

#### **Option C: Set Up PHP Server** (For Shared Hosting)

Upload the `server/upload-handler.php` to your hosting and update the upload endpoint in the admin panel.

## 📱 How to Upload from Your Phone

### **From Phone Browser (Direct)**
1. Open the app on your phone
2. Tap the crown icon (👑) in top-right corner **3 times** quickly
3. Enter password: `15081983`
4. Tap "Choose image from device"
5. Select photo from camera roll
6. Fill in details:
   - **Title (English)**: e.g., "Goku Ultra Instinct"
   - **Title (Arabic)**: e.g., "غوكو - الغريزة الفائقة"
   - **Anime**: e.g., "Dragon Ball"
   - **Category**: Pick one
   - **Style Tag**: Pick one
7. Tap **⚡ Publish Wallpaper**
8. Done! Everyone sees it instantly 🎉

### **From QR Code** (Share with Friends)
1. Run the upload server
2. Generate QR code pointing to: `http://your-ip:3000`
3. Friends scan and upload directly
4. No downloads needed!

## 🔐 Admin Passcode

**Default:** `15081983`

Change it in the app code:
```javascript
const ADMIN_PASS='YOUR_NEW_PASSCODE';
```

## 🗂️ Data Storage

### Local Storage (Client-Side)
- `aw_lang` - User language preference
- `aw_wps_v2` - Wallpaper collection
- `aw_favs` - Favorite wallpapers
- `aw_dl` - Download history
- `aw_name` - User name
- `aw_night` - Night mode setting
- `aw_admin` - Admin status

### Server Storage (Optional)
- `server/uploads/` - Temporary files
- `public/wallpapers/` - Permanent storage

## 🎨 Customization

### Change App Colors
Edit the CSS variables in the HTML `<style>` section:
```css
:root {
  --bg: #070710;
  --p1: #8b5cf6;
  --p2: #a855f7;
  --cyan: #22d3ee;
  --pink: #ec4899;
  --red: #f43f5e;
  --gold: #fbbf24;
}
```

### Add New Categories
In the app code, find `CATS` array:
```javascript
const CATS = [
  {k:'naruto',em:'🍥'},
  {k:'onepiece',em:'🏴‍☠️'},
  // Add more here
];
```

### Add New Wallpapers Manually
Edit the `SEED` array in the app code, or use the Admin Panel.

## 📊 Admin Panel Features

- **Upload** - Add new wallpapers with all metadata
- **Manage** - Delete, edit, view all wallpapers
- **Stats** - Total wallpapers, your uploads, total downloads
- **Live Sync** - All changes appear immediately

## 🌐 Deployment

### **Free Options:**
1. **GitHub Pages** - Host `public/index.html`
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Netlify** - Drag and drop the `public` folder
3. **Vercel** - Connect your GitHub repo

### **Paid Options:**
- Shared Hosting (cPanel)
- VPS (Digital Ocean, Linode)
- Cloud (AWS, Google Cloud, Azure)

## 🔧 Troubleshooting

### Admin Panel Won't Open
- Tap crown icon (👑) exactly 3 times within 1.6 seconds
- Refresh the page and try again

### Uploads Not Appearing
- Check browser console for errors (F12)
- Verify server is running
- Clear browser cache (Ctrl+Shift+Delete)

### Images Not Loading
- Check image URL is accessible
- Verify CORS settings if using external URLs
- Use local upload instead of URL

## 📝 API Reference

### Wallpaper Object
```javascript
{
  id: 'w1',              // Unique ID
  ten: 'English Title',  // English name
  tar: 'عنوان عربي',    // Arabic name
  anime: 'Series Name',  // Anime/Series
  cat: 'naruto',        // Category key
  tags: ['neon'],       // Style tags
  res: '2160 x 3840',   // Resolution
  is4k: 1,              // 4K flag
  rate: '4.9',          // Rating
  likes: '12.5K',       // Likes count
  dls: 48210,           // Download count
  featured: 1,          // Featured flag
  grad: 'g1',           // Gradient class
  img: 'url.jpg',       // Image URL
  mine: 0,              // Your upload flag
  isNew: 0              // New flag
}
```

## 📄 License

Created by Mido © 2026. Feel free to modify and use.

## 💬 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Test in incognito/private mode

## 🎯 Future Features

- [ ] User accounts & cloud sync
- [ ] Advanced search filters
- [ ] Wallpaper sets & collections
- [ ] Ratings & reviews
- [ ] Social sharing
- [ ] Push notifications
- [ ] Dark theme (additional)
- [ ] Widgets

---

**Made with ⚡ by Mido**
