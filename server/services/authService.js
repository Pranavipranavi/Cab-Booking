import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../repositories/userRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import adminRepository from '../repositories/adminRepository.js';
import walletRepository from '../repositories/walletRepository.js';
import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ucab_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate Access Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authService = {
  /**
   * Register a new Passenger
   */
  registerUser: async (userData) => {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email address is already in use', 400);
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'user',
    });

    // Initialize user wallet
    await walletRepository.create(newUser._id);
    logger.info(`User registered successfully and wallet initialized: ${newUser.email}`);

    // Return token and safe user details
    const token = generateToken({ id: newUser._id, role: newUser.role });
    const userJson = newUser.toJSON();
    delete userJson.password;

    return { token, user: userJson };
  },

  /**
   * Register a new Driver
   */
  registerDriver: async (driverData) => {
    const existingDriver = await driverRepository.findByEmail(driverData.email);
    if (existingDriver) {
      throw new AppError('Email address is already in use by a driver', 400);
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(driverData.password, 12);

    const newDriver = await driverRepository.create({
      ...driverData,
      password: hashedPassword,
      role: 'driver',
    });

    logger.info(`Driver registered successfully: ${newDriver.email}`);

    const token = generateToken({ id: newDriver._id, role: newDriver.role });
    const driverJson = newDriver.toJSON();
    delete driverJson.password;

    return { token, driver: driverJson };
  },

  /**
   * Login User (Passenger)
   */
  loginUser: async (email, password) => {
    const user = await userRepository.findByEmail(email, true);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Your account has been suspended or deactivated', 403);
    }

    const token = generateToken({ id: user._id, role: user.role });
    const userJson = user.toJSON();
    delete userJson.password;

    logger.info(`User logged in: ${email}`);
    return { token, user: userJson };
  },

  /**
   * Login Driver
   */
  loginDriver: async (email, password) => {
    const driver = await driverRepository.findByEmail(email, true);
    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    if (driver.verificationStatus === 'rejected') {
      throw new AppError('Your driver account application was rejected', 403);
    }

    const token = generateToken({ id: driver._id, role: driver.role });
    const driverJson = driver.toJSON();
    delete driverJson.password;

    logger.info(`Driver logged in: ${email}`);
    return { token, driver: driverJson };
  },

  /**
   * Login Admin
   */
  loginAdmin: async (email, password) => {
    const admin = await adminRepository.findByEmail(email, true);
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const token = generateToken({ id: admin._id, role: admin.role });
    const adminJson = admin.toJSON();
    delete adminJson.password;

    logger.info(`Admin logged in: ${email}`);
    return { token, admin: adminJson };
  },

  /**
   * Helper to create seed superadmin if not exists
   */
  createSeedAdmin: async (adminData) => {
    const existing = await adminRepository.findByEmail(adminData.email);
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      await adminRepository.create({
        ...adminData,
        password: hashedPassword,
      });
      logger.info(`Seed admin account created: ${adminData.email}`);
    }
  },

  /**
   * Forgot Password Link Initiator
   */
  forgotPassword: async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('No user found with that email address', 404);
    }

    const resetToken = jwt.sign({ id: user._id, type: 'reset' }, JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    
    logger.info(`Password reset URL generated: ${resetUrl}`);

    try {
      const { sendHtmlEmail } = await import('../config/nodemailer.js');
      const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #121212;">
          <h2 style="color: #FFC107;">Password Reset Request</h2>
          <p>You requested a password reset for your UCab account.</p>
          <p>Please click the link below to reset your password. This link is valid for 15 minutes:</p>
          <p><a href="${resetUrl}" style="background-color: #FFC107; color: #121212; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a></p>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <small style="color: #777;">If you did not request this, please ignore this email.</small>
        </div>
      `;
      await sendHtmlEmail(user.email, 'UCab Password Reset Link', html);
    } catch (err) {
      logger.error('Failed to send reset email:', err);
    }

    return { message: 'Reset link sent successfully.' };
  },

  /**
   * Reset Password Handler
   */
  resetPassword: async (token, newPassword) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.type !== 'reset') {
        throw new AppError('Invalid password reset token', 400);
      }

      const user = await userRepository.findById(decoded.id);
      if (!user) {
        throw new AppError('User no longer exists', 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await userRepository.updateById(user._id, { password: hashedPassword });

      logger.info(`Password reset successfully for: ${user.email}`);
      return { message: 'Password reset successful' };
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new AppError('Password reset token is invalid or expired', 400);
      }
      throw err;
    }
  }
};

export default authService;
