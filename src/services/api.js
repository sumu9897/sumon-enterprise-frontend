import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const unsafeMethods = new Set(['post', 'put', 'patch', 'delete']);

const legacyToken = localStorage.getItem('token');
if (legacyToken) {
  sessionStorage.setItem('token', legacyToken);
  localStorage.setItem('adminSession', '1');
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
}

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error.code === 'ECONNABORTED') return 'The request took too long. Please try again.';
  if (!error.response) return 'Unable to reach the server. Check your connection and try again.';
  const apiError = error.response.data?.error;
  if (Array.isArray(apiError?.errors) && apiError.errors.length > 0) {
    return apiError.errors.map(({ field, message }) => (
      field ? `${field}: ${message}` : message
    )).join(' · ');
  }
  return apiError?.message || fallback;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    const csrfToken = sessionStorage.getItem('csrfToken');
    if (csrfToken && unsafeMethods.has(String(config.method || '').toLowerCase())) {
      config.headers['X-CSRF-Token'] = csrfToken;
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
    const fallbackToken = sessionStorage.getItem('token');
    if (error.response?.status === 401 && !isLoginRequest && fallbackToken && !error.config?._bearerRetried) {
      const retryConfig = { ...error.config, _bearerRetried: true };
      retryConfig.headers = { ...retryConfig.headers, Authorization: `Bearer ${fallbackToken}` };
      return api.request(retryConfig);
    }
    if (error.response?.status === 401 && !isLoginRequest && localStorage.getItem('adminSession')) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('csrfToken');
      localStorage.removeItem('adminSession');
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/session-expired');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
