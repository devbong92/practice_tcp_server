import { getProtoMessages, loadProtos } from '../src/init/loadProtos.js';
import { v4 as uuidv4 } from 'uuid';
import net from 'net';
import { config } from '../src/configs/configs.js';
import { packetParser } from '../src/utils/packets/parser/packetParser.js';
import { deserialize } from '../src/utils/packets/deserialize/deserialize.js';
import { MessageType } from '../src/constants/header.js';
import { serialize } from '../src/utils/packets/serialize/serialize.js';
import { messageNames } from '../src/protobuf/messageNames.js';

const HOST = 'localhost';
const PORT = 5555;
const CLIENT_VERSION = '1.0.0';
let clientCount = 0;

const protoTypes = {
  //
  [MessageType.MINI_GAME_MOVE_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMiniGameMoveNotification',
  },
  [MessageType.MINI_GAME_PLAYER_SPAWN_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMiniGamePlayerSpawnNotification',
  },
    protoType: 'gameNotification.S2CMiniGameStartNotification',
  },
  [MessageType.MINI_GAME_PLAYERS_STATE_SYNC_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMiniGamePlayersStateSyncNotification',
  },
  [MessageType.MINI_GAME_PLAYER_DEATH_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMiniGamePlayerDeathNotification',
  },
  [MessageType.MINI_GAME_MAP_STATE_SYNC_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMiniGameMapStateSyncNotification',
  },
  [MessageType.MINI_GAME_OVER_NOTIFICATION]: {
    protoType: 'gameNotification.S2CMinitGameOverNotification',
  },
};

class Client {
  _protoMessages = getProtoMessages();
  _socket;
  _id;
  _latency;
  _latencyInterval;
  _locationInterval;
  _framerate;
  _x;
  _y;
  buffer = Buffer.alloc(0);
  _userId = ''; // 서버로부터 받은 userId 저장
  _speed = 3; // 초당 3칸 이동
  _direction; // 이동 방향 (라디안 단위)

  constructor(id) {
    this._socket = new net.Socket();
    this._id = id;
    this._latency = this._generateInitialLatency();
    this._framerate = this._generateInitialFramerate();
    this._x = 0;
    this._y = 0;
    this._z = 0;
    this._direction = this._generateInitialDirection();
  }

  _generateInitialLatency() {
    // 초기 레이턴시 값을 50ms에서 150ms 사이로 설정
    return 50 + Math.random() * 100;
  }

  _generateInitialFramerate() {
    // 프레임레이트를 10fps에서 30fps 사이로 설정
    return 10 + Math.random() * 20;
  }

  _generateInitialDirection() {
    // 0에서 2pi 사이의 임의의 방향 설정
    return Math.random() * 2 * Math.PI;
  }

  _updateLatency() {
    // 레이턴시를 약간씩 변동시켜 실제 환경과 유사하게 만듦
    const variation = (Math.random() - 0.5) * 10; // 5ms 변동
    this._latency = Math.max(50, Math.min(150, this._latency + variation));
  }

  _updateFramerate() {
    // 프레임레이트를 약간씩 변동시킴
    const variation = (Math.random() - 0.5) * 5; // 2.5ms 변동
    this._framerate = Math.max(10, Math.min(30, this._latency + variation));
  }

  _changeDirection() {
    // 일정 확률로 방향 변경
    if (Math.random() < 0.1) {
      this._direction = Math.random() * 2 * Math.PI;
    }
  }

  _packetParser = (messageType, data) => {
    const protoMessages = getProtoMessages();
    const protoTypeName = protoTypes[messageType].protoType;

    if (!protoTypeName) {
      throw new Error(`알 수 없는 메세지 타입 : ${messageType}`);
    }

    const [packageName, typeName] = protoTypeName.split('.');
    const ProtoMessage = protoMessages[packageName][typeName];

    let payload;

    try {
      payload = ProtoMessage.decode(data);
      console.log('[ _packetParser ] payload ===>> ', payload);
    } catch (e) {
      console.error('[ _packetParser ] ===> ', e);
    }

    return payload;
  };

  init() {
    // 소켓 연결 및 이벤트 핸들러 설정
    this._socket.connect(PORT, HOST, () => {
      console.log(`Client ${this._id} connected to ${HOST} : ${PORT}`);
      console.log(`Total: ${++clientCount}`);

      // 초기 패킷 전송
      this._sendInitialPacket();

      // 레이턴시 업데이트 타이머 시작
      this._latencyInterval = setInterval(() => {
        this._updateLatency();
      }, 3000);
    });

    // 데이터 수신 이벤트 핸들러 설정
    this._socket.on('data', (data) => {
      this._handleServerData(data);
    });

    // 에러 이벤트 핸들러 설정
    this._socket.on('error', (err) => {
      console.error(`Client ${this._id} encountered error`, err);
    });

    // 연결 종료 이벤트 핸들러 설정
    this._socket.on('close', () => {
      console.log(`Client ${this._id} connection closed`);
      clearInterval(this._latencyInterval);
      clearInterval(this._locationInterval);
    });
  }

  _sendInitialPacket() {
    // 게임 참가 요청
    const messageType = MessageType.MINI_GAME_JOIN_REQUEST;
    console.log(' this._id ==+>> ', this._id);
    const payload = { playerId: this._id };
    const messageName = messageNames.game.C2SMiniGameJoinRequest;
    const buffer = serialize(messageName, messageType, payload, 1);
    this._socket.write(buffer);
    console.log(`Client ${this._id} sent game join packet`);
  }

  _handleServerData(data) {
    // 수신된 데이터를 버퍼에 추가
    this.buffer = Buffer.concat([this.buffer, data]);

    while (this.buffer.length >= config.packet.totalLength) {
      const { messageType, version, sequence, offset, length } = deserialize(this.buffer);

      if (this.buffer.length >= length) {
        console.log(`length : ${length}, messageType : ${messageType}`);

        // 패킷 데이터를 자르고 버퍼에서 제거
        const packet = this.buffer.subarray(offset, length);
        this.buffer = this.buffer.subarray(length);

        const payload = this._packetParser(messageType, packet);
        console.log(this._id + ' ] : payload ===>>> ', payload);

        if (messageType === MessageType.MINI_GAME_START_NOTIFICATION) {
          this._startLocationUpdates();
        }
      } else {
        // 아직 전체 패킷이 도착하지 않음
        break;
      }
    }
  }

  _startLocationUpdates() {
    // 위치 업데이트 타이머 시작
    const updateInterval = 1000 / this._framerate; // 밀리초 단위

    this._locationInterval = setInterval(() => {
      this._updateFramerate();
      clearInterval(this._locationInterval);
      this._startLocationUpdates(); // 프레임레이트 변경 반영을 위해 재귀적으로 호출,

      this._changeDirection(); // 방향 변경

      this._sendLocationUpdate();
    }, updateInterval);
  }

  _sendLocationUpdate() {
    if (this._userId) {
      // 아직 userId를 받지 못한 경우, 위치 업데이트를 하지 않음
      return;
    }

    // 레이턴시 만큼 딜레이 후 위치 업데이트 패킷 전송
    setTimeout(() => {
      // deltaTime 계산 (초 단위)
      const deltaTime = 1 / this._framerate;

      // 이동 거리 계산
      const distance = this._speed * deltaTime;

      // 위치 업데이트
      this._x += distance * Math.cos(this._direction);
      this._y += distance * Math.sin(this._direction);

      const messageType = MessageType.MINI_GAME_PLAYER_MOVE_REQUEST;
      const payload = {
        playerId: this._id,
        hp: 100,
        position: {
          x: this._x,
          y: this._y,
          z: this._z,
        },
        state: 1,
      };
      const messageName = messageNames.game.C2SMiniGamePlayerMoveRequest;
      const buffer = serialize(messageName, messageType, payload, 1);
      this._socket.write(buffer);
    }, this._latency);
  }
}

(async () => {
  console.log('### [ TEST CLIENT : START :] ### ');

  await loadProtos();
  let LIMIT = 4;
  let dummies = [];

  for (let i = 1; i <= LIMIT; i++) {
    const deviceId = uuidv4().slice(0, 5);
    console.log('deviceId =>> ', i);
    const dummy = new Client(i);
    dummies.push(dummy);
    dummy.init();
  }

  console.log(`${LIMIT}개의 클라이언트가 추가되었습니다.`);
})();
