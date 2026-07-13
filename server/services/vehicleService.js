import vehicleRepository from '../repositories/vehicleRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const vehicleService = {
  addVehicle: async (driverId, vehicleData) => {
    // Check if driver exists
    const driver = await driverRepository.findById(driverId);
    if (!driver) {
      throw new AppError('Driver not found', 404);
    }

    // Check if driver already has a vehicle
    const existingVehicle = await vehicleRepository.findByDriverId(driverId);
    if (existingVehicle) {
      throw new AppError('Driver already has a vehicle registered', 400);
    }

    const vehicle = await vehicleRepository.create({
      ...vehicleData,
      driver: driverId,
    });

    // Link vehicle to driver
    await driverRepository.updateById(driverId, { assignedVehicle: vehicle._id });

    logger.info(`Vehicle registered for driver ${driverId}: ${vehicle.vehicleNumber}`);
    return vehicle;
  },

  getVehicleByDriver: async (driverId) => {
    const vehicle = await vehicleRepository.findByDriverId(driverId);
    if (!vehicle) {
      throw new AppError('No vehicle found for this driver', 404);
    }
    return vehicle;
  },

  updateVehicle: async (driverId, updateData) => {
    const vehicle = await vehicleRepository.findByDriverId(driverId);
    if (!vehicle) {
      throw new AppError('No vehicle registered for this driver', 404);
    }

    // Protect immutable driver linkage
    const safeData = { ...updateData };
    delete safeData.driver;

    const updatedVehicle = await vehicleRepository.updateById(vehicle._id, safeData);
    logger.info(`Vehicle updated for driver ${driverId}`);
    return updatedVehicle;
  },

  deleteVehicle: async (driverId) => {
    const vehicle = await vehicleRepository.findByDriverId(driverId);
    if (!vehicle) {
      throw new AppError('No vehicle found to delete', 404);
    }

    await vehicleRepository.deleteById(vehicle._id);

    // Unlink from driver
    await driverRepository.updateById(driverId, { assignedVehicle: null });

    logger.info(`Vehicle deleted for driver ${driverId}`);
    return { success: true, message: 'Vehicle deleted successfully' };
  },
};

export default vehicleService;
