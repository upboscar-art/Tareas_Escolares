import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Envia el token automáticamente para que no te de error 401
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;