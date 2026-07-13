/**
 * Custom AppError class for UCab server
 * Used for throwing operational errors throughout the application
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {boolean} [isOperational=true] - True if this is a known operational error, false if it is a programmer error
   */
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    // Capture the stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
