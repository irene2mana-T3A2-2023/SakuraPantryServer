import mongoose from 'mongoose';
import { envConfig } from './configs/env.js';
import util from 'node:util';

async function databaseConnect() {
  try {
    // eslint-disable-next-line no-console
    console.log('Connecting to:\n' + envConfig.mongo.host);
    await mongoose.connect(envConfig.mongo.host);

    // Enable Mongoose query logging in development mode for debugging purposes.
    if (envConfig.mongooseDebug) {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        // eslint-disable-next-line no-console
        console.log(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
      });
    }

    // eslint-disable-next-line no-console
    console.log('Database connected!');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`databaseConnect failed to connect to DB:\n${JSON.stringify(error)}`);
  }
}

export default databaseConnect;
