import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';

import authRoutes from './routes/AuthRoutes.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';

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

// Use the auth routes
app.use('/api', authRoutes);
// Use the category routes
app.use('/api', categoryRoutes);
// Use the product routes
app.use('/api', productRoutes);
// Use the order routes
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

export default app;
