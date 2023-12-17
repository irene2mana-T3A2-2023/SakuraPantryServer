import mongoose from 'mongoose';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

/**
 * Sets up mock users for testing purposes.
 * This function creates an admin user and a regular user in the database,
 * then generates JWT tokens for each.
 * @returns An object containing JWT tokens for the admin and regular user.
 */
async function setupMockUsers() {
  // Create an admin user with predefined credentials.
  const adminUser = await User.create({
    firstName: 'Lara',
    lastName: 'Macintosh',
    email: 'admin@test.com',
    password: 'password',
    confirmPassword: 'password',
    role: 'admin'
  });

  // Create a regular user with predefined credentials.
  const user = await User.create({
    firstName: 'Chihiro',
    lastName: 'Ogino',
    email: 'user@test.com',
    password: 'password',
    confirmPassword: 'password'
  });

  // Generate JWT tokens for both users.
  const adminToken = jwt.sign({ userId: adminUser.id }, envConfig.jwtSecret);
  const userToken = jwt.sign({ userId: user.id }, envConfig.jwtSecret);

  return { adminToken, userToken };
}

/**
 * Before all tests, connect to the MongoDB database and set up mock users.
 * The mock user tokens are stored globally for use in tests.
 */
beforeAll(async () => {
  // Connect to MongoDB using the connection string from environment config.
  await mongoose.connect(envConfig.mongo.host);

  // Set up mock users and store their tokens in a global variable for testing.
  global.mockUsers = await setupMockUsers();
});

/**
 * After all tests, clean up by deleting all users and disconnecting from the database.
 */
afterAll(async () => {
  // Delete all users from the database.
  await User.deleteMany({});

  // Disconnect from the MongoDB database.
  await mongoose.disconnect();
});
