import express from 'express';
import { body } from 'express-validator';
import bookingController from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // All ride workflow routes require login

const bookingRules = [
  body('pickupAddress').notEmpty().withMessage('Pickup address is required'),
  body('dropAddress').notEmpty().withMessage('Destination drop address is required'),
  body('pickupCoordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Pickup latitude must be between -90 and 90'),
  body('pickupCoordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Pickup longitude must be between -180 and 180'),
  body('destinationCoordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Destination latitude must be between -90 and 90'),
  body('destinationCoordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Destination longitude must be between -180 and 180'),
];

const otpRules = [
  body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be exactly 4 digits'),
];

const cancelRules = [
  body('cancellationReason').notEmpty().withMessage('Cancellation reason is required'),
];

// Passenger Book Ride
router.post('/', restrictTo('user'), bookingRules, validateFields, bookingController.bookRide);

// Ride History (Both User and Driver can fetch)
router.get('/history', restrictTo('user', 'driver'), bookingController.getRideHistory);

// Specific Ride Details
router.get('/:rideId', restrictTo('user', 'driver', 'admin'), bookingController.getRideDetails);

// Cancel Ride
router.post(
  '/:rideId/cancel',
  restrictTo('user', 'driver', 'admin'),
  cancelRules,
  validateFields,
  bookingController.cancelRide
);

// Driver OTP & Status Flow
router.post('/:rideId/arriving', restrictTo('driver'), bookingController.driverArriving);
router.post(
  '/:rideId/start',
  restrictTo('driver'),
  otpRules,
  validateFields,
  bookingController.verifyOtpAndStartRide
);
router.post('/:rideId/complete', restrictTo('driver'), bookingController.completeRide);

export default router;
