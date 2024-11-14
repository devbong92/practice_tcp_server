import { v4 as uuidv4 } from 'uuid';
import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';

/**
 * 게임 세션 생성
 * @returns gameSession
 */
export const addGameSession = async () => {
  const game = new Game(uuidv4());
  gameSessions.push(game);
  return game;
};

/**
 * 게임 세션 삭제
 * @param {*} sessionId
 */
export const removeGameSessionById = (sessionId) => {
  const index = gameSessions.findIndex((session) => session.id === sessionId);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

/**
 * 특정 게임 세션 조회
 * @param {*} sessionId
 * @returns
 */
export const getGameSessionById = (sessionId) => {
  return gameSessions.find((game) => game.id === sessionId);
};

/**
 * 전체 게임 세션 조회
 * @returns
 */
export const getAllGameSessions = () => {
  return gameSessions;
};
