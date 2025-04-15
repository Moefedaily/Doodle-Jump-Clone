// let gameRunning = false;
// let score = 0;
let canvas, ctx;
let player;
let platforms = [];

function init() {
  console.log("Game initialized");
  createGameCanvas();
  setupEventListeners();
  player = new Player(canvas.width / 2 - 15, canvas.height - 100, 30, 30, ctx);
  createInitialPlatforms();
  drawGame();
}

function createGameCanvas() {
  const gameScreen = document.getElementById("game-screen");

  canvas = document.createElement("canvas");
  canvas.id = "game-canvas";
  canvas.width = 360;
  canvas.height = 640;

  ctx = canvas.getContext("2d");

  gameScreen.appendChild(canvas);
  console.log("Canvas created");
}

function setupEventListeners() {
  console.log("Event listeners set up");
}

function createInitialPlatforms() {
  platforms.push(
    new Platform(canvas.width / 2 - 50, canvas.height - 68, 100, 10)
  );

  platforms.push(new Platform(50, canvas.height - 150, 100, 10));
  platforms.push(new Platform(150, canvas.height - 250, 100, 10));
  platforms.push(new Platform(200, canvas.height - 350, 100, 10));
}
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  platforms.forEach((platform) => {
    platform.draw();
  });

  player.draw();
}

window.onload = init;
/**
 * Player class representing the player in the game.
 * It handles the player's properties and methods.
 * @class Player
 * @constructor
 * @param {number} x - The x-coordinate of the player.
 * @param {number} y - The y-coordinate of the player.
 * @param {number} width - The width of the player.
 * @param {number} height - The height of the player.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @description This class is responsible for rendering the player on the canvas.
 * It includes methods for drawing the player and updating its position.
 */
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

/**
 * Platform class representing a platform in the game.
 * It handles the platform's properties and methods.
 * @class Platform
 * @constructor
 * @param {number} x - The x-coordinate of the platform.
 * @param {number} y - The y-coordinate of the platform.
 * @param {number} width - The width of the platform.
 * @param {number} height - The height of the platform.
 * @description This class is responsible for rendering the platform on the canvas.
 * It includes methods for drawing the platform.
 */

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
