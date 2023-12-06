import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';
import orderRoutes from './routes/OrderRoutes.js';
import productRoutes from './routes/ProductRoutes.js';
import categoryRoutes from './routes/CategoryRoutes.js';


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

// R
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

export default app;
