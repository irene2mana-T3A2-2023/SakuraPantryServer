import express from 'express';
import * as OrderController from '../controllers/OrderController.js';

const router = express.Router();


// Get a list of all orders
router.get('/orders', OrderController.getAllOrders);
// Get a specific order by OrderId
router.get('/orders/:OrderId', OrderController.getOrderById);
// Create a new orders
router.post('/orders', OrderController.createOrder);
// Update order status by OrderId
router.patch('/orders/status/:OrderId', OrderController.updateOrderStatus);


export default router;