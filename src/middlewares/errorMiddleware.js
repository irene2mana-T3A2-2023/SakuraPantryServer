/* eslint-disable no-console */
import AppError from './appError.js';

// Function to handle CastError in Mongoose (eg. invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Function to handle duplicated fields
const handleDuplicateFieldsDB = (err) => {
  // Use Regex to match the values between the quotation marks in errmsg created by Mongoose
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

// Function to handle ValidationError in Mongoose
const handleValidationErrorDB = (err) => {
  // Loop over an array of all error messages and extract each error's message
  const errors = Object.values(err.errors).map((el) => el.message);

  // Define and return the error's message with all messages joined as a string
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Function to send all error details in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Function to send limited error details in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // Log error to the console
    console.error('ERROR: ', err);
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Function to handle errors globally
/* eslint-disable no-unused-vars */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;