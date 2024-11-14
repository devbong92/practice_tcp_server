import { logger } from '../configs/logger/winston.config.js';
import { addGameSession } from '../sessions/game.session.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadProtos();
    logger.info('[ initServer ] proto loaded !');

    // TODO: 임시 게임 세션 생성
    const game = addGameSession();
    logger.info('[ initServer ] 임시 게임세션 생성 ! ===>> ', game);
  } catch (e) {
    logger.error('[ initServer ] ', e);
    throw e;
  }
};

export default initServer;
