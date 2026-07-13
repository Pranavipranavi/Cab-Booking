import api from './api.js';

export const adminService = {
  getDashboardSummary: async () => {
    return await api.get('/admin/summary');
  },

  getAllUsers: async () => {
    return await api.get('/admin/users');
  },

  getAllDrivers: async () => {
    return await api.get('/admin/drivers');
  },

  getAllVehicles: async () => {
    return await api.get('/admin/vehicles');
  },

  getAllPayments: async () => {
    return await api.get('/admin/payments');
  },

  getAllBookings: async () => {
    return await api.get('/admin/bookings');
  },

  createCoupon: async (couponData) => {
    return await api.post('/coupons', couponData);
  },

  getAllCoupons: async () => {
    return await api.get('/coupons');
  },

  getAllReviews: async () => {
    return await api.get('/reviews');
  },
};

export default adminService;
