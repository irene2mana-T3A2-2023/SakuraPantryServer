// This file handles the boot-up of the server
import app from './server.js';
import { envConfig } from './configs/env.js';
import databaseConnect from './dbConnection.js';

// A central error handler to handle all uncaught exceptions
process.on('uncaughtException', (err) => {
  //eslint-disable-next-line no-console
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  //eslint-disable-next-line no-console
  console.log(err.name, err.message);
  process.exit(1);
});

// Start the server and connect to the database
const server = app.listen(envConfig.port, async () => {
  await databaseConnect();
  //eslint-disable-next-line no-console
  console.log(`Server listening on port ${envConfig.port}....`);
});

// A central error handler to handle all unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  //eslint-disable-next-line no-console
  console.log('UNHANDLED REJECTION! Shutting down...');
  //eslint-disable-next-line no-console
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
