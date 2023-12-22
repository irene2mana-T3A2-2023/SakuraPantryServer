import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users
router.get('/users', isAuthenticatedUser, authoriseRole(['admin']), UserController.getAllUsers);
// Get one user by ID
router.get('/users/:id', isAuthenticatedUser, authoriseRole(['user']), UserController.getUserById);

export default router;
