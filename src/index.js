/* eslint-disable no-console */
// This file handles the boot-up of the server
import app from './server.js';
import { envConfig } from './configs/env.js';
import databaseConnect from './dbConnection.js';

// A central error handler to handle all uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Start the server and connect to the database
const server = app.listen(envConfig.port, async () => {
  await databaseConnect();
  console.log(`Server listening on port ${envConfig.port}....`);
});

// A central error handler to handle all unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
