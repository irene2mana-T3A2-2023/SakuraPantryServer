import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { envConfig } from './configs/env.js';
import authRoutes from './routes/AuthRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';
import AppError from './middlewares/appError.js';
import globalErrorHandler from './middlewares/errorMiddleware.js';

// Define a server instance
const app = express();

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Set CORS options to allow requests only from the client host specified in the environment configuration.
const corsOptions = {
  origin: envConfig.clientHost
};

// Enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware to enable request.body
app.use(express.json());

// Middleware to parse the URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ROUTES
// Use the auth routes
app.use('/api', authRoutes);
// Use the category routes
app.use('/api', categoryRoutes);
// Use the product routes
app.use('/api', productRoutes);
// Use the order routes
app.use('/api', orderRoutes);
// Use the user routes
app.use('/api', userRoutes);
// Use the dashboard routes for admin only
app.use('/api', dashboardRoutes);
/** GET /health-check - Check service health */
app.use('/health-check', (_, res) => res.json({ message: 'Server is running' }));

// Middleware to handle 404 Not Found error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware for global error handler
app.use(globalErrorHandler);

export default app;
