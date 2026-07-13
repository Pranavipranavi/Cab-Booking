import adminService from '../services/adminService.js';

export const adminController = {
  getDashboardSummary: async (req, res, next) => {
    try {
      const summary = await adminService.getDashboardSummary();
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const users = await adminService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllDrivers: async (req, res, next) => {
    try {
      const drivers = await adminService.getAllDrivers();
      res.status(200).json({
        success: true,
        data: drivers,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllVehicles: async (req, res, next) => {
    try {
      const vehicles = await adminService.getAllVehicles();
      res.status(200).json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllPayments: async (req, res, next) => {
    try {
      const payments = await adminService.getAllPayments();
      res.status(200).json({
        success: true,
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  getAllBookings: async (req, res, next) => {
    try {
      const bookings = await adminService.getAllBookings();
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default adminController;
