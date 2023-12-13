/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import AppError from '../middlewares/appError.js';
import Order from '../models/OrderModel.js';
import catchAsync from '../utils/catchAsync.js';

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
  const results = await Order.find({ user: req.user._id });

  res.status(200).json(results);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
  const result = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

  if (!result) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json(result);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Authenticated user
export const createOrder = catchAsync(async (req, res, next) => {
  console.log('Create a Order by authenticated user');
});

// @desc    Update order status
// @route   GET /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req, res, next) => {

  let result = await Order.findByIdAndUpdate(
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if (!result) {
    return next(new AppError('Order not found', 404));
  };

  result.status(200).json({
    order: result
  })
});
