import notificationService from '../services/notificationService.js';

export const notificationController = {
  getNotifications: async (req, res, next) => {
    try {
      const notifications = await notificationService.getNotificationsForUser(req.user.id);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  markAsRead: async (req, res, next) => {
    try {
      const notification = await notificationService.markAsRead(
        req.user.id,
        req.params.notificationId
      );
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  markAllAsRead: async (req, res, next) => {
    try {
      const result = await notificationService.markAllAsRead(req.user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default notificationController;
