import { Invader } from "./entities/invader.js";

export class InvaderFormation {
  constructor({
    rows = 5,
    columns = 10,
    startX = 90,
    startY = 80,
    gapX = 14,
    gapY = 14,
    invaderWidth = 42,
    invaderHeight = 28,
    baseSpeed = 36,
    maxSpeed = 160,
    stepDownDistance = 18,
  } = {}) {
    this.rows = rows;
    this.columns = columns;
    this.startX = startX;
    this.startY = startY;
    this.gapX = gapX;
    this.gapY = gapY;
    this.invaderWidth = invaderWidth;
    this.invaderHeight = invaderHeight;
    this.baseSpeed = baseSpeed;
    this.maxSpeed = maxSpeed;
    this.stepDownDistance = stepDownDistance;
    this.direction = 1;
    this.invaders = [];
    this.totalInvaderCount = rows * columns;

    this.reset();
  }

  reset() {
    this.direction = 1;
    this.invaders = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        const x = this.startX + column * (this.invaderWidth + this.gapX);
        const y = this.startY + row * (this.invaderHeight + this.gapY);

        this.invaders.push(
          new Invader({
            x,
            y,
            width: this.invaderWidth,
            height: this.invaderHeight,
            row,
            column,
          }),
        );
      }
    }
  }

  getAliveInvaders() {
    return this.invaders.filter((invader) => invader.active);
  }

  getAliveCount() {
    return this.getAliveInvaders().length;
  }

  getCurrentSpeed() {
    const aliveCount = this.getAliveCount();

    if (aliveCount <= 0) {
      return 0;
    }

    const progress = 1 - aliveCount / this.totalInvaderCount;
    return this.baseSpeed + (this.maxSpeed - this.baseSpeed) * progress;
  }

  getBounds() {
    const aliveInvaders = this.getAliveInvaders();

    if (aliveInvaders.length === 0) {
      return null;
    }

    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;

    for (const invader of aliveInvaders) {
      left = Math.min(left, invader.x);
      right = Math.max(right, invader.x + invader.width);
      top = Math.min(top, invader.y);
      bottom = Math.max(bottom, invader.y + invader.height);
    }

    return { left, right, top, bottom };
  }

  update(deltaSeconds, { worldWidth }) {
    const aliveInvaders = this.getAliveInvaders();

    if (aliveInvaders.length === 0) {
      return;
    }

    const speed = this.getCurrentSpeed();
    const horizontalStep = this.direction * speed * deltaSeconds;
    const bounds = this.getBounds();

    if (!bounds) {
      return;
    }

    const wouldHitRight = this.direction > 0 && bounds.right + horizontalStep >= worldWidth;
    const wouldHitLeft = this.direction < 0 && bounds.left + horizontalStep <= 0;

    if (wouldHitRight || wouldHitLeft) {
      this.direction *= -1;
      for (const invader of aliveInvaders) {
        invader.y += this.stepDownDistance;
      }
      return;
    }

    for (const invader of aliveInvaders) {
      invader.x += horizontalStep;
    }
  }

  getBottomInvadersByColumn() {
    const byColumn = new Map();

    for (const invader of this.getAliveInvaders()) {
      const current = byColumn.get(invader.column);

      if (!current || invader.y > current.y) {
        byColumn.set(invader.column, invader);
      }
    }

    return [...byColumn.values()];
  }

  hasReachedBottom(limitY) {
    const bounds = this.getBounds();

    if (!bounds) {
      return false;
    }

    return bounds.bottom >= limitY;
  }

  render(context) {
    for (const invader of this.getAliveInvaders()) {
      invader.render(context);
    }
  }
}
