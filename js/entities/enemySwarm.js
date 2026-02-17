/**
 * EnemySwarm - Manages a group of enemies in formation
 * Handles movement patterns, wave spawning, and collision detection
 */

class EnemySwarm {
  /**
   * Create a new enemy swarm
   * @param {object} config - Game configuration object
   */
  constructor(config) {
    this.enemies = [];
    this.direction = 1; // 1 for right, -1 for left
    this.moveDownAmount = 0;
    this.distanceMoved = 0; // Track horizontal distance for boundary reversal
    this.config = config;

    // Spawn initial enemies
    this.spawnWave(1, config);
  }

  /**
   * Update all enemies in the swarm
   * @param {object} config - Game configuration object
   */
  update(config) {
    // Update all alive enemies
    this.enemies.forEach((enemy) => {
      if (enemy.alive) {
        enemy.velocityX = this.getFormationSpeed(1, config) * this.direction;
        enemy.update(config);
      }
    });

    // Track horizontal movement for direction reversal
    this.distanceMoved += Math.abs(this.getFormationSpeed(1, config));

    // Reverse direction and move down every 300 pixels
    if (this.distanceMoved >= 300) {
      this.direction *= -1;
      this.moveDownAmount += 30;
      this.distanceMoved = 0;

      this.enemies.forEach((enemy) => {
        if (enemy.alive) {
          enemy.y += 30;
        }
      });
    }

    // Check if any enemy reached the bottom - trigger game over
    this.enemies.forEach((enemy) => {
      if (enemy.alive && enemy.y > config.canvas.height) {
        if (typeof GameState !== 'undefined') {
          GameState.endGame();
          console.log('Game Over - Enemy reached bottom');
        }
      }
    });
  }

  /**
   * Spawn a wave of enemies
   * @param {number} waveNumber - Current wave number
   * @param {object} config - Game configuration object
   */
  spawnWave(waveNumber, config) {
    this.enemies = [];
    this.direction = 1;
    this.moveDownAmount = 0;
    this.distanceMoved = 0;

    // Grid formation: 3-4 rows x 8 columns
    const rows = waveNumber < 5 ? 3 : 4;
    const cols = 8;
    const spacingX = config.canvas.width / (cols + 1);
    const spacingY = 60;
    const startY = 40;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = spacingX * (col + 1) - 15; // Center the 30px wide enemy
        const y = startY + row * spacingY;

        const enemy = new Enemy(x, y, config);
        // Increase speed based on wave number
        const speedIncrease = this.getFormationSpeed(waveNumber, config);
        enemy.velocityX = speedIncrease;
        this.enemies.push(enemy);
      }
    }

    console.log(`Wave ${waveNumber} spawned with ${this.enemies.length} enemies`);
  }

  /**
   * Get array of alive enemies
   * @returns {array} Array of alive enemy objects
   */
  getEnemies() {
    return this.enemies.filter((enemy) => enemy.alive);
  }

  /**
   * Get all enemies including dead ones
   * @returns {array} Array of all enemy objects
   */
  getAllEnemies() {
    return this.enemies;
  }

  /**
   * Get a random alive enemy for shooting
   * @returns {object|null} Random alive enemy or null if none alive
   */
  getRandomEnemy() {
    const aliveEnemies = this.getEnemies();
    if (aliveEnemies.length === 0) return null;
    return aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
  }

  /**
   * Remove dead enemies from the swarm
   */
  removeDeadEnemies() {
    this.enemies = this.enemies.filter((enemy) => enemy.alive);
  }

  /**
   * Check if wave is completely cleared
   * @returns {boolean} True if no alive enemies remain
   */
  isWaveCleared() {
    return this.getEnemies().length === 0;
  }

  /**
   * Calculate formation speed based on wave number
   * @param {number} waveNumber - Current wave number
   * @param {object} config - Game configuration object
   * @returns {number} Speed multiplier for this wave
   */
  getFormationSpeed(waveNumber, config) {
    const baseSpeed = config.speeds.enemySpeed;
    const speedIncrease = waveNumber * config.difficulty.speedMultiplier;
    return baseSpeed + speedIncrease;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnemySwarm;
}
