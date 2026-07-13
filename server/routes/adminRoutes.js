import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin')); // Force admin-only for everything below

router.get('/summary', adminController.getDashboardSummary);
router.get('/users', adminController.getAllUsers);
router.get('/drivers', adminController.getAllDrivers);
router.get('/vehicles', adminController.getAllVehicles);
router.get('/payments', adminController.getAllPayments);
router.get('/bookings', adminController.getAllBookings);

export default router;
