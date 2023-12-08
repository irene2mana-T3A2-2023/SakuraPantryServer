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
  // Extract firstName, lastName, email, password, and confirmPassword and so on, from the request body
  const { firstName, lastName, email, password, confirmPassword, ...rest } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if the password and confirmPassword fields match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Password and confirm password do not match' });
  }

  try {
    // Search for a user with the provided email
    const existingUser = await User.findOne({ email });

    // If a user with the same email exists, return an error response
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the provided data and hashed password
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, ...rest });

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
      return res.status(400).json({ message: 'User not found' });
    }

    // Generate a random reset token using crypto
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Assign the reset token and expiration time to the user
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

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

    // Create the reset password URL, which includes the reset password token.
    const resetUrl = `${envConfig.clientHost}/reset-password?token=${resetToken}`;

    // Send an email to the user that includes the reset password URL
    await transporter.sendMail({
      from: {
        name: 'Sakura Pantry',
        address: envConfig.mail.user
      },
      to: existingUser.email,
      subject: 'Password Reset',
      html: `
      <h1>Reset Password</h1>
      <br />
      <h3>Dear ${existingUser.lastName},</h3>

      <p>A password reset event has been triggered. The password reset window is limited to 15 minutes.</p>
      <p>If you do not reset your password within 15 minutes, you will need to submit a new request.</p>
      <p>To complete the password reset process, visit the following link:</p>
      <br />
      <a href=${resetUrl}>Reset password</a></p>
      
      <p>If you did not request this change, please contact our support team immediately.</p>
      <p>Kind regards,</p>
      <h4>Sakura Pantry Support Team.</h4>
      `
    });

    // Confirm the password reset link has been sent
    return res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (err) {
    // Handle error
    return res.status(500).json({ message: err.message });
  }
};

// @route POST api/auth/reset-password
// @desc Completes password recovery using a reset token
// @access Private
export const resetPassword = async (req, res) => {
  try {
    // Extract resetToken, newPassword, confirmNewPassword from the request body
    const { resetToken, newPassword, confirmNewPassword } = req.body;

    // Check if the new passwords match
    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({ message: 'New password and confirm new password do not match' });
    }

    // Find the user with the provided reset token
    const existingUser = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    // Check if the reset token is valid and has not expired
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid or expired reset password token' });
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token fields
    existingUser.password = hashedPassword;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpires = undefined;

    // Save the new user to the database
    await existingUser.save();

    // Send success response
    res.status(200).json({ message: 'Password has been successfully reset' });
  } catch (err) {
    // Handle potential errors
    return res.status(500).json({ message: err.message });
  }
};
