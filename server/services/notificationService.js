import notificationRepository from '../repositories/notificationRepository.js';
import AppError from '../utils/appError.js';

export const notificationService = {
  getNotificationsForUser: async (recipientId) => {
    return await notificationRepository.findByRecipientId(recipientId);
  },

  markAsRead: async (recipientId, notificationId) => {
    const notification = await notificationRepository.markAsRead(notificationId);
    if (!notification) {
      throw new AppError('Notification not found', 404);
    }
    return notification;
  },

  markAllAsRead: async (recipientId) => {
    await notificationRepository.markAllAsReadForRecipient(recipientId);
    return { success: true, message: 'All notifications marked as read' };
  },
};

export default notificationService;
