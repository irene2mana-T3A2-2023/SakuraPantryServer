import express from 'express';
import * as ProductController from '../controllers/ProductController.js';

const router = express.Router();


// Get a list of all products 
router.get('/products', ProductController.getAllProducts);
// Get a specific product by slug
router.get('/products/:slug', ProductController.getProduct);
// Create a new product
router.post('/products', ProductController.createProduct);
// Update a specific product by slug
router.patch('/products/:slug', ProductController.updateProduct);
// Delete a specific product by Slug
router.delete('/products/:slug', ProductController.deleteProduct);



export default router;