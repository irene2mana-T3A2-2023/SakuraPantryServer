// Wrapping default error class with custom error class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Validation error
  if (err.name === 'ValidatorError') {
    error = new ErrorResponse(
      Object.values(err.error).map(({ message }) => message),
      400
    );
  }

  // Wrong ObjectId (in case of searching users)
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
