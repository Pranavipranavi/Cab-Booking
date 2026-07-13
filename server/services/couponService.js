import couponRepository from '../repositories/couponRepository.js';
import AppError from '../utils/appError.js';

export const couponService = {
  applyCoupon: async (code, currentAmount) => {
    const coupon = await couponRepository.findByCode(code.toUpperCase());
    if (!coupon) {
      throw new AppError('Invalid or inactive coupon code', 400);
    }

    // Expiry check
    if (new Date(coupon.expiryDate) < new Date()) {
      throw new AppError('This coupon code has expired', 400);
    }

    // Limit check
    if (coupon.usageCount >= coupon.usageLimit) {
      throw new AppError('This coupon usage limit has been reached', 400);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = parseFloat(((currentAmount * coupon.discountValue) / 100).toFixed(2));
    } else {
      discount = coupon.discountValue;
    }

    // Discount cannot exceed original amount
    const finalDiscount = Math.min(discount, currentAmount);
    const finalAmount = parseFloat((currentAmount - finalDiscount).toFixed(2));

    // Increment coupon usage count
    await couponRepository.incrementUsageCount(coupon.code);

    return {
      code: coupon.code,
      discount: finalDiscount,
      finalAmount,
    };
  },

  listCoupons: async () => {
    return await couponRepository.findAll({ active: true });
  },

  createCoupon: async (couponData) => {
    const existing = await couponRepository.findByCode(couponData.code.toUpperCase());
    if (existing) {
      throw new AppError('Coupon code already exists', 400);
    }
    return await couponRepository.create({
      ...couponData,
      code: couponData.code.toUpperCase(),
    });
  },
};

export default couponService;
