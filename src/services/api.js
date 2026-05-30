import api from './http';

const handleResponse = (response) => ({
  success: true,
  data: response.data.data || response.data,
  message: response.data.message
});

const handleError = (error) => ({
  success: false,
  error: error.response?.data?.message || 'Une erreur est survenue',
  errors: error.response?.data?.errors || null,
  status: error.response?.status
});

export const authAPI = {
  login: async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const studentsAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/students', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  search: async (query) => {
    try {
      const response = await api.get('/students/search', { params: { q: query } });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  exportCSV: async () => {
    try {
      const response = await api.get('/students/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `etudiants_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return { success: true, message: 'Export réussi' };
    } catch (error) {
      return handleError(error);
    }
  },

  importCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/students/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getStatistics: async () => {
    try {
      const response = await api.get('/students/statistics');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const absencesAPI = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/absences', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (studentId, absenceData) => {
    try {
      const response = await api.post(`/students/${studentId}/absences`, absenceData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getByStudent: async (studentId) => {
    try {
      const response = await api.get(`/students/${studentId}/absences`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, absenceData) => {
    try {
      const response = await api.put(`/absences/${id}`, absenceData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/absences/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  getStatistics: async (params = {}) => {
    try {
      const response = await api.get('/absences/statistics', { params });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const groupsAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/groups');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  create: async (groupData) => {
    try {
      const response = await api.post('/groups', groupData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (id, groupData) => {
    try {
      const response = await api.put(`/groups/${id}`, groupData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/groups/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const settingsAPI = {
  get: async () => {
    try {
      const response = await api.get('/settings');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (settingsData) => {
    try {
      const response = await api.put('/settings', settingsData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export const sanctionsAPI = {
  getConfig: async () => {
    try {
      const response = await api.get('/sanctions/config');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  updateConfig: async (configData) => {
    try {
      const response = await api.put('/sanctions/config', configData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  }
};

export default api;