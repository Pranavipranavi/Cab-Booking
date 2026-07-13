import api from './api.js';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  loginDriver: async (credentials) => {
    return await api.post('/auth/login-driver', credentials);
  },

  loginAdmin: async (credentials) => {
    return await api.post('/auth/login-admin', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  registerDriver: async (driverData) => {
    return await api.post('/auth/register-driver', driverData);
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },
};

export default authService;
