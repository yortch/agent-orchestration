import { Entity } from "./entity.js";

export class Player extends Entity {
  constructor({
    x = 0,
    y = 0,
    width = 50,
    height = 28,
    speed = 340,
    worldWidth,
    fireCooldownSeconds = 0.28,
    maxPlayerBullets = 2,
  } = {}) {
    super({ x, y, width, height });

    if (typeof worldWidth !== "number") {
      throw new Error("Player requires worldWidth.");
    }

    this.worldWidth = worldWidth;
    this.speed = speed;
    this.fireCooldownSeconds = fireCooldownSeconds;
    this.maxPlayerBullets = maxPlayerBullets;
    this.fireCooldownRemaining = 0;
    this.lives = 3;
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.fireCooldownRemaining = 0;
  }

  update(deltaSeconds, { input, world }) {
    const direction = Number(input.isDown("right")) - Number(input.isDown("left"));
    this.x += direction * this.speed * deltaSeconds;
    this.x = Math.max(0, Math.min(this.worldWidth - this.width, this.x));

    this.fireCooldownRemaining = Math.max(0, this.fireCooldownRemaining - deltaSeconds);

    if (input.consumePressed("shoot")) {
      this.tryFire(world);
    }
  }

  tryFire(world) {
    if (this.fireCooldownRemaining > 0) {
      return false;
    }

    if (world.countBulletsByOwner("player") >= this.maxPlayerBullets) {
      return false;
    }

    const spawnX = this.x + this.width / 2 - 2;
    const spawnY = this.y - 12;
    world.spawnPlayerBullet(spawnX, spawnY);
    world.audio?.playShoot?.();
    this.fireCooldownRemaining = this.fireCooldownSeconds;
    return true;
  }

  render(context) {
    context.fillStyle = "#ff6fa8";
    context.fillRect(this.x, this.y, this.width, this.height);

    context.fillStyle = "#ffd5e9";
    context.fillRect(this.x + 18, this.y - 10, 14, 10);
  }
}
