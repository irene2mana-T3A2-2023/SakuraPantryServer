// This file handles the boot-up of the server
import server from './server.js';
import { envConfig } from './configs/env.js';
import databaseConnect from './dbConnection.js';

server.listen(envConfig.port, async () => {
  await databaseConnect();
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${envConfig.port}`);
});

