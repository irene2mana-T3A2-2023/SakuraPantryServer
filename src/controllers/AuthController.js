import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { envConfig } from '../configs/env.js';

// @route POST api/auth/register
// @desc Register a new user account
// @access Public
export const register = async (req, res) => {
  // Extract firstName, lastName, email, password, and confirmPassword from the request body
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if the password and confirmPassword fields match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  try {
    // Check for an existing user with the provided email
    const existingUser = await User.findOne({ email });

    // If a user with the same email exists, return an error response
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the provided data and hashed password
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Send a success response indicating the user was registered
    res.status(200).json({ message: 'User successfully registered' });
  } catch (err) {
    // Handle error
    res.status(500).json({ message: err.message });
  }
};

// @route POST api/auth/login
// @desc Authenticates a user and issues a JWT token.
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

    // Determine the token's expiration time based on the rememberMe flag (rememberME is nice-to-have-now).
    const expiresIn = rememberMe ? '30d' : envConfig.jwtExpiresIn;

    // Create a JWT token for the authenticated user and assign an expiration time to this token.
    const token = jwt.sign({ userId: existingUser._id }, envConfig.jwtSecret, { expiresIn });

    // Respond with the user details and token
    return res.status(200).json({ user: existingUser, token });
  } catch (err) {
    // Handle error
    return res.status(500).json({ message: err.message });
  }
};

// @route POST api/auth/forgot-password
// @desc Initiates the password recovery process.
// @access Public
export const forgotPassword = async (req, res) => {
  try {
    // Extract email from the request body
    const { email } = req.body;

     // Search for a user with the provided email
    const existingUser = await User.findOne({ email });

    // Check if the user exists with provided email
    if (!existingUser) {
      return res.status(400).json({message: 'User not found'});
    }

    // Generate a random reset token using crypto
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Assign the reset token and expiration time to the user
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 mins

    // Save the updated user information
    await existingUser.save();

    // Create a transport for sending email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: envConfig.mail.user,
        pass: envConfig.mail.password
      }
    });

    // Create the reset password URL
    const resetUrl = `${envConfig.clientHost}/reset-password?token=${resetToken}`;

    // Send an email to the user with the reset password link
    await transporter.sendMail({
      from: {
        name: 'Sakura pantry',
        address: envConfig.mail.user
      },
      to: existingUser.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Please go to this link to reset your password:<p>\
      <a href=${resetUrl}>Reset password link</a></p>`
    });

    // Confirm to the user that the password reset link has been sent
    return res.status(200).json({message: 'Password reset link sent to your email'});
  } catch (err) {
    // Handle error
    return res.status(500).json({ message: err.message });
  }
};
