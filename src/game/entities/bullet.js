import { Entity } from "./entity.js";

export class Bullet extends Entity {
  constructor({ x, y, width = 4, height = 14, velocityY = -540, owner = "player" } = {}) {
    super({ x, y, width, height });
    this.velocityY = velocityY;
    this.owner = owner;
  }

  update(deltaSeconds) {
    this.y += this.velocityY * deltaSeconds;
  }

  isOffscreen(worldHeight) {
    return this.y + this.height < 0 || this.y > worldHeight;
  }

  render(context) {
    context.fillStyle = this.owner === "player" ? "#ffd5e9" : "#ff8fbd";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
