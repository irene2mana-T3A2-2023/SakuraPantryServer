import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all products
router.get('/products', ProductController.getAllProducts);

// Get relative products
router.get(
  '/products/relative-products/:categorySlug',
  ProductController.relativeProductsByCategory
);

// Get new arrival products
router.get('/products/new-arrivals', ProductController.getNewArrivalProducts);

// Get featured products
router.get('/products/feature', ProductController.getFeatureProducts);

// Search a product by keyword
router.get('/products/search', ProductController.searchProduct);

// Get a specific product by slug
router.get('/products/:slug', ProductController.getProduct);

// Create a new product - admin only
router.post(
  '/products',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  ProductController.createProduct
);

// Update a specific product by slug - admin only
router.patch(
  '/products/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  ProductController.updateProduct
);

// Delete a specific product by slug - admin only
router.delete(
  '/products/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  ProductController.deleteProduct
);

export default router;
