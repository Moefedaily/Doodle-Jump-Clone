let gameRunning = false;
let score = 0;
let player;
let platforms = [];
let keys = {};
let gravity = 0.5;

class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.jumpForce = -15;
    this.element = document.getElementById("player");

    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  update() {
    this.speedY += gravity;

    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > gameContainer.offsetWidth) {
      this.x = gameContainer.offsetWidth - this.width;
    }

    this.updatePosition();
  }

  jump() {
    this.speedY = this.jumpForce;
  }
}

class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.element = document.createElement("div");
    this.element.className = "platform";
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    gameScreen.appendChild(this.element);
  }

  updatePosition() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  remove() {
    this.element.remove();
  }
}

let gameContainer;
let gameScreen;

function init() {
  console.log("Game initialized");

  gameContainer = document.getElementById("game-container");
  gameScreen = document.getElementById("game-screen");

  setupEventListeners();

  player = new Player(
    gameContainer.offsetWidth / 2 - 15,
    gameContainer.offsetHeight - 100,
    30,
    30
  );

  createInitialPlatforms();

  gameRunning = true;
  gameLoop();
}

function setupEventListeners() {
  window.addEventListener("keydown", function (e) {
    keys[e.code] = true;
    console.log("Key pressed:", e.code);
  });

  window.addEventListener("keyup", function (e) {
    keys[e.code] = false;
    console.log("Key released:", e.code);
  });

  console.log("Event listeners set up");
}

function createInitialPlatforms() {
  platforms.push(
    new Platform(
      gameContainer.offsetWidth / 2 - 50,
      gameContainer.offsetHeight - 50,
      100,
      10
    )
  );

  for (let i = 0; i < 5; i++) {
    let x = Math.random() * (gameContainer.offsetWidth - 100);
    let y = gameContainer.offsetHeight - 150 - i * 80;
    platforms.push(new Platform(x, y, 100, 10));
  }
}

function handleInput() {
  if (keys["ArrowLeft"]) {
    player.speedX = -5;
  } else if (keys["ArrowRight"]) {
    player.speedX = 5;
  } else {
    player.speedX = 0;
  }
}

function checkCollisions() {
  if (player.speedY > 0) {
    const playerRect = player.element.getBoundingClientRect();

    platforms.forEach((platform) => {
      const platformRect = platform.element.getBoundingClientRect();

      if (
        playerRect.right > platformRect.left &&
        playerRect.left < platformRect.right &&
        playerRect.bottom > platformRect.top &&
        playerRect.bottom - player.speedY <= platformRect.top
      ) {
        player.y = platform.y - player.height;
        console.log("Player landed on platform at y:", platform.y);
        player.jump();
      }
    });
  }

  if (player.y > gameContainer.offsetHeight) {
    console.log("Game over - player fell off screen");
    player.y = 0;
  }
}

function gameLoop() {
  if (!gameRunning) return;

  handleInput();
  player.update();
  checkCollisions();

  requestAnimationFrame(gameLoop);
}

window.onload = init;
