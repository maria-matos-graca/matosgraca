// services/auth.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔍 [DEBUG] VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔍 [DEBUG] API_URL final:', API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔍 [DEBUG] baseURL final:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  console.log('🚀 [REQUEST]', config.method.toUpperCase(), config.baseURL + config.url);
  return config;
});

// ✅ Completar o authService com todos os métodos
export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro na conexão' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token exists:', !!token);
  console.log('🔑 Token value:', token?.substring(0, 50) + '...');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🚀 [REQUEST]', config.method.toUpperCase(), config.url);
  return config;
});
export default api;