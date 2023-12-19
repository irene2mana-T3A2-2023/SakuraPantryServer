/**
 * Global teardown function for Jest tests.
 * This function is executed after all test suites have completed.
 * It's responsible for performing cleanup activities, such as stopping the MongoDB in-memory server instance.
 */
export default async function globalTeardown() {
  // Retrieve the MongoDB in-memory instance stored in the global namespace.
  const instance = global.__MONGO_INSTANCE;

  // If the instance exists, stop it to free up resources.
  if (instance) {
    await instance.stop();
  }
}
