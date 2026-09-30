import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studysphere_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studysphere_token');
      localStorage.removeItem('studysphere_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Materials
export const materialsAPI = {
  getAll: (params) => api.get('/materials', { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (formData) => api.post('/materials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
  markUseful: (id) => api.post(`/materials/${id}/useful`),
  search: (params) => api.get('/materials/search', { params }),
};

// Bookmarks
export const bookmarksAPI = {
  getAll: () => api.get('/bookmarks'),
  add: (materialId) => api.post(`/bookmarks/${materialId}`),
  remove: (materialId) => api.delete(`/bookmarks/${materialId}`),
};

// Teacher
export const teacherAPI = {
  getPending: () => api.get('/teacher/pending'),
  approve: (id, data) => api.post(`/teacher/approve/${id}`, data),
  reject: (id, data) => api.post(`/teacher/reject/${id}`, data),
  getReports: () => api.get('/teacher/reports'),
  getStats: () => api.get('/teacher/stats'),
};

// Announcements
export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
};

// Notifications
export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markRead: () => api.put('/notifications/read'),
};

// Reports
export const reportsAPI = {
  create: (data) => api.post('/reports', data),
};

// AI
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  summarize: (data) => api.post('/ai/summarize', data),
  explain: (data) => api.post('/ai/explain', data),
  quiz: (data) => api.post('/ai/quiz', data),
  suggestTags: (data) => api.post('/ai/tags', data),
};

export default api;
