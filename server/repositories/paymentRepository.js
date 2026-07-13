import Payment from '../models/PaymentModel.js';

export const paymentRepository = {
  create: async (paymentData) => {
    const payment = new Payment(paymentData);
    return await payment.save();
  },

  findById: async (id) => {
    return await Payment.findById(id).populate('ride').populate('user').exec();
  },

  findByUserId: async (userId) => {
    return await Payment.find({ user: userId }).sort({ createdAt: -1 }).populate('ride').exec();
  },

  findByRideId: async (rideId) => {
    return await Payment.findOne({ ride: rideId }).exec();
  },

  findAll: async (filter = {}) => {
    return await Payment.find(filter).populate('user').populate('ride').exec();
  },
};

export default paymentRepository;
