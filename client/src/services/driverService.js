import api from './api.js';

export const driverService = {
  getProfile: async () => {
    return await api.get('/drivers/profile');
  },

  updateProfile: async (profileData) => {
    return await api.put('/drivers/profile', profileData);
  },

  toggleStatus: async (onlineStatus) => {
    return await api.post('/drivers/status', { onlineStatus });
  },

  updateLocation: async (latitude, longitude) => {
    return await api.post('/drivers/location', { latitude, longitude });
  },

  getEarnings: async () => {
    return await api.get('/drivers/earnings');
  },

  // Vehicle
  addVehicle: async (vehicleData) => {
    return await api.post('/vehicles', vehicleData);
  },

  getVehicle: async () => {
    return await api.get('/vehicles');
  },

  updateVehicle: async (vehicleData) => {
    return await api.put('/vehicles', vehicleData);
  },

  deleteVehicle: async () => {
    return await api.delete('/vehicles');
  },

  // Trip Workflow Actions
  driverArriving: async (rideId) => {
    return await api.post(`/bookings/${rideId}/arriving`);
  },

  startRide: async (rideId, otp) => {
    return await api.post(`/bookings/${rideId}/start`, { otp });
  },

  completeRide: async (rideId) => {
    return await api.post(`/bookings/${rideId}/complete`);
  },
};

export default driverService;
