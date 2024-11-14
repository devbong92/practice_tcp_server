class User {
  constructor(socket, id) {
    this.id = id;
    this.socket = socket;
    // position
    this.x = 0;
    this.y = 0; // rotaion
    this.z = 0;
    //
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    //
    this.gameId;
  }

  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
    this.z = position.z;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  calculatePosition(latency) {
    // * 위치 변화 없을 떄,
    if (this.x === this.lastX && this.y === this.lastY) {
      return {
        x: this.x,
        y: this.y,
        z: this.z,
      };
    }

    // * 시간 계산 : 초 단위
    const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000;
    // * 예상 이동 거리
    const distance = this.speed * timeDiff; // 거속시 공식
    // * 예상 방향 계산
    const directionX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
    const directionY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

    return {
      x: this.x + directionX * distance,
      y: this.y + directionY * distance,
      z: this.z,
    };
  }
}

export default User;
