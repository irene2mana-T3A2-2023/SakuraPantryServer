import server from './src/server.js';
import { envConfig } from './src/configs/env.js';

server.listen(envConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${envConfig.port}`);
});
