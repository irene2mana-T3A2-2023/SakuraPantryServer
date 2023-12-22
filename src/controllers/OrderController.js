import { Types } from 'mongoose';
import AppError from '../middlewares/appError.js';
import Order from '../models/OrderModel.js';
import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import catchAsync from '../utils/catchAsync.js';
import { getUserFromJwt } from '../utils/getAuthUser.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
// eslint-disable-next-line no-unused-vars
export const getAllOrders = catchAsync(async (req, res, next) => {
  // Retrieve orders from db and populate the 'user' field with selected user properties
  const results = await Order.find({})
    .populate('user', 'id firstName lastName email')
    .populate({
      path: 'orderItems.product',
      select: 'name imageUrl category price',
      populate: {
        path: 'category',
        select: 'name description'
      }
    })
    .sort({ createdAt: -1 });
  res.status(200).json(results);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
// eslint-disable-next-line no-unused-vars
export const getMyOrders = catchAsync(async (req, res, next) => {
  // Decode user info from the JWT in the request
  const decodedUser = getUserFromJwt(req);

  // Retrieve orders from the db that belong to the decoded user
  const results = await Order.find({ user: decodedUser.userId }).populate({
    path: 'orderItems.product',
    select: 'name imageUrl category price',
    populate: {
      path: 'category',
      select: 'name description'
    }
  });

  res.status(200).json(results);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = catchAsync(async (req, res, next) => {
  // Retrieve an order from the db by its ID provided in the request params
  const orderId = req.params.id;

  // Check if the provided ID is a valid ObjectID
  if (!Types.ObjectId.isValid(orderId)) {
    return next(new AppError('Invalid order ID format', 404));
  }

  const result = await Order.findById(orderId).exec();

  if (!result) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json(result);
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Authenticated user
export const createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, shippingAddress, paymentMethod, phone } = req.body;

  // Check if there are no order items provided
  if (orderItems && orderItems.length === 0) {
    return next(new AppError('No order items', 404));
  }

  // Retrieve the user associated with the request
  const user = await User.findById(req.user.userId).exec();

  // Map over order items to get details with prices
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

  // Calculate the total price for the order
  let totalPrice = orderItemsWithPrices.reduce((acc, item) => acc + item.totalPrice, 0);
  totalPrice = (Math.round(totalPrice * 100) / 100).toFixed(2);

  // Create a new order in the db
  const newOrder = await Order.create({
    orderItems: orderItemsWithPrices,
    user,
    paymentMethod,
    shippingAddress,
    phone,
    totalPrice
  });

  res.status(201).json(newOrder);
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return next(new AppError('Invalid order ID format', 404));
  }

  // Update an order's status in the db by its ID, with the provided request body
  let result = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });

  if (!result) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json(result);
});
