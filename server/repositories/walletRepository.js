import Wallet from '../models/WalletModel.js';

export const walletRepository = {
  create: async (userId) => {
    const wallet = new Wallet({ user: userId, balance: 0.0, transactions: [] });
    return await wallet.save();
  },

  findByUserId: async (userId) => {
    return await Wallet.findOne({ user: userId }).exec();
  },

  addTransaction: async (userId, transaction) => {
    const amountModifier = transaction.type === 'credit' ? transaction.amount : -transaction.amount;

    return await Wallet.findOneAndUpdate(
      { user: userId },
      {
        $inc: { balance: amountModifier },
        $push: { transactions: transaction },
      },
      { new: true, runValidators: true }
    ).exec();
  },
};

export default walletRepository;
