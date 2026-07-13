import express from 'express';
import { body } from 'express-validator';
import couponController from '../controllers/couponController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Require login

const applyRules = [
  body('code').notEmpty().withMessage('Coupon code is required'),
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Ride fare amount must be positive to apply discount'),
];

const createRules = [
  body('code').notEmpty().withMessage('Coupon code is required'),
  body('discountType')
    .isIn(['fixed', 'percentage'])
    .withMessage('Discount type must be fixed or percentage'),
  body('discountValue').isFloat({ min: 0.1 }).withMessage('Discount value must be positive'),
  body('expiryDate').isISO8601().withMessage('Expiry date must be a valid ISO8601 timestamp'),
  body('usageLimit').isInt({ min: 1 }).withMessage('Usage limit must be at least 1'),
];

router.post('/apply', restrictTo('user'), applyRules, validateFields, couponController.applyCoupon);
router.get('/', restrictTo('user', 'admin'), couponController.listCoupons);
router.post('/', restrictTo('admin'), createRules, validateFields, couponController.createCoupon);

export default router;
