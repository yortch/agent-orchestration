/**
 * Player class for Valentine's Space Invaders
 * Represents the player's ship at the bottom of the screen
 */

class Player {
  /**
   * Initialize a new player
   * @param {Object} config - Game configuration object
   */
  constructor(config) {
    this.config = config;

    // Position and dimensions
    this.x = config.canvas.width / 2 - 20; // Center horizontally (width is 40)
    this.y = config.canvas.height - 50;    // Near bottom
    this.width = 40;
    this.height = 40;

    // Movement
    this.velocityX = 0;

    // State
    this.alive = true;
    this.invulnerableFrames = 0;

    // Last shot time for subsequent shoot delay management
    this.lastShotFrame = 0;
  }

  /**
   * Update player state each frame
   * @param {Object} input - Input handler object with pressed keys
   * @param {Object} config - Game configuration
   */
  update(input, config) {
    // Apply velocity to position
    this.x += this.velocityX;

    // Boundary checking - clamp x position
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x + this.width > config.canvas.width) {
      this.x = config.canvas.width - this.width;
    }

    // Decrement invulnerability timer
    if (this.invulnerableFrames > 0) {
      this.invulnerableFrames--;
    }
  }

  /**
   * Move left by setting velocity
   * @param {Object} config - Game configuration
   */
  moveLeft(config) {
    this.velocityX = -config.speeds.playerSpeed;
  }

  /**
   * Move right by setting velocity
   * @param {Object} config - Game configuration
   */
  moveRight(config) {
    this.velocityX = config.speeds.playerSpeed;
  }

  /**
   * Stop movement
   */
  stop() {
    this.velocityX = 0;
  }

  /**
   * Fire a bullet from player position
   * @returns {Object} PlayerBullet instance
   */
  shoot() {
    // Create a bullet at the center-top of the player
    const bullet = new PlayerBullet(
      this.x + this.width / 2 - 2,  // Center horizontally
      this.y,                        // Top of player
      this.config.speeds.bulletSpeed // Use configured speed
    );

    return bullet;
  }

  /**
   * Apply damage to player
   * Sets alive to false
   */
  takeDamage() {
    this.alive = false;
    // Could add health system here if needed
    // this.health -= 1;
  }

  /**
   * Get player bounding box for collision detection
   * @returns {Object} Bounds object {x, y, width, height}
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Check if player is currently invulnerable
   * @returns {boolean} True if invulnerable, false otherwise
   */
  isInvulnerable() {
    return this.invulnerableFrames > 0;
  }

  /**
   * Grant invulnerability frames after taking damage
   * @param {number} frames - Number of frames to be invulnerable (default: 60 frames ~1 second at 60fps)
   */
  grantInvulnerability(frames = 60) {
    this.invulnerableFrames = frames;
  }

  /**
   * Reset player to starting position and state
   */
  reset() {
    this.x = this.config.canvas.width / 2 - 20;
    this.y = this.config.canvas.height - 50;
    this.velocityX = 0;
    this.alive = true;
    this.invulnerableFrames = 0;
  }

  /**
   * Get player visual properties for rendering
   * @returns {Object} Visual properties including position and color
   */
  getVisual() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.config.colors.playerColor,
      isInvulnerable: this.isInvulnerable(),
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Player;
}
