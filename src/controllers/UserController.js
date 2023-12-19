import User from '../models/UserModel.js';
import catchAsync from '../utils/catchAsync.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
// eslint-disable-next-line no-unused-vars
export const getAllUsers = catchAsync(async (req, res, next) => {
  let results = await User.find({}).sort({ createdAt: -1 });

  res.status(200).json(results);
});
