import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';

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

export default app;
