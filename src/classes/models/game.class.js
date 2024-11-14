import { config } from '../../configs/configs.js';
import { MessageType } from '../../constants/header.js';
import { messageNames } from '../../protobuf/messageNames.js';
import {
  createS2CMiniGamePlayerSpawnNotification,
  createS2CMiniGamePlayerStartNotification,
} from '../../utils/packets/notifications/minGame.notification.js';
import { serialize } from '../../utils/packets/serialize/serialize.js';
import IntervalManager from '../managers/interval.manager.js';

class Game {
  constructor(id, gameType) {
    this.id = id;
    this.gameType = gameType;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = config.GAME_OPTIONS.GAME_STATE.WATING;
    this.maxUsers = 4; // TODO: 게임 타입마다 바꿔야함
  }

  addUser(user) {
    if (this.users.length >= this.maxUsers) {
      throw new Error('해당 게임 세션은 가득 찼습니다.');
    }

    this.users.push(user);
    user.gameId = this.id;

    // TODO: 임시 테스트용
    if (this.users.length >= this.maxUsers) {
      this.startGame();
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  startGame() {
    this.state = config.GAME_OPTIONS.GAME_STATE.IN_PROGRESS;

    // 1. player spawn notification
    let playerType = 1; // * 임시로 관리? 지정가능?
    this.users.forEach((user) => {
      const playerSpawnNotification = createS2CMiniGamePlayerSpawnNotification(
        user,
        user.id,
        {
          x: user.x,
          y: user.y,
          z: user.z,
        },
        playerType++,
      );
      user.socket.write(playerSpawnNotification);
    });

    // 대기?

    // 2. game Start notification
    this.users.forEach((user) => {
      const miniGameStartNotification = createS2CMiniGamePlayerStartNotification(user);
      user.socket.write(miniGameStartNotification);
    });
  }

  getAllLocation(target) {
    const maxLatency = 0; //this.getMaxLatency();

    const locationData = [];
    this.users.forEach((user) => {
      if (user.id !== target.id) {
        const { x, y, z } = user.calculatePosition(maxLatency);
        locationData.push({
          playerId: user.id,
          position: { x, y, z },
          hp: 100,
          state: 1,
        });
      }
    });

    const messageType = MessageType.MINI_GAME_PLAYERS_STATE_SYNC_NOTIFICATION;
    const messageName = messageNames.gameNotification.S2CMiniGamePlayersStateSyncNotification;
    return serialize(messageName, messageType, { players: locationData }, target.getNextSequence());
  }
}

export default Game;
