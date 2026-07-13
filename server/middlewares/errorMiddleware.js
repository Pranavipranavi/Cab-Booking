import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

/**
 * 404 Not Found Middleware
 */
export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
};

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    logger.error(`Error: ${err.message}`, err);
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production Mode: don't leak internals for programming errors
    if (err.isOperational) {
      logger.warn(`Operational Error: ${err.message}`, { statusCode: err.statusCode });
      return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
      });
    }

    // Unhandled / programmer errors
    logger.error('CRITICAL ERROR: ', err);
    return res.status(500).json({
      success: false,
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};
