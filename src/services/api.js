import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.';
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.';
  return error.response.data?.error?.message || fallback;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/session-expired');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
