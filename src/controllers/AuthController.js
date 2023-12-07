import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../configs/env.js';

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
    // Verify if the database already has a user with the given email
    const existingUser = await User.findOne({ email });

    // Send a message indicating the email already exists
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

// @route POST api/auth/login
// @desc Authenticate logged in user
// @access Public
export const login = async (req, res) => {
  // Extract email, password, and rememberMe from the request body
  const { email, password, rememberMe } = req.body;

  // Validate if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
    // Attempt to find a user with the provided email
    const existingUser = await User.findOne({ email });

    // Check if the user exists and if the password matches
    if (!existingUser || !existingUser.comparePassword(password)) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Determine the token's expiration time based on the rememberMe flag (nice to have now).
    const expiresIn = rememberMe ? '30d' : envConfig.jwtExpiresIn;

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: existingUser._id }, envConfig.jwtSecret, { expiresIn });

    // Respond with the user details and token
    return res.status(200).json({ user: existingUser, token });
  } catch (err) {
    // Handle error
    return res.status(500).json({ message: err.message });
  }
};
