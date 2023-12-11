import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';

import authRoutes from './routes/AuthRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';

import errorHandler from './middlewares/errorMiddleware.js';
import AppError from './middlewares/appError.js';
import globalErrorHandler from './controllers/ErrorController.js';

// define a server instance
const app = express();

// Set CORS options to allow requests only from the client host specified in the environment configuration.
const corsOptions = {
  origin: envConfig.clientHost
};

// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware to enable request.body
app.use(express.json());

// middleware to parse the URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Use the auth routes
app.use('/api', authRoutes);
// Use the category routes
app.use('/api', categoryRoutes);
// Use the product routes
app.use('/api', productRoutes);
// Use the order routes
app.use('/api', orderRoutes);

// Middleware to handle 404 Not Found error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// middleware for global error handler
app.use(globalErrorHandler);

// Middleware for error handling
app.use(errorHandler);

// Testing route
app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

export default app;
