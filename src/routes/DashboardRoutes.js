import express from 'express';
import { dashboardSummary } from '../controllers/DashboardController.js';
import { authoriseRole, isAuthenticatedUser } from '../middlewares/authMiddleware.js';

// Create a new router object using Express
const router = express.Router();

// Get summary information for admin
router.get('/dashboard/summary', isAuthenticatedUser, authoriseRole(['admin']), dashboardSummary);

export default router;
