/**
 * Create a new AppError object
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code associated with the error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

export default AppError;
