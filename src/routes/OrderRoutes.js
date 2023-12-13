import express from 'express';
import * as OrderController from '../controllers/OrderController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get a list of all orders
router.get('/orders', isAuthenticatedUser, authoriseRole(['admin']), OrderController.getAllOrders);

// Get a specific order by orderId
router.get(
  '/orders/:orderId',
  isAuthenticatedUser,
  authoriseRole(['admin', 'user']),
  OrderController.getOrderById
);

// Create a new orders
router.post('/orders', isAuthenticatedUser, OrderController.createOrder);

// Update order status by orderId
router.patch(
  '/api/orders/:id/status',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  OrderController.updateOrderStatus
);

export default router;
