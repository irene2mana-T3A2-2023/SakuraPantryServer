// Provides an in-memory MongoDB server, ideal for isolated testing without affecting production or development databases.
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // Creating an in-memory MongoDB server instance.
  const instance = await MongoMemoryServer.create();

  // Retrieving the URI of the in-memory server. This URI is used to connect to the database.
  const uri = instance.getUri();

  // Storing the server instance globally for access throughout the application.
  global.__MONGO_INSTANCE = instance;

  // Store the MongoDB URI in the environment variable 'MONGODB_URI', removing the database name for generic use.
  process.env.MONGODB_URI = uri.slice(0, uri.lastIndexOf('/'));
}
