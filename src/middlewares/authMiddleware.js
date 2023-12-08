// import User from '../models/UserModel.js';

// Admin Authorization Middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;

    // Check if the user has the 'admin' role
    if (user && user.role == 'admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Access forbidden. Admin privileges required.'})
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default isAdmin;
