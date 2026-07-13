import api from './api.js';

export const userService = {
  getProfile: async () => {
    return await api.get('/users/profile');
  },

  updateProfile: async (profileData) => {
    return await api.put('/users/profile', profileData);
  },

  deleteAccount: async () => {
    return await api.delete('/users/profile');
  },

  addFavoriteLocation: async (locationData) => {
    return await api.post('/users/favorite-locations', locationData);
  },

  removeFavoriteLocation: async (locationId) => {
    return await api.delete(`/users/favorite-locations/${locationId}`);
  },

  getWallet: async () => {
    return await api.get('/users/wallet');
  },

  topUpWallet: async (amount, method = 'card') => {
    return await api.post('/users/wallet/topup', { amount, method });
  },

  applyCoupon: async (code, amount) => {
    return await api.post('/coupons/apply', { code, amount });
  },

  getNotifications: async () => {
    return await api.get('/notifications');
  },

  markNotificationRead: async (notificationId) => {
    return await api.post(`/notifications/${notificationId}/read`);
  },

  markAllNotificationsRead: async () => {
    return await api.post('/notifications/read-all');
  },
};

export default userService;
