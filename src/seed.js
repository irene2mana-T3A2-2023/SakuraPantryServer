/* eslint-disable no-console */
import mongoose from 'mongoose';
import User from './models/UserModel.js';
import databaseConnect from './dbConnection.js';

// A list of admin users
const usersToSeed = [
  {
    firstName: 'Lara',
    lastName: 'Macintosh',
    email: 'adminUser1@email.com',
    password: 'Admin123',
    role: 'admin'
  },
  {
    firstName: 'Chihiro',
    lastName: 'Ogino',
    email: 'adminUser2@email.com',
    password: 'Admin456',
    role: 'admin'
  }
];

// Execute database connection then seed data
databaseConnect()
  .then(async () => {
    console.log('Creating seed data');
    // Seed users with hashed passwords

    for (const user of usersToSeed) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log('Users seeded successfully');
  })
  // Close the connection after completing data seeding
  .then(async () => {
    try {
      await mongoose.connection.close();
      console.log('Database disconnected!');
    } catch (disconnectError) {
      console.error('Error disconnecting from the database:', disconnectError);
    }
  })
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
  });
