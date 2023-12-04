// import { envConfig } from './configs/env.js';
import mongoose from 'mongoose';
import User from './models/UserModel.js';
import databaseConnect from './dbConnection.js';

databaseConnect()
  .then(async () => {
    // eslint-disable-next-line no-console
    console.log('Creating seed data');

    let adminUser = await User.create({
      email: 'AdminUser@email.com',
      password: 'AdminUser1',
      role: 'admin'
    });

    // eslint-disable-next-line no-console
    console.log(adminUser);

    let user1 = await User.create({
        email: 'user1@email.com',
        password: 'User1',
        role: 'user'
    })

    // eslint-disable-next-line no-console
    console.log(user1);
    
  })
  .then(async () => {
    await mongoose.connection.close();
    // eslint-disable-next-line no-console
    console.log('Database disconnected!');
  });
