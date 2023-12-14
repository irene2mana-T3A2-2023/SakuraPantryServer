import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import AppError from '../middlewares/appError.js';

export const getUserFromJwt = (req) => {
  // Check if JWT exists in the "Authorization" header and extract it
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token, send a 401 Unauthorized response
    throw new AppError('Token not provided. Please log in.', 400);
  }

  try {
    // Verify the JWT token
    const decodedToken = jwt.verify(token, envConfig.jwtSecret);

    return decodedToken;
  } catch (jwtError) {
    throw new AppError('Access forbidden. Invalid token', 400);
  }
};
