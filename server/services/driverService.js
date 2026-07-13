import driverRepository from '../repositories/driverRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const driverService = {
  getDriverProfile: async (id) => {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    return driver;
  },

  updateDriverProfile: async (id, updateData) => {
    const safeData = { ...updateData };
    delete safeData.role;
    delete safeData.earnings;
    delete safeData.password;
    delete safeData.email;
    delete safeData.verificationStatus;

    const driver = await driverRepository.updateById(id, safeData);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    logger.info(`Driver profile updated: ${id}`);
    return driver;
  },

  toggleOnlineStatus: async (id, onlineStatus) => {
    if (!['online', 'offline'].includes(onlineStatus)) {
      throw new AppError('Invalid online status. Must be online or offline', 400);
    }

    const driver = await driverRepository.updateOnlineStatus(id, onlineStatus);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }

    logger.info(`Driver ${id} toggled status to ${onlineStatus}`);
    return driver;
  },

  updateLocation: async (id, latitude, longitude) => {
    const driver = await driverRepository.updateLocation(id, latitude, longitude);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    return driver;
  },

  getDriverEarnings: async (id) => {
    const driver = await driverRepository.findById(id);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }
    return {
      earnings: driver.earnings,
      rating: driver.rating,
    };
  },
};

export default driverService;
