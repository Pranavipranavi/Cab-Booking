import api from './api.js';

export const paymentService = {
  processWalletPayment: async (rideId) => {
    return await api.post('/payments/charge', { rideId });
  },

  getTransactionHistory: async () => {
    return await api.get('/payments/transactions');
  },
};

export default paymentService;
