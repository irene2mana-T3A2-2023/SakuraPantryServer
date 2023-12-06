import mongoose from 'mongoose';
import User from './models/UserModel.js';
import databaseConnect from './dbConnection.js';

// Execute database connection then seed data
databaseConnect()
  .then(async () => {
    try {
      // Drop the database before seeding again
      await User.collection.drop();

      // eslint-disable-next-line no-console
      console.log('Creating seed data');

      // Seed an admin user
      let adminUser = await User.create({
        email: 'AdminUser@email.com',
        password: 'AdminUser1',
        role: 'admin'
      });

      // eslint-disable-next-line no-console
      console.log(adminUser);

      // Seed an user
      let user1 = await User.create({
        email: 'user1@email.com',
        password: 'User1',
        role: 'user'
      });

      // eslint-disable-next-line no-console
      console.log(user1);
  } catch (dropError) {
      // eslint-disable-next-line no-console
      console.error('Error dropping User collection:', dropError);
      throw dropError;
  }})
  // Close the connection after completing data seeding
  .then(async () => {
    try {
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('Database disconnected!');
    } catch (disconnectError) {
      // eslint-disable-next-line no-console
      console.error('Error disconnecting from the database:', disconnectError);
    }
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('An unexpected error occurred:', error);
});
