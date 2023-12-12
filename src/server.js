import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import authRoutes from './routes/AuthRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';

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

// Data sanitization against XSS
app.use(xss());

// ROUTES
// Use the auth routes
app.use('/api', authRoutes);
// Use the category routes
app.use('/api', categoryRoutes);
// Use the product routes
app.use('/api', productRoutes);
// Use the order routes
app.use('/api', orderRoutes);

// Testing route
app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

// Middleware to handle 404 Not Found error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Middleware for global error handler
app.use(globalErrorHandler);

export default app;
