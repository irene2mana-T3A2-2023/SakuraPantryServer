// import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';

// User authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract the JWT from the "Authorization" header
    const token = req.headers.authorization.split(' ')[1];

    // Check if no token is provided or not
    if (!token) {
      // If no token, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
    }

    // Verify the JWT token
    jwt.verify(token, envConfig.jwtSecret, (err, user) => {
      // If verification fails, send a 403 Forbidden response
      if (err) {
        return res.status(403).json({ error: 'Forbidden. Invalid token.' });
      }

      // Set the decoded user information in the request object
      req.user = user;

      // Call the next middleware or route handler
      next();
    });
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
    // Extract the token from the "Authorization" header
    const token = req.headers.authorization.split(' ')[1];

    // Check if the token is provided or not
    if (!token) {
      return res.status(401).json({ error: 'Access unauthorized. Token not provided.' });
    }

    let currentUser = null;

    try {
      // Verify the JWT token
      currentUser = await jwt.verify(token, envConfig.jwtSecret);

      // Set the decoded user information in the request object
      req.user = currentUser;

      // Retrieve the authenticated user from the database using the user ID from the token
      const authUser = await User.findById(currentUser.userId).exec();

      // Check if the authenticated user exists and has the 'admin' role
      if (authUser && authUser.role === 'admin') {
        // If the user is an admin, proceed to the next middleware or route handler
        next();
      } else {
        // If the user is not an admin, send a forbidden response
        return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
      }
    } catch (jwtError) {
      // Handle JWT verification errors
      // eslint-disable-next-line no-console
      console.error('JWT Verification Error:', jwtError);
      return res.status(403).json({ error: 'Access forbidden. Invalid token.' });
    }
  } catch (error) {
    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Admin authorization middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
