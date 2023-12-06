import express from 'express';
import * as CategoryController from '../controllers/CategoryController.js';

const router = express.Router();

//Define routes for '/api/categories' endpoint
router.route('/')
//Get a list of all categories
.get(CategoryController.getAllCategories)
//Create a new category
.post(CategoryController.createCategory);


//Define routes for '/api/categories/:slug' endpoint
router.route('/:slug')
//Update a specific category by slug
.patch(CategoryController.updateCategory)
//Delete a specific category by slug
.delete(CategoryController.deleteCategory);



export default router;