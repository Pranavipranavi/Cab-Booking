import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // Require login for notifications

router.get('/', notificationController.getNotifications);
router.post('/:notificationId/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;
