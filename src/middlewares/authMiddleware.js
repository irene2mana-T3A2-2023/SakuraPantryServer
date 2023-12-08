// import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';

const authenticateToken = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  jwt.verify(token, envConfig.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden. Invalid token.' });
    }

    req.user = user;
    next();
  });
};

// Admin Authorization Middleware
const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
    }

    let currentUser = null;

    await jwt.verify(token, envConfig.jwtSecret, (err, user) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        return res.status(403).json({ error: 'Forbidden. Invalid token.' });
      } else {
        currentUser = user;
      }
    });

    req.user = currentUser;

    const authenticatedUser = await User.findById(currentUser.userId).exec();

    if (authenticatedUser && authenticatedUser.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ error: 'Access forbidden. Admin privileges required.' });
    }
  } catch (error) {
    // Handle unexpected errors
    // eslint-disable-next-line no-console
    console.error('Admin authorization middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default isAdmin;
