import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import { isAdmin, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all products in the DB
router.get('/products', ProductController.getAllProducts);
// Get a specific product by slug
router.get('/products/:slug', ProductController.getProduct);
// Create a new product - admin only
router.post('/products', isAuthenticatedUser, isAdmin, ProductController.createProduct);
// Update a specific product by slug - admin only
router.patch('/products/:slug', isAdmin, ProductController.updateProduct);
// Delete a specific product by slug - admin only
router.delete('/products/:slug', isAdmin, ProductController.deleteProduct);

export default router;
