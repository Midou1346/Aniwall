# 🚀 Deployment Guide for AniWalls

## Quick Start - No Server (Easiest)

1. Open `public/index.html` in your browser
2. Everything works locally with **localStorage**
3. Works completely offline!

---

## Option 1: GitHub Pages (Free - Static Only)

### For users who only want the app (no server uploads)

1. **Create GitHub repository**
```bash
  git init
   cd midou
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/aniwalls.git
   git push -u origin main
```

2. **Enable GitHub Pages**
    - Go to Settings → Pages
    - Set Source to: `main` branch, `/public` folder
    - Save

3. **Access your app**
    - URL: `https://YOUR_USERNAME.github.io/aniwalls/`
    - Works immediately!

---

## Option 2: Netlify (Free - With Server Uploads)

### Best for quick deployment with upload functionality

1. **Push to GitHub** (see Option 1 first)

2. **Connect to Netlify**
    - Go to [netlify.com](https://netlify.com)
    - Click "New site from Git"
    - Select your GitHub repository
    - Build settings:
        - Base directory: `.`
        - Build command: Leave empty
        - Publish directory: `public`

3. **Deploy**
    - Netlify auto-deploys on every push
    - Your site is live! 🎉

4. **Enable server uploads** (optional)
    - Use PHP handler or Node.js
    - Configure in app settings

---

## Option 3: Vercel (Free - Recommended for React)

### Fastest deployment with amazing performance

1. **Push to GitHub** (see Option 1)

2. **Deploy on Vercel**
    - Go to [vercel.com](https://vercel.com)
    - Click "New Project"
    - Import your GitHub repository
    - Framework: `Other`
    - Root Directory: `.`

3. **Deploy instantly**
    - Vercel handles everything
    - Auto-deploys on git push

---

## Option 4: Your Own Server (Advanced)

### For complete control and custom features

### **A. Node.js Server (Linux/Mac/Windows)**

1. **Install Node.js**
    - Download from [nodejs.org](https://nodejs.org)

2. **Install dependencies**
```bash
  cd server
   npm install
```

3. **Start the server**
```bash
  npm start
   # Server runs on http://localhost:3000
```

4. **Make it public**
    - Use **Ngrok** for testing:
```bash
    npm install -g ngrok
     ngrok http 3000
     # Get public URL
```
    - Use **Docker** for production:
```bash
    docker build -t aniwalls .
     docker run -p 3000:3000 aniwalls
```

### **B. Shared Hosting (PHP)**

1. **Upload files via FTP**
    - Upload all files to your hosting account
    - Make sure `server/uploads/` is writable
    - Set permissions: `chmod 755 uploads/`

2. **Access the app**
    - URL: `https://your-domain.com/public/index.html`

3. **Enable PHP upload handler**
    - Upload `server/upload-handler.php` to your domain
    - Update app settings to point to it

### **C. VPS/Cloud Server (Digital Ocean, Linode, AWS)**

1. **SSH into server**
```bash
   ssh root@your-server-ip
```

2. **Install Node.js**
```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
```

3. **Clone your repository**
```bash
  git clone https://github.com/YOUR_USERNAME/aniwalls.git
   cd aniwalls
```

4. **Install and run**
```bash
  npm install
   npm start
```

5. **Use PM2 to keep it running**
```bash
  npm install -g pm2
   pm2 start server/upload-server.js --name "aniwalls"
   pm2 startup
   pm2 save
```

6. **Setup Nginx reverse proxy**
```bash
  sudo apt-get install nginx
   # Edit /etc/nginx/sites-available/default
   # Add proxy_pass http://localhost:3000;
   sudo systemctl restart nginx
```

7. **Enable HTTPS**
```bash
  sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
```

---

## Deployment Comparison

| Option | Cost | Setup Time | Uploads | Features |
| --- | --- | --- | --- | --- |
| **Local** | Free | 1 min | No | Works offline |
| **GitHub Pages** | Free | 10 min | No | Simple & fast |
| **Netlify** | Free | 5 min | Yes | Easy deployment |
| **Vercel** | Free | 5 min | Yes | Best performance |
| **Node.js Server** | $5-20/mo | 30 min | Yes | Full control |
| **Shared Hosting** | $3-10/mo | 20 min | Yes (PHP) | Cheap & easy |
| **VPS** | $5-50/mo | 45 min | Yes | Maximum control |

---

## Post-Deployment Checklist

- [ ] Test the app on phone
- [ ] Test desktop view
- [ ] Test admin panel
- [ ] Test upload functionality
- [ ] Check both languages (EN/AR)
- [ ] Test offline mode
- [ ] Verify download counter works
- [ ] Test favorites persistence
- [ ] Check all categories load
- [ ] Verify responsive design

---

## Troubleshooting Deployment

### App won't load
- Check browser console for errors (F12)
- Verify all files are uploaded
- Clear browser cache
- Try incognito/private mode

### Uploads not working
- Check `/uploads` directory exists and is writable
- Verify server is running
- Check firewall/hosting restrictions
- Review PHP/Node.js error logs

### Images not showing
- Verify image URLs are accessible
- Check CORS settings
- Try with local upload instead
- Check image file format

### Admin panel broken
- Check passcode (default: `15081983`)
- Clear localStorage
- Refresh page completely
- Try different browser

---

## Update & Maintenance

### Backup your wallpapers
```bash
# Backup uploads directory
cp -r server/uploads/ backups/uploads_$(date +%Y%m%d)

# Or use GitHub
git add .
git commit -m "Backup wallpapers"
git push
```

### Update the app
```bash
# Pull latest from repository
git pull origin main

# Restart server (if using Node.js)
pm2 restart aniwalls
```

---

## Security Best Practices

1. **Change admin passcode**
    - Edit `const ADMIN_PASS='15081983'`
    - Change to your secret code

2. **Enable HTTPS**
    - Always use HTTPS in production
    - Free certificates: Let's Encrypt

3. **Limit file uploads**
    - Set max file size
    - Validate file types
    - Check virus on uploads

4. **Protect uploads directory**
    - Use `.htaccess` on Apache
    - Block direct access to uploads
    - Use signed URLs

5. **Rate limiting**
    - Prevent spam uploads
    - Add cooldown timer
    - Monitor for abuse

---

## Next Steps

1. Choose your deployment option
2. Follow the setup steps
3. Test on your phone
4. Share with friends!
5. Start uploading wallpapers
6. Enjoy! ⚡

**Need help?** Check the README.md or PHONE_UPLOAD_GUIDE.md
