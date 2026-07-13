import Coupon from '../models/CouponModel.js';

export const couponRepository = {
  create: async (couponData) => {
    const coupon = new Coupon(couponData);
    return await coupon.save();
  },

  findByCode: async (code) => {
    return await Coupon.findOne({ code, active: true }).exec();
  },

  updateById: async (id, updateData) => {
    return await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).exec();
  },

  findAll: async (filter = {}) => {
    return await Coupon.find(filter).exec();
  },

  incrementUsageCount: async (code) => {
    return await Coupon.findOneAndUpdate(
      { code },
      { $inc: { usageCount: 1 } },
      { new: true }
    ).exec();
  },
};

export default couponRepository;
