/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import AppError from '../middlewares/appError.js';
import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import { getUserFromJwt } from '../utils/getAuthUser.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
  const results = await Order.find({}).populate('user', 'id firstName lastName email');
  res.status(200).json({
    orders: results
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
  const decodedUser = getUserFromJwt(req);

  const results = await Order.find({ user: decodedUser.userId });

  res.status(200).json(results);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
  const result = await Order.findById(req.params.id).exec();

  if (!result) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json(result);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Authenticated user
export const createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items', 404));
  }

  const user = await User.findById(req.user.userId).exec();

  const orderItemsWithPrices = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return next(new AppError('Product not found', 404));
      }
      return {
        quantity: item.quantity,
        product: item.product,
        totalPrice: item.quantity * product.price
      };
    })
  );

  let totalPrice = orderItemsWithPrices.reduce((acc, item) => acc + item.totalPrice, 0);
  totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);

  const newOrder = await Order.create({
    orderItems: orderItemsWithPrices,
    user,
    paymentMethod,
    shippingAddress,
    totalPrice
  });

  res.status(201).json(newOrder);
});

// @desc    Update order status
// @route   GET /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  let result = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!result) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    order: result
  });
});
