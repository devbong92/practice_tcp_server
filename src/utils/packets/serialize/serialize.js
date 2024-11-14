import { config } from '../../../configs/configs.js';
import { getProtoMessages } from '../../../init/loadProtos.js';

export const serialize = (messageName, messageType, payload, sequence) => {
  const messageTypeBuffer = Buffer.alloc(config.packet.messageTypeLength);
  messageTypeBuffer.writeUintBE(messageType, 0, config.packet.messageTypeLength);

  const version = config.client.version;
  const versionBuffer = Buffer.from(version);
  const versionLengthBuffer = Buffer.alloc(config.packet.versionLength);
  versionLengthBuffer.writeUintBE(versionBuffer.length, 0, config.packet.versionLength);

  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUintBE(sequence, 0, config.packet.sequenceLength);

  const protoMessages = getProtoMessages();
  const [packageName, typeName] = messageName.split('.');
  const ProtoMessage = protoMessages[packageName][typeName];
  const payloadBuffer = ProtoMessage.encode(payload).finish();

  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUintBE(payloadBuffer.length, 0, config.packet.payloadLength);

  return Buffer.concat([
    messageTypeBuffer,
    versionLengthBuffer,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    payloadBuffer,
  ]);
};
