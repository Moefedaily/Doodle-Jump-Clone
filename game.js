document.addEventListener("DOMContentLoaded", function () {
  const menuContainer = document.getElementById("menu-container");
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("start-button");

  gameRunning = false;

  startButton.addEventListener("click", function () {
    menuContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    init();
  });
});

let gameRunning = false;
let score = 0;
let player;
let platforms = [];
let keys = {};
let gravity = 0.5;
let viewportOffset = 0;

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
    this.image = this.element.querySelector("img");

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

    if (this.speedX < 0) {
      this.image.src = "assets/doodle-left.png";
    } else if (this.speedX > 0) {
      this.image.src = "assets/doodle.png";
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.width > gameContainer.offsetWidth) {
      this.x = gameContainer.offsetWidth - this.width;
    }

    if (this.y < gameContainer.offsetHeight / 2 && this.speedY < 0) {
      viewportOffset -= this.speedY;
      console.log("Viewport offset:", viewportOffset);
      this.y -= this.speedY;

      platforms.forEach((platform) => {
        platform.y += -this.speedY;
        platform.updatePosition();
      });

      score += -this.speedY;
      updateScore();

      updatePlatforms();
    }

    this.updatePosition();
  }

  jump() {
    this.speedY = this.jumpForce;
  }
}

class Platform {
  constructor(x, y, width, height, type = "normal") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;

    this.isMoving = type === "moving";
    this.moveSpeed = 1;
    this.moveDirection = Math.random() < 0.5 ? -1 : 1;

    this.element = document.createElement("div");
    this.element.className = "platform platform-" + type;
    this.element.style.width = width + "px";
    this.element.style.height = height + "px";
    this.element.style.left = x + "px";
    this.element.style.top = y + "px";

    this.element.style.backgroundImage = `url('assets/platform-${type}.png')`;

    gameScreen.appendChild(this.element);
  }

  updatePosition() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  remove() {
    this.element.remove();
  }
  updateMovement() {
    if (this.isMoving) {
      this.x += this.moveSpeed * this.moveDirection;

      if (this.x <= 0) {
        this.moveDirection = 1;
      } else if (this.x + this.width >= gameContainer.offsetWidth) {
        this.moveDirection = -1;
      }

      this.updatePosition();
    }
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
  updateScore();
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

  document
    .getElementById("restart-button")
    .addEventListener("click", function () {
      document.getElementById("game-over").classList.add("hidden");

      score = 0;
      updateScore();

      platforms.forEach((platform) => platform.remove());
      platforms = [];
      createInitialPlatforms();

      gameRunning = true;
      gameLoop();
    });
}

function createInitialPlatforms() {
  platforms.push(
    new Platform(
      gameContainer.offsetWidth / 2 - 50,
      gameContainer.offsetHeight - 50,
      100,
      20
    )
  );

  for (let i = 0; i < 7; i++) {
    let x = Math.random() * (gameContainer.offsetWidth - 100);
    let y = gameContainer.offsetHeight - 150 - i * 80;
    let type = Math.random() < 0.2 ? "moving" : "normal";

    platforms.push(new Platform(x, y, 100, 30, type));
  }
}

function handleInput() {
  if (keys["ArrowLeft"]) {
    player.speedX = -3;
  } else if (keys["ArrowRight"]) {
    player.speedX = 3;
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

    const gameOverElement = document.getElementById("game-over");
    const finalScoreElement = gameOverElement.querySelector(".final-score");
    finalScoreElement.textContent = "Score: " + Math.floor(score);
    gameOverElement.classList.remove("hidden");

    gameRunning = false;
    player.x = gameContainer.offsetWidth / 2 - player.width / 2;
    player.y = gameContainer.offsetHeight - 100;
    player.speedY = 0;
    player.speedX = 0;
    player.updatePosition();

    const highScore = localStorage.getItem("highScore") || 0;
    if (score > highScore) {
      localStorage.setItem("highScore", Math.floor(score));
      console.log("high score:", Math.floor(score));
    }
  }
}

function updatePlatforms() {
  platforms = platforms.filter((platform) => {
    if (platform.y > gameContainer.offsetHeight) {
      platform.remove();
      return false;
    }
    return true;
  });

  while (platforms.length < 10) {
    let x = Math.random() * (gameContainer.offsetWidth - 100);

    let highestPlatform = platforms.reduce(
      (highest, platform) => (platform.y < highest ? platform.y : highest),
      gameContainer.offsetHeight
    );

    let y = highestPlatform - Math.random() * 80 - 50;

    let type = Math.random() < 0.2 ? "moving" : "normal";

    platforms.push(new Platform(x, y, 100, 30, type));
  }
}

function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.textContent = Math.floor(score);
}
function gameLoop() {
  if (!gameRunning) return;

  handleInput();
  player.update();
  platforms.forEach((platform) => {
    platform.updateMovement();
  });
  checkCollisions();
  requestAnimationFrame(gameLoop);
}
