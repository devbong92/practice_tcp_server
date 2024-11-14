import { config } from '../../../configs/configs.js';

export const deserialize = (socket) => {
  const messageType = socket.buffer.readUintBE(0, config.packet.messageTypeLength);
  const versionLength = socket.buffer.readUintBE(
    config.packet.messageTypeLength,
    config.packet.versionLength,
  );
  let offset = config.packet.messageTypeLength + config.packet.versionLength;

  const version = socket.buffer.subarray(offset, offset + versionLength).toString();
  offset += versionLength;

  const sequence = socket.buffer.readUintBE(offset, config.packet.sequenceLength);
  offset += config.packet.sequenceLength;

  const payloadLength = socket.buffer.readUintBE(offset, config.packet.payloadLength);
  offset += config.packet.payloadLength;

  return { messageType, version, sequence, offset, length: offset + payloadLength };
};
