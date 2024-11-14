import net from 'net';
import { onConnection } from './events/onConnection.js';
import { logger } from './configs/logger/winston.config.js';
import { config } from './configs/configs.js';
import initServer from './init/index.js';

const server = net.createServer(onConnection);

try {
  await initServer();

  server.listen(config.server.port, config.server.host, () => {
    logger.info(`Server is on =>  ${config.server.host}:${config.server.port}`);
  });
} catch (e) {
  logger.error('서버 로드에 실패하였습니다. ', e);
  process.exit(1);
}
