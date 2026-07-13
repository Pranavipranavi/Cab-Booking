import api from './api.js';

export const rideService = {
  bookRide: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  getRideHistory: async () => {
    return await api.get('/bookings/history');
  },

  getRideDetails: async (rideId) => {
    return await api.get(`/bookings/${rideId}`);
  },

  cancelRide: async (rideId, cancellationReason) => {
    return await api.post(`/bookings/${rideId}/cancel`, { cancellationReason });
  },

  submitReview: async (reviewData) => {
    return await api.post('/reviews', reviewData);
  },

  getDriverReviews: async (driverId) => {
    return await api.get(`/reviews/driver/${driverId}`);
  },
};

export default rideService;
