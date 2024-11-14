import { logger } from '../configs/logger/winston.config.js';

export const onError = (socket) => (err) => {
  logger.error('소켓 오류 ', err);
};
