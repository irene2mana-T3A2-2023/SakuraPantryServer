import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  currentUser,
  verifyCurrentPassword,
  changePassword
} from '../controllers/AuthController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

// Create a new router object using Express
const router = express.Router();

// Route for user registration - POST request to '/auth/register' will be handled by the 'register' controller
router.post('/auth/register', register);

// Route for user login - POST request to '/auth/login' will be handled by the 'login' controller
router.post('/auth/login', login);

// Route for initiating a forgot password request - POST request to '/auth/forgot-password' will be handled by the 'forgotPassword' controller
router.post('/auth/forgot-password', forgotPassword);

// Route for resetting a password - POST request to '/auth/reset-password' will be handled by the 'resetPassword' controller
router.post('/auth/reset-password', resetPassword);

//Route for checking user's authentication status and allows access only to users who have the specificed role.
router.get(
  '/auth/current-user',
  isAuthenticatedUser,
  authoriseRole(['user', 'admin']),
  currentUser
);

// Route for checking the current password of the current authenticated user
router.post('/auth/verify-current-password', isAuthenticatedUser, verifyCurrentPassword);

// Route for change the password of the current authenticated user
router.post('/auth/change-password', isAuthenticatedUser, changePassword);

// Export the router to be used in other parts of the application
export default router;
