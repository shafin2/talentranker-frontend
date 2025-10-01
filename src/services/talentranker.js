import api from './auth';

// Job Description Service
export const jdService = {
  // Upload JD (can be PDF file or text)
  uploadJD: async (formData) => {
    try {
      const response = await api.post('/jd/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload job description' };
    }
  },

  // Get all JDs for current user
  getAllJDs: async () => {
    try {
      const response = await api.get('/jd');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job descriptions' };
    }
  },

  // Get single JD by ID
  getJDById: async (id) => {
    try {
      const response = await api.get(`/jd/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job description' };
    }
  },

  // Delete JD (soft delete)
  deleteJD: async (id) => {
    try {
      const response = await api.delete(`/jd/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete job description' };
    }
  },
};

// CV Service
export const cvService = {
  // Upload multiple CVs
  uploadCVs: async (formData) => {
    try {
      const response = await api.post('/cv/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload CVs' };
    }
  },

  // Get all CVs for current user
  getAllCVs: async () => {
    try {
      const response = await api.get('/cv');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CVs' };
    }
  },

  // Get single CV by ID
  getCVById: async (id) => {
    try {
      const response = await api.get(`/cv/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch CV' };
    }
  },

  // Delete CV (soft delete)
  deleteCV: async (id) => {
    try {
      const response = await api.delete(`/cv/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete CV' };
    }
  },
};

// Ranking Service
export const rankingService = {
  // Rank CVs against a JD
  rankCVs: async (jobDescriptionId, cvIds) => {
    try {
      const response = await api.post('/ranking/rank', {
        jdId: jobDescriptionId,
        cvIds,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to rank CVs' };
    }
  },

  // Get all ranking results for current user
  getResults: async () => {
    try {
      const response = await api.get('/ranking/results');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch ranking results' };
    }
  },

  // Get single ranking result by ID
  getResultById: async (id) => {
    try {
      const response = await api.get(`/ranking/results/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch ranking result' };
    }
  },

  // Delete ranking result
  deleteResult: async (id) => {
    try {
      const response = await api.delete(`/ranking/results/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete ranking result' };
    }
  },

  // Export results to CSV
  exportToCSV: (results, jdTitle) => {
    const csvContent = [
      ['Rank', 'Candidate', 'Prediction', 'Confidence Score'].join(','),
      ...results.map((result, index) => [
        index + 1,
        result.filename,
        result.prediction,
        result.confidence.toFixed(2),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ranking_results_${jdTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
