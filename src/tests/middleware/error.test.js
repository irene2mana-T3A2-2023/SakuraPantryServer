import {
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB
} from '../../middlewares/errorMiddleware.js';
import AppError from '../../middlewares/appError.js';

// Test case for Cast Error handler
describe('handleCastErrorDB', () => {
  it('Should create an AppError with a specific message of CastError and status code of 400', () => {
    const err = {
      name: 'CastError',
      path: 'invalid-path',
      value: 'invalid-value'
    };

    const result = handleCastErrorDB(err);

    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toEqual('Invalid invalid-path: invalid-value.');
    expect(result.statusCode).toEqual(400);
  });
});

// Test case for Duplicate Field Error handler
describe('handleDuplicateFieldsDB', () => {
  it('Should create an AppError with a specific message of Duplicate Fields Error and status code of 400', () => {
    const err = {
      errmsg:
        'E11000 duplicate key error collection: myDB.users index: username_1 dup key: { username: "duplicateUsername" }'
    };

    const result = handleDuplicateFieldsDB(err);

    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toEqual(
      'Duplicate field value: "duplicateUsername". Please use another value!'
    );
    expect(result.statusCode).toEqual(400);
  });
});

// Test case for Validation Error handler
describe('handleValidationErrorDB', () => {
  it('Should create an AppError with a specific message of ValidationError and status code of 400', () => {
    const err = {
      errors: {
        name: {
          message: 'Name is required'
        },
        price: {
          message: 'Price is required'
        }
      }
    };

    const result = handleValidationErrorDB(err);

    expect(result).toBeInstanceOf(AppError);
    expect(result.message).toEqual('Invalid input data. Name is required. Price is required');
    expect(result.statusCode).toEqual(400);
  });
});
