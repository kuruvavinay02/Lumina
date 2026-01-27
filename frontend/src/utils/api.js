import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lumina_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const safetyAPI = {
  createSignal: (data) => api.post('/signals', data),
  getSignals: (params) => api.get('/signals', { params }),
  validateSignal: (signalId, validationType) =>
    api.post(`/signals/${signalId}/validate`, { signal_id: signalId, validation_type: validationType }),
  getAreaScores: (city = 'demo_city') => api.get('/areas/scores', { params: { city } }),
  planRoute: (data) => api.post('/routes/plan', data),
  getHotspots: (city = 'demo_city') => api.get('/hotspots', { params: { city } }),
  getDashboardMetrics: (city = 'demo_city') => api.get('/dashboard/metrics', { params: { city } }),
  getRiskTrends: (city = 'demo_city', days = 30) =>
    api.get('/dashboard/trends', { params: { city, days } }),
  exportAnalytics: (data) => api.post('/dashboard/export', data),
  getCities: () => api.get('/cities'),
  getTransparencyInfo: () => api.get('/privacy/transparency')
};

export default api;