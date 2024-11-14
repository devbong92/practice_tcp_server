import { getAllGameSessions, getGameSessionById } from '../../sessions/game.session.js';
import { addUser, getUserById, getUserBySocket } from '../../sessions/user.session.js';
import User from '../../classes/models/user.class.js';

/**
 * 미니 게임 참가
 */
export const miniGameJoinRequestHandler = ({ socket, payload }) => {
  //
  const { playerId } = payload;

  // * 유저 조회
  let user = getUserById(playerId);
  if (!user) {
    user = addUser(socket, playerId);
  }

  // * 게임 세션에 참가
  const allGameSession = getAllGameSessions();
  const game = allGameSession[0];
  game.addUser(user);
};

/**
 * 미니게임 : 플레이어 좌표 업데이트
 */
export const miniGamePlayerMoveRequestHandler = ({ socket, payload }) => {
  console.log(' [ miniGamePlayerMoveRequest ] payload ====>> ', payload);

  const { playerId, hp, position, state } = payload;

  const user = getUserBySocket(socket);
  const game = getGameSessionById(user.gameId);

  user.updatePosition(position);
  const packet = game.getAllLocation(user);
  socket.write(packet);
};
