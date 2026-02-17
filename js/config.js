/**
 * Game Configuration for Valentine's Space Invaders
 * Central location for all game settings and constants
 */

const config = {
  // Canvas dimensions
  canvas: {
    width: 800,
    height: 600,
  },

  // Game speeds (pixels per frame)
  speeds: {
    playerSpeed: 5,
    enemySpeed: 1,
    bulletSpeed: 7,
  },

  // Enemy spawning configuration
  spawning: {
    spawnRate: 0.02,
    initialEnemies: 8,
  },

  // Valentine's Day color palette
  colors: {
    primary: '#e91e63',        // Pink
    secondary: '#ff69b4',      // Hot pink
    accent: '#ff1744',         // Deep red
    playerColor: '#fff',       // White
    enemyColor: '#ffb3d9',     // Light pink
    bulletColor: '#ff6ec7',    // Rose
    backgroundColor: '#fce4ec', // Very light pink
    textColor: '#d32f2f',      // Dark red
  },

  // Game balance settings
  balance: {
    pointsPerEnemy: 10,
    playerLives: 3,
    enemyFireRate: 0.003,
  },

  // Difficulty scaling
  difficulty: {
    speedMultiplier: 0.1,      // Increases per wave
  },

  // Audio settings
  audio: {
    volume: 0.5,               // 50% volume
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
