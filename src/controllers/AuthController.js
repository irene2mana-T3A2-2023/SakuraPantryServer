import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';

// @route POST api/auth/register
// @desc Register user
// @access Public
export const register = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Check if any required fields for user registration are missing
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  //  Validate that the password and confirmPassword match.
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Respond a message indicating successful user registration
    res.status(200).json({ message: 'User successfully registered' });
  } catch (err) {
    // Handle error
    res.status(500).json({ message: err.message });
  }
};
