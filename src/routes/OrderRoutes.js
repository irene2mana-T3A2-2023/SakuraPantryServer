import express from 'express';
import * as OrderController from '../controllers/OrderController.js';

const router = express.Router();


// Get a list of all orders
router.get('/orders', OrderController.getAllOrders);
// Get a specific order by orderId
router.get('/orders/:orderId', OrderController.getOrderById);
// Create a new orders
router.post('/orders', OrderController.createOrder);
// Update order status by orderId
router.patch('/orders/status/:orderId', OrderController.updateOrderStatus);


export default router;