import express from 'express';
import { body } from 'express-validator';
import reviewController from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Require login

const reviewRules = [
  body('rideId').notEmpty().withMessage('Ride ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').optional().isString(),
];

router.post('/', restrictTo('user'), reviewRules, validateFields, reviewController.addReview);
router.get('/driver/:driverId', restrictTo('user', 'driver', 'admin'), reviewController.getReviews);

export default router;
