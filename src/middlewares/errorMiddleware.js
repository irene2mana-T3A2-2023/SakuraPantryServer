/**
 * Create a new ErrorResponse object
 * @param {string} message - The error message
 * @param {number} statusCode - The HTTP status code associated with the error
 */
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  // Create a shallow copy of the error object and copy the error message to the new error object
  let error = { ...err, message: err.message };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = new ErrorResponse(
      Object.values(err.errors).map(({ message }) => message),
      400
    );
  }

  // Mongoose cast error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404);
  }

  // Duplicated field
  if (err.code === 11000) {
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  // Other unexpected errors
  res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
};

export default errorHandler;
