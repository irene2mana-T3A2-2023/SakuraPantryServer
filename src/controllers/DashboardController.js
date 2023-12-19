import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import catchAsync from '../utils/catchAsync.js';

// eslint-disable-next-line
export const dashboardSummary = catchAsync(async (req, res, next) => {
  // Fetching the total revenue from the Order model using a custom method 'totalRevenue'.
  const totalRevenue = await Order.totalRevenue();

  // Counting the total number of orders in the Order collection.
  const totalOrder = await Order.countDocuments();

  // Counting the total number of products in the Product collection.
  const totalProduct = await Product.countDocuments();

  // Counting the total number of categories in the Category collection.
  const totalCategory = await Category.countDocuments();

  // Counting the total number of users in the User collection.
  const totalUser = await User.countDocuments();

  return res.status(200).json({
    totalRevenue,
    totalOrder,
    totalProduct,
    totalCategory,
    totalUser
  });
});
