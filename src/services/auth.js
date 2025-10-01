import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || null;
    this.isRefreshing = false;
    this.failedQueue = [];
    
    // Set initial token if exists
    if (this.accessToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`;
    }
  }

  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('accessToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }

  getAccessToken() {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }
}

const tokenManager = new TokenManager();

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (tokenManager.isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          tokenManager.failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      tokenManager.isRefreshing = true;

      try {
        // Try to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        tokenManager.setAccessToken(accessToken);
        tokenManager.processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        tokenManager.processQueue(refreshError, null);
        tokenManager.clearTokens();
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        tokenManager.isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // User Authentication
  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    const { accessToken, user } = response.data;
    tokenManager.setAccessToken(accessToken);
    return { user, accessToken };
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken, user } = response.data;
    tokenManager.setAccessToken(accessToken);
    return { user, accessToken };
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    const { accessToken } = response.data;
    tokenManager.setAccessToken(accessToken);
    return accessToken;
  },

  // Admin Authentication
  adminLogin: async (credentials) => {
    const response = await apiClient.post('/admin/login', credentials);
    const { accessToken, user } = response.data;
    tokenManager.setAccessToken(accessToken);
    return { user, accessToken };
  },

  adminLogout: async () => {
    try {
      await apiClient.post('/admin/logout');
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Profile
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data.user;
  },

  getAdminProfile: async () => {
    const response = await apiClient.get('/admin/profile');
    return response.data.user;
  },

  // Google OAuth
  googleAuthUrl: () => {
    return `${API_BASE_URL}/auth/google`;
  },
};

export { tokenManager };
export default apiClient;