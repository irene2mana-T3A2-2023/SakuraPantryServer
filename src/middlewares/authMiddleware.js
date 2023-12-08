import User from '../models/UserModel.js';

// Admin Authorization Middleware
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch the user from the database
    const user = await User.findById(userId);

    // Check if the user has the 'admin' role
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Permission denied. Admin access required.' });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default isAdmin;
