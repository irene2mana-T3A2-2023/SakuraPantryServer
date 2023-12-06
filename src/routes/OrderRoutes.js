import express from 'express';
import * as OrderController from '../controllers/OrderController.js';

const router = express.Router();

// Define routes for '/api/orders' endpoint
router.route('/')
// Get all orders
.get(OrderController.getAllOrders)
// Create a new orders
.post(OrderController.createOrder);

// Define routes for 'api/orders/:OrderId' endpoint
router.route('/:OrderId')
// Get a specific order by OrderId
.get(OrderController.getOrder);


router.route('/status/:OrderId')
// Update order status by OrderId
.patch(OrderController.updateOrderStatus);


export default router;