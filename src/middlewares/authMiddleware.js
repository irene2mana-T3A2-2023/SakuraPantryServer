import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';

// User authentication middleware
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    // Check if JWT exists in the "Authorization" header and extract it
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    // Check if no token is provided or not
    if (!token) {
      // If no token, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Unauthorized access. Token not provided.' });
    }

    try {
      // Verify the JWT token
      const decodedToken = await jwt.verify(token, envConfig.jwtSecret);

      // Set the decoded user information in the request object
      req.user = decodedToken;

      // Call the next middleware or route handler
      next();
    } catch (jwtError) {
      // If verification fails, send a 403 Forbidden response
      return res.status(403).json({ error: 'Access forbidden. Invalid token.' });
    }
  } catch (error) {
    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Admin authorization middleware
export const isAdmin = async (req, res, next) => {
  try {
    // Retrieve the user from the database using the user ID from the token
    // Assuming the user has been authenticated with isAuthenticatedUser
    const user = await User.findById(req.user.userId).exec();

    // Check if the user exists and has the 'admin' role
    if (user && user.role === 'admin') {
      // If the user is an admin, proceed to the next middleware or route handler
      next();
    } else {
      // If the user is not an admin, send a forbidden response
      return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
    }
  } catch (error) {
    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Admin authorization middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
