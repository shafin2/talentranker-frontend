import apiClient from './auth.js';

// Admin API functions
export const adminAPI = {
  // Dashboard & Analytics
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  getAnalytics: async (dateRange) => {
    const response = await apiClient.get('/admin/analytics', { 
      params: { dateRange } 
    });
    return response.data;
  },

  // User Management  
  getAllUsers: async (page = 1, limit = 10, search = '') => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Plan Management
  getAllPlansAdmin: async () => {
    const response = await apiClient.get('/admin/plans');
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await apiClient.post('/admin/plans', planData);
    return response.data;
  },

  updatePlan: async (planId, planData) => {
    const response = await apiClient.put(`/admin/plans/${planId}`, planData);
    return response.data;
  },

  deletePlan: async (planId) => {
    const response = await apiClient.delete(`/admin/plans/${planId}`);
    return response.data;
  },
};

// User API functions  
export const userAPI = {
  // Profile Management
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/profile', profileData);
    return response.data;
  },

  // Plan Management
  getAvailablePlans: async (region) => {
    const response = await apiClient.get('/users/plans', {
      params: { region }
    });
    return response.data;
  },

  updateUserPlan: async (planId, resetUsage = false) => {
    const response = await apiClient.put('/users/me/plan', {
      planId,
      resetUsageOnUpgrade: resetUsage
    });
    return response.data;
  },

  // Usage Statistics
  getUsageStats: async () => {
    const response = await apiClient.get('/users/usage');
    return response.data;
  },

  // Job Descriptions
  getJDs: async () => {
    const response = await apiClient.get('/users/jds');
    return response.data;
  },

  // CVs
  getCVs: async () => {
    const response = await apiClient.get('/users/cvs');
    return response.data;
  },
};

// Plan API functions (public)
export const planAPI = {
  getAllPlans: async () => {
    const response = await apiClient.get('/plans');
    return response.data;
  },

  getPlanById: async (planId) => {
    const response = await apiClient.get(`/plans/${planId}`);
    return response.data;
  },
};

// Ranking API functions
export const rankingAPI = {
  // Rank CVs with files (new flow - accepts files, creates DB records, deducts credits)
  rankWithFiles: async (formData) => {
    const response = await apiClient.post('/ranking/rank-with-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get ranking history
  getHistory: async () => {
    const response = await apiClient.get('/ranking/results');
    return response.data;
  },

  // Get single ranking result
  getResultById: async (resultId) => {
    const response = await apiClient.get(`/ranking/results/${resultId}`);
    return response.data;
  },
};

// Usage API functions
export const usageAPI = {
  uploadJD: async (file) => {
    // For now, just simulate the API call since backend expects usage enforcement
    const response = await apiClient.post('/usage/jd/upload', {});
    return response.data;
  },

  uploadCV: async (files) => {
    const count = Array.isArray(files) ? files.length : 1;
    
    const response = await apiClient.post('/usage/cv/upload', { count });
    return response.data;
  },

  getUsageStats: async () => {
    const response = await apiClient.get('/usage/stats');
    return response.data;
  },
};

export default { adminAPI, userAPI, planAPI, usageAPI, rankingAPI };