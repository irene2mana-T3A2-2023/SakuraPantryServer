export default async function globalTeardown() {
  const instance = global.__MONGO_INSTANCE;

  if (instance) {
    await instance.stop();
  }
}
