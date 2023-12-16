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

  const user = await User.create({
    firstName: 'Chihiro',
    lastName: 'Ogino',
    email: 'user@test.com',
    password: 'password',
    confirmPassword: 'password'
  });

  const adminToken = jwt.sign({ userId: adminUser.id }, envConfig.jwtSecret);

  const userToken = jwt.sign({ userId: user.id }, envConfig.jwtSecret);

  return { adminToken, userToken };
}

beforeAll(async () => {
  await mongoose.connect(envConfig.mongo.host);

  global.mockUsers = await setupMockUsers();
});

afterAll(async () => {
  await User.deleteMany({});

  await mongoose.disconnect();
});
