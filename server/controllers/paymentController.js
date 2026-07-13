import paymentService from '../services/paymentService.js';

export const paymentController = {
  processWalletPayment: async (req, res, next) => {
    try {
      const { rideId } = req.body;
      const payment = await paymentService.processWalletPayment(req.user.id, rideId);
      res.status(200).json({
        success: true,
        message: 'Payment processed successfully using Wallet balance',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  getTransactionHistory: async (req, res, next) => {
    try {
      const transactions = await paymentService.getTransactionHistory(req.user.id);
      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default paymentController;
