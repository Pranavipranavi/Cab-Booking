import mongoose from 'mongoose';

const WalletTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  description: { type: String, required: true },
  referenceId: { type: String, default: null }, // e.g. Payment ID or Ride ID
  timestamp: { type: Date, default: Date.now },
});

const WalletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wallet must belong to a user'],
      unique: true,
    },
    balance: {
      type: Number,
      default: 0.0,
      min: [0, 'Wallet balance cannot be negative'],
    },
    transactions: [WalletTransactionSchema],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model('Wallet', WalletSchema);

export default Wallet;
