import express from 'express';
import cors from 'cors';
// import logger from 'morgan';

const app = express();

const corsOptions = {
  origin: ['http://localhost:3000/'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API is working'
  });
});

export default app;
