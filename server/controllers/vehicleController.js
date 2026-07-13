import vehicleService from '../services/vehicleService.js';

export const vehicleController = {
  addVehicle: async (req, res, next) => {
    try {
      const vehicle = await vehicleService.addVehicle(req.user.id, req.body);
      res.status(201).json({
        success: true,
        message: 'Vehicle added successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  getVehicle: async (req, res, next) => {
    try {
      const vehicle = await vehicleService.getVehicleByDriver(req.user.id);
      res.status(200).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  updateVehicle: async (req, res, next) => {
    try {
      const vehicle = await vehicleService.updateVehicle(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Vehicle updated successfully',
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteVehicle: async (req, res, next) => {
    try {
      const response = await vehicleService.deleteVehicle(req.user.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default vehicleController;
