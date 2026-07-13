import Ride from '../models/RideModel.js';

export const rideRepository = {
  create: async (rideData) => {
    const ride = new Ride(rideData);
    return await ride.save();
  },

  findById: async (id, selectOtp = false) => {
    let query = Ride.findById(id).populate('rider').populate('driver').populate('vehicle');
    if (selectOtp) {
      query = query.select('+otp');
    }
    return await query.exec();
  },

  updateById: async (id, updateData) => {
    return await Ride.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('rider')
      .populate('driver')
      .populate('vehicle')
      .exec();
  },

  findByRiderId: async (riderId) => {
    return await Ride.find({ rider: riderId })
      .sort({ createdAt: -1 })
      .populate('driver')
      .populate('vehicle')
      .exec();
  },

  findByDriverId: async (driverId) => {
    return await Ride.find({ driver: driverId })
      .sort({ createdAt: -1 })
      .populate('rider')
      .populate('vehicle')
      .exec();
  },

  findCurrentActiveRideForRider: async (riderId) => {
    return await Ride.findOne({
      rider: riderId,
      rideStatus: { $in: ['requested', 'accepted', 'arrived', 'in_progress'] },
    })
      .populate('driver')
      .populate('vehicle')
      .exec();
  },

  findCurrentActiveRideForDriver: async (driverId) => {
    return await Ride.findOne({
      driver: driverId,
      rideStatus: { $in: ['accepted', 'arrived', 'in_progress'] },
    })
      .populate('rider')
      .populate('vehicle')
      .exec();
  },

  findAll: async (filter = {}) => {
    return await Ride.find(filter).populate('rider').populate('driver').populate('vehicle').exec();
  },
};

export default rideRepository;
