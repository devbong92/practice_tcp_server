import { MessageType } from '../constants/header.js';
import {
  miniGameJoinRequestHandler,
  miniGamePlayerMoveRequestHandler,
} from './game/miniGame.handler.js';

const handlers = {
  [MessageType.MINI_GAME_JOIN_REQUEST]: {
    handler: miniGameJoinRequestHandler,
    protoType: 'game.C2SMiniGameJoinRequest',
  },
  [MessageType.MINI_GAME_PLAYER_MOVE_REQUEST]: {
    handler: miniGamePlayerMoveRequestHandler,
    protoType: 'game.C2SMiniGamePlayerMoveRequest',
  },
};

export const getHandlerByMessageType = (messageType) => {
  if (!handlers[messageType]) {
    console.error(`핸들러를 찾을 수 없습니다 : messageType : ${messageType}`);
    throw new Error(`핸들러를 찾을 수 없습니다 : messageType : ${messageType}`);
  }
  return handlers[messageType].handler;
};

export const getProtoTypeNameByMessageType = (messageType) => {
  if (!handlers[messageType]) {
    console.error(`프로토타입을 찾을 수 없습니다 : messageType : [${messageType}] `);
    throw new Error(`프로토타입을 찾을 수 없습니다 : messageType : [${messageType}] `);
  }
  return handlers[messageType].protoType;
};
