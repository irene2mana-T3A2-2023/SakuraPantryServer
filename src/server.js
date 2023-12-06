import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';
import orderRouter from './routes/OrderRoutes.js';
import productRouter from './routes/ProductRoutes.js';
import categoryRouter from './routes/CategoryRoutes.js';


// define a server instance
const app = express();

const corsOptions = {
  origin: envConfig.clientHost
};

// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// middleware to enable request.body
app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

export default app;
