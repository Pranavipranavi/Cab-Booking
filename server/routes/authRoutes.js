import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/authController.js';
import validateFields from '../middlewares/validationMiddleware.js';

const router = express.Router();

const userRegisterRules = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
];

const driverRegisterRules = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('licenseNumber').notEmpty().withMessage('Driver license number is required'),
  body('identityNumber').notEmpty().withMessage('Government ID card number is required'),
];

const loginRules = [
  body('email').isEmail().withMessage('Provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', userRegisterRules, validateFields, authController.registerUser);
router.post('/register-driver', driverRegisterRules, validateFields, authController.registerDriver);

router.post('/login', loginRules, validateFields, authController.loginUser);
router.post('/login-driver', loginRules, validateFields, authController.loginDriver);
router.post('/login-admin', loginRules, validateFields, authController.loginAdmin);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
