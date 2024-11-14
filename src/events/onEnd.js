import { logger } from '../configs/logger/winston.config.js';

export const onEnd = (socket) => () => {
  logger.info('클라이언트 연결이 종료되었습니다.');
};
