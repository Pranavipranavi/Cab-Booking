import express from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import driverRoutes from './driverRoutes.js';
import vehicleRoutes from './vehicleRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import couponRoutes from './couponRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import docRoutes from './docRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', uploadRoutes);
router.use('/api-docs', docRoutes);

export default router;
