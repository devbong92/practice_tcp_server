import { HOST, PORT, CLIENT_VERSION } from '../constants/env.js';
import { GameStates } from '../constants/gameOptions.js';
import {
  MESSAGE_TYPE_LENGTH,
  VERSION_LENGTH,
  PAYLOAD_LENGTH,
  SEQUENCE_LENGTH,
} from '../constants/header.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: MESSAGE_TYPE_LENGTH + VERSION_LENGTH + SEQUENCE_LENGTH + PAYLOAD_LENGTH,
    messageTypeLength: MESSAGE_TYPE_LENGTH,
    versionLength: VERSION_LENGTH,
    sequenceLength: SEQUENCE_LENGTH,
    payloadLength: PAYLOAD_LENGTH,
  },
  GAME_OPTIONS: {
    GAME_STATE: {
      WATING: GameStates.WAITING,
      IN_PROGRESS: GameStates.IN_PROGRESS,
    },
  },
};
