import mongoose from 'mongoose';
import { envConfig } from '../configs/env.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

async function setupMockUsers() {
  const adminUser = await User.create({
    firstName: 'Lara',
    lastName: 'Macintosh',
    email: 'admin@test.com',
    password: 'password',
    confirmPassword: 'password',
    role: 'admin'
  });

  const nonAdminUser = await User.create({
    firstName: 'Chihiro',
    lastName: 'Ogino',
    email: 'user@test.com',
    password: 'password',
    confirmPassword: 'password'
  });

  const adminToken = jwt.sign({ id: adminUser.id }, envConfig.jwtSecret);

  const nonAdminToken = jwt.sign({ id: nonAdminUser.id }, envConfig.jwtSecret);

  return { adminToken, nonAdminToken };
}

beforeAll(async () => {
  await mongoose.connect(envConfig.mongo.host);

  global.mockUsers = await setupMockUsers();
});

afterAll(async () => {
  await mongoose.disconnect();
});
