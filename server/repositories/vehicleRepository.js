import Vehicle from '../models/VehicleModel.js';

export const vehicleRepository = {
  create: async (vehicleData) => {
    const vehicle = new Vehicle(vehicleData);
    return await vehicle.save();
  },

  findById: async (id) => {
    return await Vehicle.findById(id).populate('driver').exec();
  },

  findByDriverId: async (driverId) => {
    return await Vehicle.findOne({ driver: driverId }).exec();
  },

  updateById: async (id, updateData) => {
    return await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  },

  deleteById: async (id) => {
    return await Vehicle.findByIdAndDelete(id).exec();
  },

  findAll: async (filter = {}) => {
    return await Vehicle.find(filter).populate('driver').exec();
  },
};

export default vehicleRepository;
