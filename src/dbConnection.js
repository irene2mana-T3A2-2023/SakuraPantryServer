import mongoose from 'mongoose';
import { envConfig } from './configs/env.js';

async function databaseConnect() {
  try {
    // eslint-disable-next-line no-console
    console.log('Connecting to:\n' + envConfig.mongo.host);
    await mongoose.connect(envConfig.mongo.host);
    // eslint-disable-next-line no-console
    console.log('Database connected!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`databaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
  }
}

export default databaseConnect;
