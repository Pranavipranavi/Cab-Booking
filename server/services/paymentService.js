import paymentRepository from '../repositories/paymentRepository.js';
import rideRepository from '../repositories/rideRepository.js';
import walletRepository from '../repositories/walletRepository.js';
import userRepository from '../repositories/userRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

export const paymentService = {
  /**
   * Process payment for a completed ride using Wallet
   */
  processWalletPayment: async (userId, rideId) => {
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new AppError('Ride details not found', 404);
    }

    if (ride.rider._id.toString() !== userId) {
      throw new AppError('Unauthorized payment attempt', 403);
    }

    if (ride.rideStatus !== 'completed') {
      throw new AppError('Cannot pay for a ride that is not completed', 400);
    }

    if (ride.paymentStatus === 'completed') {
      throw new AppError('Ride has already been paid for', 400);
    }

    const amount = ride.finalFare || ride.estimatedFare;

    // Check rider wallet balance
    const riderWallet = await walletRepository.findByUserId(userId);
    if (!riderWallet || riderWallet.balance < amount) {
      throw new AppError('Insufficient wallet balance. Please top up your wallet', 400);
    }

    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Debit Rider Wallet
    const updatedRiderWallet = await walletRepository.addTransaction(userId, {
      amount,
      type: 'debit',
      description: `Payment for Ride #${rideId}`,
      referenceId: rideId,
    });
    // Sync User schema balance cache
    await userRepository.updateById(userId, { walletBalance: updatedRiderWallet.balance });

    // 2. Credit Driver Earnings
    if (ride.driver) {
      const driverObj = await driverRepository.findById(ride.driver._id);
      if (driverObj) {
        // Driver gets 80% of the fare, platform takes 20% commission
        const driverShare = parseFloat((amount * 0.8).toFixed(2));
        const newEarnings = driverObj.earnings + driverShare;
        await driverRepository.updateById(ride.driver._id, { earnings: newEarnings });
        logger.info(`Credited driver ${ride.driver._id} with $${driverShare}`);
      }
    }

    // 3. Create Payment Log
    const payment = await paymentRepository.create({
      ride: rideId,
      user: userId,
      amount,
      method: 'wallet',
      transactionId,
      status: 'completed',
    });

    // 4. Update Ride payment status
    await rideRepository.updateById(rideId, { paymentStatus: 'completed' });

    logger.info(`Payment completed successfully for Ride #${rideId}. TransID: ${transactionId}`);
    return payment;
  },

  /**
   * Get transactions for User
   */
  getTransactionHistory: async (userId) => {
    return await paymentRepository.findByUserId(userId);
  },
};

export default paymentService;
