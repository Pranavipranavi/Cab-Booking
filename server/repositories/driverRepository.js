import Driver from '../models/DriverModel.js';

export const driverRepository = {
  create: async (driverData) => {
    const driver = new Driver(driverData);
    return await driver.save();
  },

  findByEmail: async (email, selectPassword = false) => {
    let query = Driver.findOne({ email });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query.exec();
  },

  findById: async (id) => {
    return await Driver.findById(id).populate('assignedVehicle').exec();
  },

  updateById: async (id, updateData) => {
    return await Driver.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('assignedVehicle')
      .exec();
  },

  deleteById: async (id) => {
    return await Driver.findByIdAndDelete(id).exec();
  },

  updateLocation: async (id, latitude, longitude) => {
    return await Driver.findByIdAndUpdate(
      id,
      { 'currentLocation.latitude': latitude, 'currentLocation.longitude': longitude },
      { new: true }
    ).exec();
  },

  updateOnlineStatus: async (id, status) => {
    const availability = status === 'online';
    return await Driver.findByIdAndUpdate(
      id,
      { onlineStatus: status, availability },
      { new: true }
    ).exec();
  },

  findNearbyAvailableDrivers: async (latitude, longitude, _radiusInKm = 5) => {
    // Spatial search stub: find online drivers who are available
    // For Phase 2, we simulate this by returning online and available drivers
    return await Driver.find({
      onlineStatus: 'online',
      availability: true,
    })
      .populate('assignedVehicle')
      .exec();
  },

  findAll: async (filter = {}) => {
    return await Driver.find(filter).populate('assignedVehicle').exec();
  },
};

export default driverRepository;
