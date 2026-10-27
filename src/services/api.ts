import axios from 'axios';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agritech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto handle token expiration
      console.warn('Session expired or unauthorized.');
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const api = {
  // Auth
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),

  // Farms
  getFarms: () => apiClient.get('/farms'),
  getFarmById: (id: string) => apiClient.get(`/farms/${id}`),
  createFarm: (data: any) => apiClient.post('/farms', data),
  updateFarm: (id: string, data: any) => apiClient.put(`/farms/${id}`, data),
  deleteFarm: (id: string) => apiClient.delete(`/farms/${id}`),

  // Crops
  getCrops: (params?: any) => apiClient.get('/crops', { params }),
  createCrop: (data: any) => apiClient.post('/crops', data),
  updateCrop: (id: string, data: any) => apiClient.put(`/crops/${id}`, data),
  deleteCrop: (id: string) => apiClient.delete(`/crops/${id}`),

  // Soil
  getSoilReports: (params?: any) => apiClient.get('/soil-reports', { params }),
  submitSoilAnalysis: (data: any) => apiClient.post('/soil-reports', data),

  // Weather & Alerts
  getWeather: (params?: any) => apiClient.get('/weather', { params }),
  getAlerts: (params?: any) => apiClient.get('/alerts', { params }),

  // Resources & Orders
  getResources: (params?: any) => apiClient.get('/resources', { params }),
  getOrders: () => apiClient.get('/orders'),
  createOrder: (data: any) => apiClient.post('/orders', data),
  updateOrderStatus: (id: string, data: any) => apiClient.put(`/orders/${id}/status`, data),

  // Consultations
  getConsultations: () => apiClient.get('/consultations'),
  bookConsultation: (data: any) => apiClient.post('/consultations', data),
  updateConsultation: (id: string, data: any) => apiClient.put(`/consultations/${id}`, data),

  // Forum
  getForumPosts: (params?: any) => apiClient.get('/forum', { params }),
  createForumPost: (data: any) => apiClient.post('/forum', data),
  addComment: (id: string, data: any) => apiClient.post(`/forum/${id}/comments`, data),
  toggleLike: (id: string) => apiClient.post(`/forum/${id}/like`),

  // Markets & Schemes
  getMandiPrices: (params?: any) => apiClient.get('/mandi-prices', { params }),
  getGovernmentSchemes: (params?: any) => apiClient.get('/government-schemes', { params }),

  // Admin
  getAdminStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (id: string, role: string) => apiClient.put(`/admin/users/${id}/role`, { role }),
  broadcastAlert: (data: any) => apiClient.post('/admin/alerts', data),
  addResource: (data: any) => apiClient.post('/admin/resources', data),
  reseedDatabase: () => apiClient.post('/admin/reseed'),
};
