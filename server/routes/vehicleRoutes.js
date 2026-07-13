import express from 'express';
import { body } from 'express-validator';
import vehicleController from '../controllers/vehicleController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(protect); // Require login

const vehicleRules = [
  body('vehicleNumber').notEmpty().withMessage('Vehicle registration plate number is required'),
  body('vehicleType')
    .isIn(['economy', 'premium', 'suv', 'luxury'])
    .withMessage('Invalid vehicle type'),
  body('brand').notEmpty().withMessage('Vehicle brand is required'),
  body('model').notEmpty().withMessage('Vehicle model is required'),
  body('color').notEmpty().withMessage('Vehicle color is required'),
  body('seatingCapacity').isInt({ min: 1 }).withMessage('Seating capacity must be at least 1'),
  body('insuranceNumber').notEmpty().withMessage('Insurance number is required'),
  body('rcNumber').notEmpty().withMessage('Registration Certificate is required'),
  body('pollutionCertificate').notEmpty().withMessage('Pollution certificate is required'),
];

router.post('/', restrictTo('driver'), vehicleRules, validateFields, vehicleController.addVehicle);
router.get('/', restrictTo('driver'), vehicleController.getVehicle);
router.put('/', restrictTo('driver'), vehicleController.updateVehicle);
router.delete('/', restrictTo('driver'), vehicleController.deleteVehicle);

export default router;
