/* eslint-disable no-console */
import User from '../models/UserModel.js';
import { getUserFromJwt } from '../utils/getAuthUser.js';

// User authentication middleware
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    // Set the decoded user information in the request object
    req.user = getUserFromJwt(req);

    // Call the next middleware or route handler
    next();
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
      return res.status(403).json({ error: 'Access forbidden. User not found.' });
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
