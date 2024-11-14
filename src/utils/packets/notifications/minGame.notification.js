import { MessageType } from '../../../constants/header.js';
import { serialize } from '../serialize/serialize.js';

/**
 * 미니게임 진입 시, 미니게임 응답
 * S2CMiniGameMoveNotification
 * @param {User} user
 * @param {number} playerId
 * @param {number} gameType
 * @returns
 */
export const createS2CMiniGameMoveNotification = (user, playerId, gameType) => {
  const messageType = MessageType.MINI_GAME_MOVE_NOTIFICATION;
  const payload = { playerId, gameType };
  return serialize(messageType, payload, user.getNextSequence());
};

/**
 *
 * 미니게임 진입 후, 플레이어 캐릭터 스폰 알림
 * S2CMiniGamePlayerSpawnNotification
 * @param {User} user
 * @param {number} playerId
 * @param {object} position
 * @param {number} playerType
 * @returns
 */
export const createS2CMiniGamePlayerSpawnNotification = (user, playerId, position, playerType) => {
  const messageType = MessageType.MINI_GAME_PLAYER_SPAWN_NOTIFICATION;
  const payload = { playerId, position, playerType };
  return serialize(messageType, payload, user.getNextSequence());
};

/**
 * 미니게임 시작 알림
 * S2CMiniGameStartNotification
 * @param {User} user
 * @returns
 */
export const createS2CMiniGamePlayerStartNotification = (user) => {
  const messageType = MessageType.MINI_GAME_START_NOTIFICATION;
  const payload = {};
  return serialize(messageType, payload, user.getNextSequence());
};
