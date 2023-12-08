import express from 'express';
import * as CategoryController from '../controllers/CategoryController.js';

const router = express.Router();

//Get a list of all categories
router.get('/categories', CategoryController.getAllCategories);
//Create a new category
router.post('/categories', CategoryController.createCategory);
//Update a specific category by slug
router.patch('/categories/:slug', CategoryController.updateCategory);
//Delete a specific category by slug
router.delete('/categories/:slug', CategoryController.deleteCategory);

export default router;


