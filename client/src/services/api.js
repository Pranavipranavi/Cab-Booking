import axios from 'axios';

// Base URL falls back to server URL path /api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Prepare for token attachment in future phases
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Prepare for standard responses and error logging
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Error logging placeholder
    console.error('[API Response Error]:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Future phase: Handle token expiry, auto-logout, custom messaging
    return Promise.reject(error);
  }
);

export default api;
