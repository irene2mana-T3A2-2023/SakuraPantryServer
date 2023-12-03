import express from 'express';
import cors from 'cors';
import { envConfig } from './configs/env.js';

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

export default app;
