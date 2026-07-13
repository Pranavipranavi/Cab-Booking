import Notification from '../models/NotificationModel.js';

export const notificationRepository = {
  create: async (notificationData) => {
    const notification = new Notification(notificationData);
    return await notification.save();
  },

  findByRecipientId: async (recipientId) => {
    return await Notification.find({ recipient: recipientId }).sort({ createdAt: -1 }).exec();
  },

  markAsRead: async (id) => {
    return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
  },

  markAllAsReadForRecipient: async (recipientId) => {
    return await Notification.updateMany(
      { recipient: recipientId, isRead: false },
      { isRead: true }
    ).exec();
  },
};

export default notificationRepository;
