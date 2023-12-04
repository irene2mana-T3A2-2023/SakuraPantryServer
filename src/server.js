import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';
import ProductsRouter from './routes/ProductsRoutes.js';
import CategoriesRouter from './routes/CategoriesRoutes.js';
import OrdersRouter from './routes/OrdersRoutes.js';
import UsersRouter from './routes/UsersRoutes.js';


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

//Create mount path to each route
app.use('/products', ProductsRouter);
app.use('/categories', CategoriesRouter);
app.use('/orders', OrdersRouter);
app.use('/users', UsersRouter);


export default app;
