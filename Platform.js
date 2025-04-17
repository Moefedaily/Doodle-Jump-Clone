class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
export default Platform;
