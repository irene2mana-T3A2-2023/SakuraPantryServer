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
