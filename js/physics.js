/**
 * PhysicsEngine - Core physics system for Valentine's Space Invaders
 * Manages entity updates, collision detection, and game state changes
 * Orchestrates all game mechanics in a single frame update cycle
 */

const PhysicsEngine = (() => {
  // Private state - stored references to game systems
  let player = null;
  let enemySwarm = null;
  let bulletManager = null;
  let particleManager = null;
  let gameState = null;
  let audioManager = null;
  let config = null;

  // Game mechanics timing
  let enemyShootTimer = 0;

  /**
   * Initialize the physics engine with references to all game systems
   * Called once during game initialization
   * @param {Object} playerRef - Player entity
   * @param {Object} enemySwarmRef - EnemySwarm manager
   * @param {Object} bulletManagerRef - BulletManager for bullets
   * @param {Object} particleManagerRef - ParticleManager for particles
   * @param {Object} gameStateRef - GameState for score/lives/wave
   * @param {Object} audioManagerRef - audioManager for sound effects
   * @param {Object} configRef - Game configuration
   */
  function init(
    playerRef,
    enemySwarmRef,
    bulletManagerRef,
    particleManagerRef,
    gameStateRef,
    audioManagerRef,
    configRef
  ) {
    player = playerRef;
    enemySwarm = enemySwarmRef;
    bulletManager = bulletManagerRef;
    particleManager = particleManagerRef;
    gameState = gameStateRef;
    audioManager = audioManagerRef;
    config = configRef;

    enemyShootTimer = 0;

    console.log('PhysicsEngine initialized');
  }

  /**
   * Main update method called every frame
   * Orchestrates the complete update sequence for all game entities and mechanics
   * @param {Object} input - Input handler with key state checks
   * @param {Object} collisionDetector - Collision detection system
   */
  function update(input, collisionDetector) {
    if (!gameState.isGameRunning || gameState.isPaused) {
      return;
    }

    // Step 1: Update player position based on input
    updatePlayerInput(input);

    // Step 2: Update all enemy positions
    enemySwarm.update(config);

    // Step 3: Update all bullets
    bulletManager.updateAll(config);

    // Step 4: Update all particles
    particleManager.updateAll();

    // Step 5: Handle random enemy shooting
    updateEnemyShooting();

    // Step 6: Run collision detection and process results
    if (collisionDetector) {
      const gameEntities = getGameEntities();
      const collisions = collisionDetector.detect(gameEntities);
      handleCollisionConsequences(collisions, input);
    }

    // Step 7: Check game over conditions (lives <= 0 handled in collision, enemies at bottom handled in swarm)
    checkGameOverConditions();

    // Step 8: Check if wave is cleared and spawn new wave
    checkWaveClearance();
  }

  /**
   * Update player position based on input
   * @param {Object} input - Input handler object
   */
  function updatePlayerInput(input) {
    if (input.isMovingLeft()) {
      player.moveLeft(config);
    } else if (input.isMovingRight()) {
      player.moveRight(config);
    } else {
      player.stop();
    }

    // Update player position
    player.update(input, config);

    // Handle player shooting
    if (input.isSpacePressed()) {
      const bullet = player.shoot();
      if (bullet) {
        bulletManager.addPlayerBullet(bullet);
        audioManager.playShoot();
      }
    }
  }

  /**
   * Handle random enemy shooting
   * Enemies fire randomly based on fire rate configuration
   */
  function updateEnemyShooting() {
    enemyShootTimer++;

    // Check if it's time for an enemy to shoot
    const fireChance = config.balance.enemyFireRate;
    if (Math.random() < fireChance) {
      const randomEnemy = enemySwarm.getRandomEnemy();
      if (randomEnemy) {
        const bullet = randomEnemy.shoot();
        if (bullet) {
          bulletManager.addEnemyBullet(bullet);
        }
      }
    }
  }

  /**
   * Process all collision results and update game state
   * Handles three types of collisions:
   * - Player bullets hitting enemies
   * - Enemy bullets hitting player
   * - Enemies reaching player position
   * @param {Object} collisions - Collision object from detector
   * @param {Object} input - Input handler (for reference, not used directly)
   */
  function handleCollisionConsequences(collisions, input) {
    if (!collisions) {
      return;
    }

    // Handle player bullet hitting enemy collisions
    if (collisions.playerBulletEnemyHits && Array.isArray(collisions.playerBulletEnemyHits)) {
      collisions.playerBulletEnemyHits.forEach((collision) => {
        handlePlayerBulletEnemyCollision(collision);
      });
    }

    // Handle enemy bullet hitting player collision
    if (collisions.enemyBulletPlayerHit && collisions.enemyBulletPlayerHit.hit) {
      handleEnemyBulletPlayerCollision(collisions.enemyBulletPlayerHit);
    }

    // Handle enemy reaching player collision
    if (collisions.playerEnemyCollision) {
      gameState.endGame();
      audioManager.playGameOver();
    }
  }

  /**
   * Handle player bullet hitting an enemy
   * - Remove bullet
   * - Mark enemy as dead
   * - Add score
   * - Emit explosion particles
   * - Play sound effect
   * @param {Object} collision - Collision object with bullet and enemy
   */
  function handlePlayerBulletEnemyCollision(collision) {
    // Remove the bullet
    if (collision.bullet) {
      collision.bullet.active = false;
    }

    // Mark enemy as dead
    if (collision.enemy) {
      collision.enemy.takeDamage();

      // Add score for destroying enemy
      gameState.addScore(config.balance.pointsPerEnemy);

      // Emit explosion particles at enemy position
      const explosionX = collision.enemy.x + collision.enemy.width / 2;
      const explosionY = collision.enemy.y + collision.enemy.height / 2;
      particleManager.emit('explosion', explosionX, explosionY, config);

      // Play enemy destroyed sound
      audioManager.playEnemyDestroyed();
    }
  }

  /**
   * Handle enemy bullet hitting player
   * - Remove bullet
   * - Damage player (lose a life)
   * - Emit particles at impact
   * - Play sound effect
   * - Grant invulnerability frames
   * - Check if game is over
   * @param {Object} collision - Collision object with bullet and player
   */
  function handleEnemyBulletPlayerCollision(collision) {
    // Only take damage if not invulnerable
    if (player.isInvulnerable()) {
      return;
    }

    // Remove the bullet
    if (collision.bullet) {
      collision.bullet.active = false;
    }

    // Emit particles at player position
    const particleX = player.x + player.width / 2;
    const particleY = player.y + player.height / 2;
    particleManager.emit('heartburst', particleX, particleY, config);

    // Play hit sound
    audioManager.playHit();

    // Lose a life
    gameState.loseLife();

    // Grant invulnerability frames (60 frames ~1 second at 60fps)
    player.grantInvulnerability(60);
  }

  /**
   * Check game over conditions
   * Game ends if player has no lives remaining
   */
  function checkGameOverConditions() {
    if (gameState.lives <= 0 && !gameState.isGameOver) {
      gameState.endGame();
      audioManager.playGameOver();
    }
  }

  /**
   * Check if current wave is cleared
   * If all enemies are destroyed, advance to next wave and spawn new enemies
   */
  function checkWaveClearance() {
    if (enemySwarm.isWaveCleared()) {
      // Advance to next wave
      gameState.nextWave();

      // Clear bullets and leftover particles
      bulletManager.clear();
      particleManager.clear();

      // Spawn new wave with increased difficulty
      enemySwarm.spawnWave(gameState.wave, config);

      // Emit celebration particles
      const centerX = config.canvas.width / 2;
      const centerY = config.canvas.height / 2;
      particleManager.emit('confetti', centerX, centerY, config);

      console.log(`Wave ${gameState.wave} spawned`);
    }
  }

  /**
   * Reset the entire game to initial state
   * Called when starting a new game
   */
  function resetGame() {
    // Reset game state
    gameState.reset();

    // Reset player
    if (player) {
      player.reset();
    }

    // Reset enemy swarm
    if (enemySwarm) {
      enemySwarm.spawnWave(1, config);
    }

    // Clear all bullets and particles
    if (bulletManager) {
      bulletManager.clear();
    }

    if (particleManager) {
      particleManager.clear();
    }

    enemyShootTimer = 0;

    console.log('Game reset complete');
  }

  /**
   * Get all game entities for rendering
   * Provides a snapshot of all entities needed for the renderer
   * @returns {Object} Object containing references to all game entities
   */
  function getGameEntities() {
    return {
      player: player,
      enemies: enemySwarm.getAllEnemies(),
      playerBullets: bulletManager.getPlayerBullets(),
      enemyBullets: bulletManager.getEnemyBullets(),
      particles: particleManager.getParticles(),
    };
  }

  /**
   * Get current game state metrics for UI
   * @returns {Object} Object with score, lives, wave, and game status
   */
  function getGameStatus() {
    return {
      score: gameState.score,
      lives: gameState.lives,
      wave: gameState.wave,
      isGameRunning: gameState.isGameRunning,
      isGameOver: gameState.isGameOver,
      isPaused: gameState.isPaused,
    };
  }

  // Public API
  return {
    init,
    update,
    resetGame,
    getGameEntities,
    getGameStatus,
    handleCollisionConsequences,
  };
})();

// Module export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhysicsEngine;
}
