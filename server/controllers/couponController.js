import couponService from '../services/couponService.js';

export const couponController = {
  applyCoupon: async (req, res, next) => {
    try {
      const { code, amount } = req.body;
      const result = await couponService.applyCoupon(code, amount);
      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  listCoupons: async (req, res, next) => {
    try {
      const coupons = await couponService.listCoupons();
      res.status(200).json({
        success: true,
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  },

  createCoupon: async (req, res, next) => {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default couponController;
