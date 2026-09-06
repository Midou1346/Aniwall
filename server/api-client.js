/**
 * AniWalls Frontend API Integration Module
 * 
 * This module handles all communication between the frontend and backend server.
 * Replace the existing store and data functions with these API-enabled versions.
 * 
 * Usage:
 * - Include this file before the main app component
 * - All wallpaper operations will automatically use the server
 * - Fallback to localStorage if server is unavailable
 */

// ============ CONFIGURATION ============
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const USE_SERVER = true; // Set to false to use localStorage only

// ============ API SERVICE ============
const ApiService = {
  // Check if server is available
  async isServerAvailable() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  // Fetch all wallpapers from server
  async getWallpapers() {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers`);
      if (!response.ok) throw new Error('Failed to fetch wallpapers');
      const data = await response.json();
      return data.wallpapers || [];
    } catch (error) {
      console.error('API Error fetching wallpapers:', error);
      throw error;
    }
  },

  // Fetch single wallpaper
  async getWallpaper(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`);
      if (!response.ok) throw new Error('Wallpaper not found');
      const data = await response.json();
      return data.wallpaper;
    } catch (error) {
      console.error('API Error fetching wallpaper:', error);
      throw error;
    }
  },

  // Upload wallpaper with file
  async uploadWallpaper(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/upload`, {
        method: 'POST',
        body: formData // FormData with file
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      return data.wallpaper;
    } catch (error) {
      console.error('API Error uploading wallpaper:', error);
      throw error;
    }
  },

  // Upload wallpaper with base64
  async uploadWallpaperBase64(wallpaperData) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/upload-base64`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wallpaperData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      return data.wallpaper;
    } catch (error) {
      console.error('API Error uploading wallpaper (base64):', error);
      throw error;
    }
  },

  // Update wallpaper
  async updateWallpaper(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }

      const data = await response.json();
      return data.wallpaper;
    } catch (error) {
      console.error('API Error updating wallpaper:', error);
      throw error;
    }
  },

  // Delete wallpaper
  async deleteWallpaper(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      return true;
    } catch (error) {
      console.error('API Error deleting wallpaper:', error);
      throw error;
    }
  },

  // Record download
  async recordDownload(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers/${id}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to record download');
      const data = await response.json();
      return data.dls;
    } catch (error) {
      console.error('API Error recording download:', error);
      return null;
    }
  },

  // Verify admin access
  async verifyAdmin(passcode) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      if (!response.ok) {
        throw new Error('Invalid passcode');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error verifying admin:', error);
      throw error;
    }
  },

  // Get statistics
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('API Error fetching stats:', error);
      throw error;
    }
  },

  // Get admin logs
  async getLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error('API Error fetching logs:', error);
      throw error;
    }
  }
};

// ============ ENHANCED STORE WITH SERVER SYNC ============
const store = {
  // Hybrid storage: try server first, fallback to localStorage
  async get(k, d) {
    try {
      // Special handling for wallpapers
      if (k === 'aw_wps_v2') {
        if (USE_SERVER) {
          const serverWps = await ApiService.getWallpapers();
          localStorage.setItem(k, JSON.stringify(serverWps));
          return serverWps;
        }
      }
      
      // Local storage fallback
      const v = localStorage.getItem(k);
      return v !== null ? JSON.parse(v) : d;
    } catch (e) {
      // On error, return default
      const v = localStorage.getItem(k);
      return v !== null ? JSON.parse(v) : d;
    }
  },

  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },

  // Upload wallpaper to server
  async uploadWallpaper(wallpaperData) {
    try {
      if (USE_SERVER) {
        return await ApiService.uploadWallpaperBase64(wallpaperData);
      } else {
        // Fallback to local only
        const id = wallpaperData.id || 'w' + Date.now();
        return { ...wallpaperData, id };
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Delete wallpaper from server
  async deleteWallpaper(id) {
    try {
      if (USE_SERVER) {
        return await ApiService.deleteWallpaper(id);
      }
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  },

  // Update download count on server
  async recordDownload(id) {
    try {
      if (USE_SERVER) {
        return await ApiService.recordDownload(id);
      }
      return null;
    } catch (error) {
      console.error('Download record error:', error);
      return null;
    }
  }
};

// ============ HOOK FOR REACT COMPONENTS ============
function useApiSync() {
  const [serverAvailable, setServerAvailable] = React.useState(USE_SERVER);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!USE_SERVER) return;
    
    // Check server availability on mount
    ApiService.isServerAvailable().then(available => {
      setServerAvailable(available);
      if (!available) {
        console.warn('⚠️ Server not available, using localStorage only');
      }
    });
  }, []);

  return { serverAvailable, loading, error, setLoading, setError };
}

// ============ UTILITY FUNCTIONS ============

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Create FormData from file
function createFormData(file, wallpaperData) {
  const formData = new FormData();
  formData.append('wallpaper', file);
  formData.append('ten', wallpaperData.ten);
  formData.append('tar', wallpaperData.tar);
  formData.append('anime', wallpaperData.anime);
  formData.append('cat', wallpaperData.cat);
  formData.append('tags', JSON.stringify(wallpaperData.tags));
  formData.append('res', wallpaperData.res);
  formData.append('is4k', wallpaperData.is4k ? 1 : 0);
  formData.append('grad', wallpaperData.grad);
  return formData;
}
