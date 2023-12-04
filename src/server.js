import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';
import ProductsRouter from './routes/ProductsRoutes.js';

const app = express();

const corsOptions = {
  origin: envConfig.clientHost
};

// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

//Create mount path to ProductsRoutes
app.use('/products', ProductsRouter);


export default app;
