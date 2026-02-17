/**
 * GameState - Manages the overall game state including score, lives, and game status
 */

const GameState = {
  // State properties
  score: 0,
  lives: 3,
  wave: 1,
  isGameRunning: false,
  isPaused: false,
  isGameOver: false,

  /**
   * Initialize the game state
   */
  init() {
    this.reset();
  },

  /**
   * Add points to the current score
   * @param {number} points - Points to add
   */
  addScore(points) {
    if (points > 0) {
      this.score += points;
      console.log(`Score increased by ${points}. Total score: ${this.score}`);
    }
  },

  /**
   * Lose a life and check if game is over
   */
  loseLife() {
    this.lives--;
    console.log(`Life lost. Remaining lives: ${this.lives}`);
    
    if (this.lives <= 0) {
      this.isGameOver = true;
      console.log('Game Over - No lives remaining');
    }
  },

  /**
   * Advance to the next wave
   */
  nextWave() {
    this.wave++;
    console.log(`Advanced to wave ${this.wave}`);
  },

  /**
   * Start the game
   */
  startGame() {
    this.isGameRunning = true;
    this.isPaused = false;
    this.isGameOver = false;
    console.log('Game started');
  },

  /**
   * End the game
   */
  endGame() {
    this.isGameRunning = false;
    this.isGameOver = true;
    console.log('Game ended');
  },

  /**
   * Toggle pause state
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    console.log(`Game ${this.isPaused ? 'paused' : 'resumed'}`);
  },

  /**
   * Reset all game state to initial values
   */
  reset() {
    this.score = 0;
    this.lives = 3;
    this.wave = 1;
    this.isGameRunning = false;
    this.isPaused = false;
    this.isGameOver = false;
    console.log('Game state reset');
  },

  /**
   * Get current score
   * @returns {number} Current score
   */
  getScore() {
    return this.score;
  },

  /**
   * Get remaining lives
   * @returns {number} Remaining lives
   */
  getLives() {
    return this.lives;
  },

  /**
   * Get current wave
   * @returns {number} Current wave number
   */
  getWave() {
    return this.wave;
  },

  /**
   * Get overall game status
   * @returns {Object} Game status object containing all state properties
   */
  getGameStatus() {
    return {
      score: this.score,
      lives: this.lives,
      wave: this.wave,
      isGameRunning: this.isGameRunning,
      isPaused: this.isPaused,
      isGameOver: this.isGameOver
    };
  }
};

// Initialize game state
GameState.init();
