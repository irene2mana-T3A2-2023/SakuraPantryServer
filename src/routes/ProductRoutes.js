import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';
import { tryCatch } from '../utils/tryCatch.js';

const router = express.Router();

// Get all products in the DB
router.get('/products', ProductController.getAllProducts);

// Search a product by keyword
router.get('/products/search', tryCatch(ProductController.searchProduct));

// Get a specific product by slug
router.get('/products/:slug', tryCatch(ProductController.getProduct));

// Create a new product - admin only
router.post(
  '/products',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  tryCatch(ProductController.createProduct)
);

// Update a specific product by slug - admin only
router.patch(
  '/products/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  tryCatch(ProductController.updateProduct)
);

// Delete a specific product by slug - admin only
router.delete(
  '/products/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  tryCatch(ProductController.deleteProduct)
);

export default router;
