import driverService from '../services/driverService.js';

export const driverController = {
  getProfile: async (req, res, next) => {
    try {
      const driver = await driverService.getDriverProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: driver,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const driver = await driverService.updateDriverProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Driver profile updated successfully',
        data: driver,
      });
    } catch (error) {
      next(error);
    }
  },

  toggleOnlineStatus: async (req, res, next) => {
    try {
      const { onlineStatus } = req.body;
      const driver = await driverService.toggleOnlineStatus(req.user.id, onlineStatus);
      res.status(200).json({
        success: true,
        message: `Status changed to ${onlineStatus}`,
        data: { onlineStatus: driver.onlineStatus, availability: driver.availability },
      });
    } catch (error) {
      next(error);
    }
  },

  updateLocation: async (req, res, next) => {
    try {
      const { latitude, longitude } = req.body;
      const driver = await driverService.updateLocation(req.user.id, latitude, longitude);
      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        data: driver.currentLocation,
      });
    } catch (error) {
      next(error);
    }
  },

  getEarnings: async (req, res, next) => {
    try {
      const earningsData = await driverService.getDriverEarnings(req.user.id);
      res.status(200).json({
        success: true,
        data: earningsData,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default driverController;
