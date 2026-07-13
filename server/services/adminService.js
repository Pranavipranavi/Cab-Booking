import userRepository from '../repositories/userRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import vehicleRepository from '../repositories/vehicleRepository.js';
import rideRepository from '../repositories/rideRepository.js';
import paymentRepository from '../repositories/paymentRepository.js';

export const adminService = {
  getDashboardSummary: async () => {
    const users = await userRepository.findAll();
    const drivers = await driverRepository.findAll();
    const vehicles = await vehicleRepository.findAll();
    const rides = await rideRepository.findAll();
    const payments = await paymentRepository.findAll();

    const activeRidesCount = rides.filter((r) =>
      ['requested', 'accepted', 'arrived', 'in_progress'].includes(r.rideStatus)
    ).length;

    const totalRevenue = payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingDrivers = drivers.filter((d) => d.verificationStatus === 'pending').length;

    return {
      totalUsers: users.length,
      totalDrivers: drivers.length,
      totalVehicles: vehicles.length,
      totalRides: rides.length,
      activeRides: activeRidesCount,
      totalPayments: payments.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      pendingDriverRegistrations: pendingDrivers,
    };
  },

  getAllUsers: async () => {
    return await userRepository.findAll();
  },

  getAllDrivers: async () => {
    return await driverRepository.findAll();
  },

  getAllVehicles: async () => {
    return await vehicleRepository.findAll();
  },

  getAllPayments: async () => {
    return await paymentRepository.findAll();
  },

  getAllBookings: async () => {
    return await rideRepository.findAll();
  },
};

export default adminService;
