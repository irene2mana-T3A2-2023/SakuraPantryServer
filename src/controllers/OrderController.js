/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

import catchAsync from '../utils/catchAsync';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = catchAsync(async (req, res, next) => {
  console.log('Get all orders');
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = catchAsync(async (req, res, next) => {
  console.log('Get a list of orders for logged in user');
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
  console.log('Get a specific order by OrderId');
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
  console.log('Update the status of a specific order by OrderId');
});
