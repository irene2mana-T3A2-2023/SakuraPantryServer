import express from 'express';
import * as ProductController from '../controllers/ProductController.js';

const router = express.Router();

// Define routes for '/api/products' endpoint
router.route('/')
// Get a list of all products 
.get(ProductController.getAllProducts)
// Create a new product
.post(ProductController.createProduct);

// Define routes for '/api/products/:slug' endpoint
router.route('/:slug')
// Get a specific product
.get(ProductController.getProduct)
// Update a specific product
.patch(ProductController.updateProduct)
// Delete a specific product 
.delete(ProductController.deleteProduct);



export default router;