import authService from '../services/authService.js';

export const authController = {
  registerUser: async (req, res, next) => {
    try {
      const { token, user } = await authService.registerUser(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  },

  registerDriver: async (req, res, next) => {
    try {
      const { token, driver } = await authService.registerDriver(req.body);
      res.status(201).json({
        success: true,
        message: 'Driver registered successfully. Pending approval.',
        data: { token, driver },
      });
    } catch (error) {
      next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.loginUser(email, password);
      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  },

  loginDriver: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, driver } = await authService.loginDriver(email, password);
      res.status(200).json({
        success: true,
        message: 'Driver logged in successfully',
        data: { token, driver },
      });
    } catch (error) {
      next(error);
    }
  },

  loginAdmin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, admin } = await authService.loginAdmin(email, password);
      res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        data: { token, admin },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // In stateless JWT, client deletes token. Express can clear mock cookies.
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;
      const response = await authService.forgotPassword(email);
      res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { token, password } = req.body;
      const response = await authService.resetPassword(token, password);
      res.status(200).json({
        success: true,
        message: response.message,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
