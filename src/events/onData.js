import { config } from '../configs/configs.js';
import { logger } from '../configs/logger/winston.config.js';
import { getHandlerByMessageType } from '../handlers/index.js';
import { packetParser } from '../utils/packets/parser/packetParser.js';
import { deserialize } from '../utils/packets/deserialize/deserialize.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= config.packet.totalLength) {
    // deserialized
    const { messageType, version, sequence, offset, length } = deserialize(socket);

    // TODO: version check
    // if (!config.client.version.includes(version)) {
    //   throw new Error(`클라이언트 버전이 일치하지 않습니다. : ${version}`);
    // }

    if (socket.buffer.length >= length) {
      logger.info(`length : ${length}, messageType : ${messageType}`);

      console.log(' offset, length ===>> ', offset, length);
      const packet = socket.buffer.subarray(offset, length);
      socket.buffer = socket.buffer.subarray(length);

      try {
        const payload = packetParser(messageType, packet);
        const handler = getHandlerByMessageType(messageType);
        console.log(' handler =>> > ', handler);
        await handler({ socket, payload });
      } catch (e) {
        logger.info('[ onData ] ', e);
      }
    } else {
      break;
    }
  }
};
