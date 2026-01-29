import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('senzwa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('senzwa_token');
      localStorage.removeItem('senzwa_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Applicants
export const applicantAPI = {
  create: (data) => api.post('/applicants', data),
  getMe: () => api.get('/applicants/me'),
  update: (data) => api.put('/applicants/me', data),
};

// Visas
export const visaAPI = {
  getCategories: () => api.get('/visas/categories'),
  getCategory: (id) => api.get(`/visas/categories/${id}`),
  getCategoryDocuments: (id) => api.get(`/visas/categories/${id}/documents`),
  getGroups: () => api.get('/visas/groups'),
};

// Eligibility
export const eligibilityAPI = {
  evaluate: (profile) => api.post('/eligibility/evaluate', profile),
  recommend: (profile) => api.post('/eligibility/recommend', profile),
  getMyEvaluation: () => api.get('/eligibility/my-evaluation'),
  checkCategory: (data) => api.post('/eligibility/check-category', data),
};

// Documents
export const documentAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByApplication: (applicationId) => api.get(`/documents/application/${applicationId}`),
  validate: (id, data) => api.post(`/documents/${id}/validate`, data),
  checkCompleteness: (data) => api.post('/documents/check-completeness', data),
  delete: (id) => api.delete(`/documents/${id}`),
};

// Applications
export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  list: (params) => api.get('/applications', { params }),
  get: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  compile: (id) => api.post(`/applications/${id}/compile`),
  getAudit: (id) => api.get(`/applications/${id}/audit`),
};

export default api;
