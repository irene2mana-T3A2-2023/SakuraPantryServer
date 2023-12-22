import { Types } from 'mongoose';
import AppError from '../middlewares/appError.js';
import User from '../models/UserModel.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
// eslint-disable-next-line no-unused-vars
export const getAllUsers = catchAsync(async (req, res, next) => {
  // Fetches all users from the User model using the `find` method.
  // Sorts the users in descending order by their creation date using the `sort` method.
  let results = await User.find({}).sort({ createdAt: -1 });

  res.status(200).json(results);
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // Check if the provided ID is a valid ObjectID
  if (!Types.ObjectId.isValid(userId)) {
    return next(new AppError('Invalid user ID format', 404));
  }

  const result = await User.findById(userId).exec();

  if (!result) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json(result);
})