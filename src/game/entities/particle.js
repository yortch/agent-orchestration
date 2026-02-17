import { Entity } from "./entity.js";

const HEART_PARTICLE_COLORS = ["#FF004D", "#FF69B4", "#FFFFFF"];

function drawHeartPath(ctx, size) {
  const half = size / 2;
  const top = -half;
  const bottom = half;

  ctx.beginPath();
  ctx.moveTo(0, top * 0.25);
  ctx.bezierCurveTo(size * 0.28, top * 1.05, size * 0.58, top * 0.1, 0, bottom);
  ctx.bezierCurveTo(-size * 0.58, top * 0.1, -size * 0.28, top * 1.05, 0, top * 0.25);
  ctx.closePath();
}

export class Particle extends Entity {
  constructor({ x = 0, y = 0, velocityX = 0, velocityY = 0, lifetime = 0.55, size = 5, color } = {}) {
    super({ x, y, width: size, height: size });
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.lifetime = lifetime;
    this.age = 0;
    this.size = size;
    this.color = color ?? HEART_PARTICLE_COLORS[Math.floor(Math.random() * HEART_PARTICLE_COLORS.length)];
  }

  update(deltaSeconds) {
    if (!this.active) {
      return;
    }

    this.age += deltaSeconds;
    if (this.age >= this.lifetime) {
      this.destroy();
      return;
    }

    this.x += this.velocityX * deltaSeconds;
    this.y += this.velocityY * deltaSeconds;

    const drag = Math.max(0, 1 - deltaSeconds * 3.4);
    this.velocityX *= drag;
    this.velocityY *= drag;
    this.velocityY += 160 * deltaSeconds;
  }

  render(context) {
    if (!this.active) {
      return;
    }

    const progress = this.age / this.lifetime;
    const alpha = Math.max(0, 1 - progress);

    context.save();
    context.translate(this.x, this.y);
    context.globalAlpha = alpha;
    context.fillStyle = this.color;
    drawHeartPath(context, this.size);
    context.fill();
    context.restore();
  }
}
