import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import Product from '../models/ProductModel.js';
import Order from '../models/OrderModel.js';
import catchAsync from '../utils/catchAsync.js';

// eslint-disable-next-line
export const dashboardSummary = catchAsync(async (req, res, next) => {
  const totalRevenue = await Order.totalRevenue();

  const totalOrder = await Order.countDocuments();

  const totalProduct = await Product.countDocuments();

  const totalCategory = await Category.countDocuments();

  const totalUser = await User.countDocuments();

  return res.status(200).json({
    totalRevenue,
    totalOrder,
    totalProduct,
    totalCategory,
    totalUser
  });
});
