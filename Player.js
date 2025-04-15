class Player {
  constructor(x, y, width, height, ctx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.fillStyle = "#FF0000";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Player;
