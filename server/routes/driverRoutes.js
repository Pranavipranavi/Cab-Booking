import express from 'express';
import { body } from 'express-validator';
import driverController from '../controllers/driverController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Require login for all driver routes

const statusRules = [
  body('onlineStatus').isIn(['online', 'offline']).withMessage('Status must be online or offline'),
];

const locationRules = [
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
];

router.get('/profile', restrictTo('driver'), driverController.getProfile);
router.put('/profile', restrictTo('driver'), driverController.updateProfile);
router.post(
  '/status',
  restrictTo('driver'),
  statusRules,
  validateFields,
  driverController.toggleOnlineStatus
);
router.post(
  '/location',
  restrictTo('driver'),
  locationRules,
  validateFields,
  driverController.updateLocation
);
router.get('/earnings', restrictTo('driver'), driverController.getEarnings);

export default router;
