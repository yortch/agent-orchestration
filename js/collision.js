/**
 * CollisionDetector
 * Handles all collision detection for the game
 * Does NOT modify entities - just detects and reports collisions
 */
const CollisionDetector = {
  /**
   * AABB (Axis-Aligned Bounding Box) collision detection
   * @param {Object} rect1 - {x, y, width, height}
   * @param {Object} rect2 - {x, y, width, height}
   * @returns {boolean} true if rectangles overlap
   */
  checkRectCollision(rect1, rect2) {
    // Early exit if boxes don't overlap on x-axis
    if (rect1.x + rect1.width < rect2.x || rect2.x + rect2.width < rect1.x) {
      return false;
    }
    
    // Early exit if boxes don't overlap on y-axis
    if (rect1.y + rect1.height < rect2.y || rect2.y + rect2.height < rect1.y) {
      return false;
    }
    
    // Boxes overlap on both axes
    return true;
  },

  /**
   * Check collisions between player bullets and enemies
   * @param {Array} playerBullets - Array of bullet objects with bounds
   * @param {Array} enemies - Array of enemy objects with bounds
   * @returns {Array} Array of collision objects [{bullet, enemy}, ...]
   */
  checkPlayerBulletEnemyCollisions(playerBullets, enemies) {
    const hits = [];
    
    for (let bullet of playerBullets) {
      for (let enemy of enemies) {
        if (this.checkRectCollision(bullet, enemy)) {
          hits.push({ bullet, enemy });
        }
      }
    }
    
    return hits;
  },

  /**
   * Check collisions between enemy bullets and player
   * Accounts for player invulnerability if applicable
   * @param {Array} enemyBullets - Array of bullet objects with bounds
   * @param {Object} player - Player object with bounds and invulnerability property
   * @returns {Object|boolean} {hit: true, bullet} if hit, false otherwise
   */
  checkEnemyBulletPlayerCollisions(enemyBullets, player) {
    // Early exit if player is invulnerable
    if (player.invulnerableFrames && player.invulnerableFrames > 0) {
      return false;
    }
    
    for (let bullet of enemyBullets) {
      if (this.checkRectCollision(bullet, player)) {
        return { hit: true, bullet };
      }
    }
    
    return false;
  },

  /**
   * Check if any enemy has reached the player (collision)
   * This typically indicates game over condition
   * @param {Object} player - Player object with bounds
   * @param {Array} enemies - Array of enemy objects with bounds
   * @returns {boolean} true if any enemy collides with player
   */
  checkPlayerEnemyCollisions(player, enemies) {
    for (let enemy of enemies) {
      if (this.checkRectCollision(player, enemy)) {
        return true;
      }
    }
    
    return false;
  },

  /**
   * Run all collision checks at once
   * Convenience method for the game loop
   * @param {Array} playerBullets - Array of player bullet objects
   * @param {Array} enemyBullets - Array of enemy bullet objects
   * @param {Object} player - Player object
   * @param {Array} enemies - Array of enemy objects
   * @returns {Object} {playerBulletEnemyHits, enemyBulletPlayerHit, playerEnemyCollision}
   */
  getAllCollisions(playerBullets, enemyBullets, player, enemies) {
    return {
      playerBulletEnemyHits: this.checkPlayerBulletEnemyCollisions(playerBullets, enemies),
      enemyBulletPlayerHit: this.checkEnemyBulletPlayerCollisions(enemyBullets, player),
      playerEnemyCollision: this.checkPlayerEnemyCollisions(player, enemies)
    };
  },

  /**
   * Detect all collisions in the game
   * Main entry point for collision detection called from game loop
   * @param {Object} gameEntities - Contains {player, enemies, playerBullets, enemyBullets}
   * @returns {Object} {playerBulletEnemyHits, enemyBulletPlayerHit, playerEnemyCollision}
   */
  detect(gameEntities) {
    if (!gameEntities) {
      return {
        playerBulletEnemyHits: [],
        enemyBulletPlayerHit: false,
        playerEnemyCollision: false
      };
    }

    return this.getAllCollisions(
      gameEntities.playerBullets || [],
      gameEntities.enemyBullets || [],
      gameEntities.player,
      gameEntities.enemies || []
    );
  }
};
