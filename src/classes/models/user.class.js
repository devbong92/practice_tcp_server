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
  }

  updatePosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getNextSequence() {
    return ++this.sequence;
  }
}
