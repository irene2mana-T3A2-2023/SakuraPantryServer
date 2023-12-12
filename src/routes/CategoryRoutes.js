import express from 'express';
import * as CategoryController from '../controllers/CategoryController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get a list of all categories
router.get(
  '/categories',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  CategoryController.getAllCategories
);
// Create a new category
router.post(
  '/categories',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  CategoryController.createCategory
);
// Update a specific category by slug
router.patch(
  '/categories/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  CategoryController.updateCategory
);
// Delete a specific category by slug
router.delete(
  '/categories/:slug',
  isAuthenticatedUser,
  authoriseRole(['admin']),
  CategoryController.deleteCategory
);

export default router;
