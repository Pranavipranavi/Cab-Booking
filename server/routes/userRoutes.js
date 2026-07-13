import express from 'express';
import { body } from 'express-validator';
import userController from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // All user routes require login

const locationRules = [
  body('label').notEmpty().withMessage('Location label is required (e.g. Home)'),
  body('address').notEmpty().withMessage('Address string is required'),
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

const topUpRules = [
  body('amount').isFloat({ min: 1 }).withMessage('Top up amount must be at least $1.00'),
];

// Profile
router.get('/profile', restrictTo('user'), userController.getProfile);
router.put('/profile', restrictTo('user'), userController.updateProfile);
router.delete('/profile', restrictTo('user'), userController.deleteAccount);

// Favorite Locations
router.post(
  '/favorite-locations',
  restrictTo('user'),
  locationRules,
  validateFields,
  userController.addFavoriteLocation
);
router.delete(
  '/favorite-locations/:locationId',
  restrictTo('user'),
  userController.removeFavoriteLocation
);

// Wallet
router.get('/wallet', restrictTo('user'), userController.getWallet);
router.post(
  '/wallet/topup',
  restrictTo('user'),
  topUpRules,
  validateFields,
  userController.topUpWallet
);

export default router;
