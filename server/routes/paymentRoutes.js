import express from 'express';
import { body } from 'express-validator';
import paymentController from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Require login

const paymentRules = [
  body('rideId').notEmpty().withMessage('Ride ID is required for processing payment'),
];

router.post(
  '/charge',
  restrictTo('user'),
  paymentRules,
  validateFields,
  paymentController.processWalletPayment
);
router.get('/transactions', restrictTo('user'), paymentController.getTransactionHistory);

export default router;
