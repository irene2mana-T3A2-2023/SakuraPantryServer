import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import AppError from '../middlewares/appError.js';

// Function to get user information from JWT
export const getUserFromJwt = (req) => {
  // Check if JWT exists in the "Authorization" header and extract it
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token, send a 401 Unauthorized response
    throw new AppError('Token not provided. Please log in.', 401);
  }

  try {
    // Verify the JWT token using the jwtSecret from envConfig
    const decodedToken = jwt.verify(token, envConfig.jwtSecret);

    // Return the decoded user information from the JWT
    return decodedToken;
  } catch (jwtError) {
    // If the token verification fails, send a 401 Unauthorized response.
    throw new AppError('Access forbidden. Invalid token', 401);
  }
};
