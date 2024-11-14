import { config } from '../../../configs/configs.js';

export const deserialize = (buffer) => {
  const messageType = buffer.readUintBE(0, config.packet.messageTypeLength);
  const versionLength = buffer.readUintBE(
    config.packet.messageTypeLength,
    config.packet.versionLength,
  );
  let offset = config.packet.messageTypeLength + config.packet.versionLength;

  const version = buffer.subarray(offset, offset + versionLength).toString();
  offset += versionLength;

  const sequence = buffer.readUintBE(offset, config.packet.sequenceLength);
  offset += config.packet.sequenceLength;

  const payloadLength = buffer.readUintBE(offset, config.packet.payloadLength);
  offset += config.packet.payloadLength;

  return { messageType, version, sequence, offset, length: offset + payloadLength };
};
