import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Notification must have a recipient'],
      index: true,
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['User', 'Driver', 'Admin'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'booking', 'alert'],
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;
