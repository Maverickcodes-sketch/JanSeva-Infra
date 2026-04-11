import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  googleLogin: (token) => api.post('/auth/google', { token }),
};

// Issues APIs
export const issuesAPI = {
  createIssue: (data) => api.post('/issues', data),
  batchCreateIssues: (issues) => api.post('/issues/batch', { issues }),
  getAllIssues: () => api.get('/issues'),
  getMyIssues: () => api.get('/issues/my'),
  getAssignedIssues: () => api.get('/issues/assigned'),
  getIssueById: (id) => api.get(`/issues/${id}`),
  updateIssue: (id, data) => api.put(`/issues/${id}/update`, data),
  assignIssue: (id, engineerId) => api.put(`/issues/${id}/assign`, { engineerId }),
};

export default api;
