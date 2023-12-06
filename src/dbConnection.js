import mongoose from 'mongoose';
import { envConfig } from './configs/env.js';

/**
 * Connect or create and connect to a database
 * @date 12/4/2023 - 11:02:23 AM
 *
 * @async
 * @returns {*}
 */
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
