import { Platform } from "./platforms.js";
class PlatformManager {
  constructor(game) {
    this.game = game;
    this.platforms = [];
  }

  createInitialPlatforms() {
    this.platforms.push(
      new Platform(
        this.game.gameContainer.offsetWidth / 2 - 50,
        this.game.gameContainer.offsetHeight - 50,
        100,
        20,
        "normal",
        this.game
      )
    );

    for (let i = 0; i < 7; i++) {
      let x = Math.random() * (this.game.gameContainer.offsetWidth - 100);
      let y = this.game.gameContainer.offsetHeight - 150 - i * 80;
      let type = Math.random() < 0.2 ? "moving" : "normal";

      this.platforms.push(new Platform(x, y, 100, 30, type, this.game));
    }
  }

  updatePlatforms() {
    this.platforms.forEach((platform) => {
      platform.updateMovement();
    });

    this.platforms = this.platforms.filter((platform) => {
      if (platform.y > this.game.gameContainer.offsetHeight) {
        platform.remove();
        return false;
      }
      return true;
    });

    while (this.platforms.length < 10) {
      let x = Math.random() * (this.game.gameContainer.offsetWidth - 100);

      let highestPlatform = this.platforms.reduce(
        (highest, platform) => (platform.y < highest ? platform.y : highest),
        this.game.gameContainer.offsetHeight
      );

      let y = highestPlatform - Math.random() * 80 - 50;
      let type = Math.random() < 0.2 ? "moving" : "normal";

      this.platforms.push(new Platform(x, y, 100, 30, type, this.game));
    }
  }

  scrollPlatformsDown(amount) {
    this.platforms.forEach((platform) => {
      platform.y += amount;
      platform.updatePosition();
    });
  }

  checkCollisions(player) {
    if (player.moveY > 0) {
      const playerRect = player.PlayerDiv.getBoundingClientRect();

      this.platforms.forEach((platform) => {
        const platformRect = platform.platformDiv.getBoundingClientRect();

        if (
          playerRect.right > platformRect.left &&
          playerRect.left < platformRect.right &&
          playerRect.bottom > platformRect.top &&
          playerRect.bottom - player.moveY <= platformRect.top
        ) {
          player.y = platform.y - player.height;
          player.jump();
        }
      });
    }
  }

  resetPlatforms() {
    this.platforms.forEach((platform) => platform.remove());
    this.platforms = [];

    this.createInitialPlatforms();
  }
}

export { PlatformManager };
