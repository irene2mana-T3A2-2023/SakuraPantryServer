import express from 'express';
import * as UserController from '../controllers/UserController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users
router.get('/users', isAuthenticatedUser, authoriseRole(['admin']), UserController.getAllUsers);

export default router;
