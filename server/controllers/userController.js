import userService from '../services/userService.js';

export const userController = {
  getProfile: async (req, res, next) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const user = await userService.updateUserProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteAccount: async (req, res, next) => {
    try {
      const response = await userService.deleteUserAccount(req.user.id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  addFavoriteLocation: async (req, res, next) => {
    try {
      const locations = await userService.addFavoriteLocation(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Favorite location added successfully',
        data: locations,
      });
    } catch (error) {
      next(error);
    }
  },

  removeFavoriteLocation: async (req, res, next) => {
    try {
      const locations = await userService.removeFavoriteLocation(
        req.user.id,
        req.params.locationId
      );
      res.status(200).json({
        success: true,
        message: 'Favorite location removed successfully',
        data: locations,
      });
    } catch (error) {
      next(error);
    }
  },

  getWallet: async (req, res, next) => {
    try {
      const wallet = await userService.getUserWallet(req.user.id);
      res.status(200).json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  },

  topUpWallet: async (req, res, next) => {
    try {
      const { amount, method } = req.body;
      const wallet = await userService.topUpWallet(req.user.id, amount, method || 'card');
      res.status(200).json({
        success: true,
        message: 'Wallet topped up successfully',
        data: wallet,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
