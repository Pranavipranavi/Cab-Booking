import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import driverRepository from '../repositories/driverRepository.js';
import adminRepository from '../repositories/adminRepository.js';
import AppError from '../utils/appError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ucab_super_secret_jwt_key_2026';

/**
 * Protect route with JWT verification
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if user still exists
    let currentUser = null;
    if (decoded.role === 'user') {
      currentUser = await userRepository.findById(decoded.id);
    } else if (decoded.role === 'driver') {
      currentUser = await driverRepository.findById(decoded.id);
    } else if (decoded.role === 'admin') {
      currentUser = await adminRepository.findById(decoded.id);
    }

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access and store credentials in request context
    req.user = {
      id: currentUser._id.toString(),
      role: decoded.role,
      email: currentUser.email,
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401));
    }
    next(error);
  }
};

/**
 * Restrict routes to specific roles (Authorization)
 * @param  {...string} roles - Approved roles, e.g. 'admin', 'driver'
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
