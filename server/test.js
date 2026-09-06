/**
 * Quick Start & Testing Script for AniWalls Backend
 * Run this to verify everything is working
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';
const ADMIN_PASS = '15081983';

async function test() {
  console.log('🚀 AniWalls Backend Testing Suite\n');

  try {
    // 1. Health Check
    console.log('1️⃣  Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Server is running\n');

    // 2. Admin Verification
    console.log('2️⃣  Admin Verification...');
    const verify = await axios.post(`${BASE_URL}/admin/verify`, {
      passcode: ADMIN_PASS
    });
    console.log('✓ Admin verified\n');

    // 3. Get All Wallpapers
    console.log('3️⃣  Fetching wallpapers...');
    const wallpapers = await axios.get(`${BASE_URL}/wallpapers`);
    console.log(`✓ Found ${wallpapers.data.wallpapers.length} wallpapers\n`);

    // 4. Get Statistics
    console.log('4️⃣  Fetching statistics...');
    const stats = await axios.get(`${BASE_URL}/admin/stats`);
    console.log(`✓ Stats:`, stats.data.stats, '\n');

    // 5. Upload Test (Base64)
    console.log('5️⃣  Testing base64 upload...');
    
    // Create a simple test image (1x1 pixel red PNG)
    const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    
    const upload = await axios.post(`${BASE_URL}/wallpapers/upload-base64`, {
      ten: 'Test Wallpaper',
      tar: 'ورقة جدار تجريبية',
      anime: 'Test Anime',
      cat: 'naruto',
      tags: JSON.stringify(['test', 'demo']),
      res: '1080 x 1920',
      is4k: 0,
      grad: 'g1',
      image: testImageBase64
    });
    
    const testWpId = upload.data.wallpaper.id;
    console.log(`✓ Uploaded test wallpaper: ${testWpId}\n`);

    // 6. Record Download
    console.log('6️⃣  Recording download...');
    const download = await axios.post(`${BASE_URL}/wallpapers/${testWpId}/download`);
    console.log(`✓ Download recorded. Total: ${download.data.dls}\n`);

    // 7. Fetch Specific Wallpaper
    console.log('7️⃣  Fetching specific wallpaper...');
    const single = await axios.get(`${BASE_URL}/wallpapers/${testWpId}`);
    console.log('✓ Wallpaper retrieved:', {
      id: single.data.wallpaper.id,
      title: single.data.wallpaper.ten,
      downloads: single.data.wallpaper.dls
    }, '\n');

    // 8. Delete Wallpaper
    console.log('8️⃣  Deleting wallpaper...');
    const del = await axios.delete(`${BASE_URL}/wallpapers/${testWpId}`);
    console.log('✓ Wallpaper deleted\n');

    // 9. Get Admin Logs
    console.log('9️⃣  Fetching admin logs...');
    const logs = await axios.get(`${BASE_URL}/admin/logs`);
    console.log(`✓ Retrieved ${logs.data.logs.length} log entries\n`);

    console.log('✅ All tests passed! Backend is working correctly.\n');
    console.log('📱 Frontend ready at: http://localhost:3000');
    console.log('👑 Admin panel passcode: ' + ADMIN_PASS + '\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
    if (!error.response) {
      console.error('\n⚠️  Make sure the server is running:');
      console.error('   npm start');
    }
    process.exit(1);
  }
}

test();
