import userRepository from '../repositories/userRepository.js';
import walletRepository from '../repositories/walletRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const userService = {
  getUserProfile: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  updateUserProfile: async (id, updateData) => {
    // Avoid overriding roles or critical fields in profile update
    const safeData = { ...updateData };
    delete safeData.role;
    delete safeData.walletBalance;
    delete safeData.password;
    delete safeData.email;

    const user = await userRepository.updateById(id, safeData);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    logger.info(`User profile updated: ${id}`);
    return user;
  },

  deleteUserAccount: async (id) => {
    const user = await userRepository.deleteById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    logger.info(`User profile deleted: ${id}`);
    return { success: true, message: 'Account deleted successfully' };
  },

  addFavoriteLocation: async (userId, locationData) => {
    const user = await userRepository.addFavoriteLocation(userId, locationData);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user.favoriteLocations;
  },

  removeFavoriteLocation: async (userId, locationId) => {
    const user = await userRepository.removeFavoriteLocation(userId, locationId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user.favoriteLocations;
  },

  getUserWallet: async (userId) => {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) {
      // Lazy initialize if missing
      return await walletRepository.create(userId);
    }
    return wallet;
  },

  topUpWallet: async (userId, amount, method) => {
    if (amount <= 0) {
      throw new AppError('Top up amount must be greater than zero', 400);
    }

    const transaction = {
      amount,
      type: 'credit',
      description: `Wallet Top Up via ${method}`,
      referenceId: `TOPUP-${Date.now()}`,
    };

    // Update wallet and add transaction
    const wallet = await walletRepository.addTransaction(userId, transaction);

    // Sync User schema cache (walletBalance field)
    await userRepository.updateById(userId, { walletBalance: wallet.balance });

    logger.info(`Wallet topped up for user ${userId} by $${amount}`);
    return wallet;
  },
};

export default userService;
