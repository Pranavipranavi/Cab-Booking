import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: [true, 'Payment must be associated with a ride'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Payment must belong to a user'],
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0.01,
    },
    method: {
      type: String,
      enum: ['card', 'paypal', 'apple_pay', 'wallet', 'cash'],
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ ride: 1 });
PaymentSchema.index({ user: 1 });

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
