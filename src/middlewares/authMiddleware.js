/* eslint-disable no-console */
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
    console.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Role-based authorisation middleware
export const authoriseRole = (authorisedRole) => async (req, res, next) => {
  try {
    // Retrieve the user from the database using the user ID from the token
    // Assuming the user has been authenticated with isAuthenticatedUser
    const user = await User.findById(req.user.userId).exec();

    // Check if the authenticated user exists
    if (!user) {
      return res.status(403).json({ error: 'Access forbidden. User not found. ' });
    }

    // Check if the user has one of the authorised roles
    if (authorisedRole.includes(user.role)) {
      // If the user has the authorised role, proceed to the next middleware or route handler
      next();
    } else {
      // If the user does not have an authorised role, send a forbidden response
      return res.status(403).json({ error: 'Access forbidden. Unauthorised role.' });
    }
  } catch (error) {
    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Admin authorization middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
