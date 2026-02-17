export class EnemyFireControl {
  constructor({ minIntervalSeconds = 0.5, maxIntervalSeconds = 1.4, maxEnemyBullets = 4 } = {}) {
    this.minIntervalSeconds = minIntervalSeconds;
    this.maxIntervalSeconds = maxIntervalSeconds;
    this.maxEnemyBullets = maxEnemyBullets;
    this.timeUntilNextShot = this.nextInterval();
  }

  nextInterval() {
    return (
      this.minIntervalSeconds +
      Math.random() * (this.maxIntervalSeconds - this.minIntervalSeconds)
    );
  }

  reset() {
    this.timeUntilNextShot = this.nextInterval();
  }

  update(deltaSeconds, { formation, world }) {
    this.timeUntilNextShot -= deltaSeconds;

    if (this.timeUntilNextShot > 0) {
      return;
    }

    this.timeUntilNextShot = this.nextInterval();

    if (world.countBulletsByOwner("enemy") >= this.maxEnemyBullets) {
      return;
    }

    const eligibleShooters = formation.getBottomInvadersByColumn();

    if (eligibleShooters.length === 0) {
      return;
    }

    const shooter = eligibleShooters[Math.floor(Math.random() * eligibleShooters.length)];
    const bulletX = shooter.x + shooter.width / 2 - 2;
    const bulletY = shooter.y + shooter.height;
    world.spawnEnemyBullet(bulletX, bulletY);
  }
}
