# 🚀 AniWalls - Get Started in 3 Steps

**Complete backend with permanent storage, file uploads, and instant sync across all users.**

## Step 1: Install Dependencies (1 minute)

Open Terminal/PowerShell in the project folder:

```bash
npm install
```

Wait for it to finish. You'll see `added XX packages`.

## Step 2: Start the Server (10 seconds)

```bash
npm start
```

You'll see:
```
╔═══════════════════════════════════╗
║   AniWalls Backend Server        ║
║   Listening on http://localhost:3000  ║
╚═══════════════════════════════════╝

✓ Database: ./database/wallpapers.db
✓ Uploads: ./uploads
✓ Admin Passcode: 15081983
```

**Server is running!** ✅

## Step 3: Open the App (5 seconds)

Open your browser to:
```
http://localhost:3000
```

You'll see the AniWalls app with:
- 📱 Wallpaper gallery
- 👑 Admin panel for uploads
- 🔄 Refresh button
- 🔗 "Server Connected" indicator (top right)

---

## 👑 Admin Panel - Upload Your First Wallpaper

1. Click the **👑 Admin** button
2. Enter passcode: **15081983**
3. Click "Unlock"

### Upload Options:
- **From URL** - Paste image URL in the field
- **From File** - Tap "Choose image from device"

Fill in:
- **Title (English)** - e.g., "Naruto - Hokage"
- **Title (Arabic)** - e.g., "ناروتو - الهوكاج"
- **Anime/Series** - e.g., "Naruto"
- **Category** - Pick from dropdown
- **Resolution** - Select quality
- **Style Tag** - Pick the vibe

Click **⚡ Publish Wallpaper** → Done! ✨

---

## 📱 Upload from Your Phone

### Same WiFi Network:

1. **Find your computer's IP:**
   - Windows: Open PowerShell, type: `ipconfig`
   - Look for IPv4 Address (like `192.168.1.100`)

2. **On phone browser, open:**
   ```
   http://192.168.1.100:3000
   ```
   (Replace with your actual IP)

3. **Click 👑 Admin → Unlock → Upload**

Done! Wallpaper appears instantly for everyone.

---

## 🧪 Verify Everything Works

```bash
npm test
```

You'll see:
```
✓ Server is running
✓ Admin verified
✓ Found X wallpapers
✓ Stats retrieved
✓ Upload successful
✓ Download recorded
✓ Wallpaper retrieved
✓ Wallpaper deleted
✓ Admin logs retrieved

✅ All tests passed!
```

---

## 🛑 Stopping the Server

Press **Ctrl+C** in the terminal.

To restart:
```bash
npm start
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Command not found: npm" | Install [Node.js](https://nodejs.org) |
| "Port 3000 already in use" | `PORT=3001 npm start` |
| "Cannot find module" | Run `npm install` again |
| "Admin passcode rejected" | Make sure it's exactly: `15081983` |
| "Can't access from phone" | Use your actual IP, not localhost |

---

## 📚 What's Actually Happening?

```
You write description → Admin Panel
       ↓
Sends to Express Server (backend.js)
       ↓
Server stores in SQLite database (wallpapers.db)
       ↓
Server saves image file (uploads/ folder)
       ↓
Creates unique ID and records metadata
       ↓
Returns success → App updates instantly
       ↓
All users see new wallpaper immediately!
```

**Everything is permanent and synced across users.** ✅

---

## 🎯 Key Features

✅ **Permanent Storage** - Data saved to SQLite database  
✅ **File Uploads** - Images stored on disk  
✅ **Real-time Sync** - All users see changes instantly  
✅ **Download Tracking** - See popularity stats  
✅ **Admin Panel** - Full control over wallpapers  
✅ **Phone Uploads** - Add wallpapers from phone browser  
✅ **No External DB** - Everything local, nothing cloud  
✅ **Beginner Friendly** - Just npm install + npm start  

---

## 📁 What Gets Created

```
project/
├── database/
│   └── wallpapers.db        ← Database (auto-created)
├── uploads/
│   ├── wallpaper_1234_.png  ← Your images
│   ├── wallpaper_5678_.jpg
│   └── ...
├── server/
│   ├── backend.js           ← The server
│   └── test.js
├── public/
│   └── index.html           ← The app
└── package.json             ← Dependencies
```

**All files are stored locally on your computer.** No cloud required.

---

## ⚡ Pro Tips

- **Change Passcode:** Edit `ADMIN_PASS` in `.env.example` (create as `.env`)
- **Access Logs:** Admin panel shows upload history
- **Back Up Data:** Copy `database/wallpapers.db` and `uploads/` folders
- **Delete Wallpapers:** Use admin panel's delete button
- **View Stats:** Admin panel shows total wallpapers, downloads, etc.

---

## 🎓 Learning Path

1. ✅ Get it running (you're here)
2. 📱 Upload your first wallpaper
3. 📊 Check stats in admin panel
4. 🔄 Upload from phone
5. 🏗️ Read BACKEND_SETUP.md for advanced setup
6. 🚀 Deploy to a server when ready

---

**You're all set!** 🎉

Backend server is running, database is ready, and you can start uploading wallpapers.

Questions? Check **BACKEND_SETUP.md** for detailed documentation.
