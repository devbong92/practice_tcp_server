import { logger } from '../../../configs/logger/winston.config.js';
import { getProtoTypeNameByMessageType } from '../../../handlers/index.js';
import { getProtoMessages } from '../../../init/loadProtos.js';

export const packetParser = (messageType, data) => {
  const protoMessages = getProtoMessages();
  const protoTypeName = getProtoTypeNameByMessageType(messageType);

  if (!protoTypeName) {
    throw new Error(`알 수 없는 메세지 타입 : ${messageType}`);
  }

  const [packageName, typeName] = protoTypeName.split('.');
  const ProtoMessage = protoMessages[packageName][typeName];

  let payload;

  try {
    payload = ProtoMessage.decode(data);
    logger.info('[ packetParser ] payload ===>> ', payload);
  } catch (e) {
    logger.error('[ packetParser ] ===> ', e);
  }

  return payload;
};
