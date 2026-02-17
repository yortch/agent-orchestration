/**
 * Enemy - Single enemy in the Valentine's Space Invaders game
 * Represents one enemy ship that moves in formation and can shoot
 */

class Enemy {
  /**
   * Create a new enemy
   * @param {number} x - Starting x position
   * @param {number} y - Starting y position
   * @param {object} config - Game configuration object
   */
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.velocityX = 1;
    this.velocityY = 0;
    this.alive = true;
    this.config = config;
  }

  /**
   * Update enemy position and state
   * @param {object} config - Game configuration object
   */
  update(config) {
    if (!this.alive) return;
    
    // Move enemy by its velocity (direction is applied by swarm)
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  /**
   * Shoot a bullet from this enemy's position
   * @returns {object} EnemyBullet instance
   */
  shoot() {
    if (!this.alive) return null;

    // Create and return an EnemyBullet instance
    return new EnemyBullet(
      this.x + this.width / 2 - 2,
      this.y + this.height
    );
  }

  /**
   * Take damage and mark as dead
   */
  takeDamage() {
    this.alive = false;
  }

  /**
   * Get collision bounds for this enemy
   * @returns {object} Bounding rectangle {x, y, width, height}
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Enemy;
}
