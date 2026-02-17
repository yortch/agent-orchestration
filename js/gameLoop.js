/**
 * GameLoop - Manages the main game loop with timing and frame-rate independence
 * Orchestrates the update-render cycle and handles pause/resume/restart logic
 */

const GameLoop = (() => {
  // State variables
  let config = null;
  let gameState = null;
  let player = null;
  let enemySwarm = null;
  let bulletManager = null;
  let particleManager = null;
  let physicsEngine = null;
  let renderer = null;
  let inputHandler = null;
  let audioManager = null;
  let collisionDetector = null;

  // Timing variables
  let lastFrameTime = 0;
  let deltaTime = 0;
  let targetFPS = 60;
  let frameInterval = 1000 / targetFPS; // ~16.67ms per frame
  let animationFrameId = null;
  let isRunning = false;
  let isPaused = false;

  // Key state tracking for special keys
  let keyStates = {
    'p': false,
    'P': false,
    'r': false,
    'R': false,
    'Enter': false,
  };

  /**
   * Initialize the GameLoop with all game systems
   * @param {Object} configRef - Game configuration
   * @param {Object} gameStateRef - Game state manager
   * @param {Object} playerRef - Player entity
   * @param {Object} enemySwarmRef - Enemy swarm manager
   * @param {Object} bulletManagerRef - Bullet manager
   * @param {Object} particleManagerRef - Particle manager
   * @param {Object} physicsEngineRef - Physics engine
   * @param {Object} rendererRef - Renderer
   * @param {Object} inputHandlerRef - Input handler
   * @param {Object} audioManagerRef - Audio manager
   * @param {Object} collisionDetectorRef - Collision detector
   */
  function init(
    configRef,
    gameStateRef,
    playerRef,
    enemySwarmRef,
    bulletManagerRef,
    particleManagerRef,
    physicsEngineRef,
    rendererRef,
    inputHandlerRef,
    audioManagerRef,
    collisionDetectorRef
  ) {
    config = configRef;
    gameState = gameStateRef;
    player = playerRef;
    enemySwarm = enemySwarmRef;
    bulletManager = bulletManagerRef;
    particleManager = particleManagerRef;
    physicsEngine = physicsEngineRef;
    renderer = rendererRef;
    inputHandler = inputHandlerRef;
    audioManager = audioManagerRef;
    collisionDetector = collisionDetectorRef;

    lastFrameTime = performance.now();
    deltaTime = 0;
    isPaused = false;
    isRunning = false;

    console.log('GameLoop initialized');
  }

  /**
   * Start the main game loop using requestAnimationFrame
   * @param {HTMLCanvasElement} canvas - The game canvas element
   */
  function start(canvas) {
    if (!canvas) {
      console.error('GameLoop.start: Canvas element not provided');
      return;
    }

    if (isRunning) {
      console.warn('GameLoop is already running');
      return;
    }

    isRunning = true;
    lastFrameTime = performance.now();
    console.log('GameLoop started');

    // Begin the animation frame loop
    animationFrameId = requestAnimationFrame(gameLoopIteration);
  }

  /**
   * Main game loop iteration - called every frame by requestAnimationFrame
   * Handles timing, updates, rendering, and special states
   * @param {number} currentTime - Current timestamp from requestAnimationFrame
   */
  function gameLoopIteration(currentTime) {
    if (!isRunning) {
      return;
    }

    // Calculate delta time in seconds for physics calculations
    deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    // Clamp delta time to prevent large jumps (e.g., when tab loses focus)
    if (deltaTime > 0.1) {
      deltaTime = 0.1;
    }

    // Handle normal game updates
    if (!isPaused && !gameState.isGameOver) {
      // Update physics and game logic with input handler
      physicsEngine.update(inputHandler, collisionDetector);

      // Draw the current game state
      const gameEntities = physicsEngine.getGameEntities();
      renderer.drawGame(gameEntities, gameState);
    } else if (gameState.isGameOver) {
      // Game over state - draw final state and wait for restart
      const gameEntities = physicsEngine.getGameEntities();
      renderer.drawGame(gameEntities, gameState);
    } else if (isPaused) {
      // Paused state - draw frozen game state with pause overlay
      const gameEntities = physicsEngine.getGameEntities();
      renderer.drawGame(gameEntities, gameState);
    }

    // Request the next frame
    animationFrameId = requestAnimationFrame(gameLoopIteration);
  }

  /**
   * Restart the game - reset all entities and resume
   */
  function restart() {
    console.log('Restarting game');

    // Reset all game systems
    gameState.reset();
    physicsEngine.resetGame();
    bulletManager.clear();
    particleManager.clear();

    // Reset pause/game over states
    isPaused = false;
    gameState.startGame();

    // Optional: Reset audio
    if (audioManager) {
      audioManager.stopAll();
      audioManager.enableBackgroundMusic('assets/sounds/background-music.mp3');
    }

    console.log('Game restarted');
  }

  /**
   * Toggle pause state
   * Game continues to render but doesn't update
   */
  function togglePause() {
    isPaused = !isPaused;
    gameState.isPaused = isPaused;
    console.log(`Game ${isPaused ? 'paused' : 'resumed'}`);

    // Optional: Pause/resume music
    if (audioManager) {
      if (isPaused) {
        // Could pause music here if needed
        console.log('Music paused');
      } else {
        console.log('Music resumed');
      }
    }
  }

  /**
   * Stop the game loop completely
   * Cleans up animation frame and resets state
   */
  function stop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    isRunning = false;
    isPaused = false;

    console.log('GameLoop stopped');
  }

  /**
   * Get current pause state
   * @returns {boolean} True if game is paused
   */
  function getPauseState() {
    return isPaused;
  }

  /**
   * Get current running state
   * @returns {boolean} True if game loop is running
   */
  function getRunningState() {
    return isRunning;
  }

  /**
   * Set up keyboard event listeners for special game keys
   * Used to handle pause, restart, etc.
   */
  function setupKeyboardListeners() {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === 'p' || key === 'P') {
        event.preventDefault();
        togglePause();
      } else if (key === 'r' || key === 'R') {
        if (gameState.isGameOver) {
          event.preventDefault();
          restart();
        }
      } else if (key === 'Enter') {
        event.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  }

  // Public API
  return {
    init,
    start,
    stop,
    restart,
    togglePause,
    setupKeyboardListeners,
    getPauseState,
    getRunningState,
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameLoop;
}
