/**
 * main.js - Game Bootstrap and Entry Point
 * Initializes all game systems and wires up event listeners
 */

/**
 * Initialize and start the game
 * This function runs when the DOM is ready
 */
function initializeGame() {
  console.log('=== Cupid\'s Invasion - Game Initialization ===');

  try {
    // Step 1: Get canvas element and validate
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      console.error('Canvas element with id="gameCanvas" not found');
      return;
    }
    console.log('Canvas element found:', canvas.width, 'x', canvas.height);

    // Step 2: Initialize input handler
    console.log('Initializing InputHandler...');
    InputHandler.setup();

    // Step 3: Initialize audio system
    console.log('Initializing AudioManager...');
    audioManager.init();

    // Step 4: Create game state
    console.log('Creating GameState...');
    GameState.init();

    // Step 5: Create player entity
    console.log('Creating Player...');
    const player = new Player(config);

    // Step 6: Create enemy swarm
    console.log('Creating EnemySwarm...');
    const enemySwarm = new EnemySwarm(config);

    // Step 7: Create bullet manager
    console.log('Creating BulletManager...');
    const bulletManager = BulletManager;

    // Step 8: Create particle manager
    console.log('Creating ParticleManager...');
    const particleManager = ParticleManager;
    particleManager.init();

    // Step 9: Initialize physics engine
    console.log('Initializing PhysicsEngine...');
    PhysicsEngine.init(
      player,
      enemySwarm,
      bulletManager,
      particleManager,
      GameState,
      audioManager,
      config
    );

    // Step 10: Initialize renderer
    console.log('Initializing Renderer...');
    const rendererInitialized = Renderer.init(canvas, config);
    if (!rendererInitialized) {
      console.error('Failed to initialize renderer');
      return;
    }

    // Step 11: Create and initialize game loop
    console.log('Initializing GameLoop...');
    GameLoop.init(
      config,
      GameState,
      player,
      enemySwarm,
      bulletManager,
      particleManager,
      PhysicsEngine,
      Renderer,
      InputHandler,
      audioManager,
      CollisionDetector
    );

    // Step 12: Set up UI event listeners
    console.log('Setting up UI event listeners...');
    setupUIEventListeners();

    // Step 13: Set up keyboard listeners for game controls
    console.log('Setting up keyboard listeners...');
    GameLoop.setupKeyboardListeners();

    // Step 14: Handle window resize (optional)
    window.addEventListener('resize', handleWindowResize);

    // Step 15: Handle cleanup on page unload
    window.addEventListener('beforeunload', handleWindowUnload);

    // Step 16: Start the game
    console.log('Starting game...');
    GameState.startGame();
    GameLoop.start(canvas);

    // Step 17: Enable background music
    try {
      audioManager.enableBackgroundMusic('assets/sounds/background-music.mp3');
    } catch (error) {
      console.warn('Could not enable background music:', error);
    }

    console.log('=== Game initialization complete ===\n');
  } catch (error) {
    console.error('Fatal error during game initialization:', error);
    alert('Failed to initialize game. Check console for details.');
  }
}

/**
 * Set up UI element event listeners
 * Connects buttons and controls to game functions
 */
function setupUIEventListeners() {
  // Pause button
  const pauseButton = document.getElementById('pause-btn');
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      GameLoop.togglePause();
      updateUIState();
    });
  }

  // Resume button (in pause modal)
  const resumeButton = document.getElementById('resume-btn');
  if (resumeButton) {
    resumeButton.addEventListener('click', () => {
      GameLoop.togglePause();
      updateUIState();
    });
  }

  // Restart button (in game over modal)
  const restartButton = document.getElementById('restart-btn');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      if (GameState.isGameOver) {
        GameLoop.restart();
        updateUIState();
      }
    });
  }

  // Optional: Update HUD from game state changes
  setInterval(() => {
    updateHUD();
    updateUIState();
  }, 100); // Update UI every 100ms
}

/**
 * Update HUD display elements with current game state
 */
function updateHUD() {
  try {
    const scoreElement = document.getElementById('score');
    const livesElement = document.getElementById('lives');
    const waveElement = document.getElementById('wave');
    const finalScoreElement = document.getElementById('final-score');

    if (scoreElement) {
      scoreElement.textContent = GameState.score;
    }
    if (livesElement) {
      // Show hearts as ❤️ emoji
      const h = '❤️';
      livesElement.textContent = h.repeat(Math.max(0, GameState.lives));
    }
    if (waveElement) {
      waveElement.textContent = GameState.wave;
    }
    if (finalScoreElement && GameState.isGameOver) {
      finalScoreElement.textContent = GameState.score;
    }
  } catch (error) {
    console.warn('Error updating HUD:', error);
  }
}

/**
 * Update UI elements based on game state (modals, buttons, etc)
 */
function updateUIState() {
  try {
    const pauseModal = document.getElementById('pause-modal');
    const gameOverModal = document.getElementById('game-over-modal');
    const pauseButton = document.getElementById('pause-btn');

    // Handle Pause Modal
    if (pauseModal) {
      if (GameState.isPaused && !GameState.isGameOver) {
        pauseModal.classList.remove('hidden');
      } else {
        pauseModal.classList.add('hidden');
      }
    }

    // Handle Game Over Modal
    if (gameOverModal) {
      if (GameState.isGameOver) {
        gameOverModal.classList.remove('hidden');
      } else {
        gameOverModal.classList.add('hidden');
      }
    }

    // Update Pause Button text
    if (pauseButton) {
      pauseButton.textContent = GameState.isPaused ? 'Resume Game' : 'Pause Game';
    }

  } catch (error) {
    console.warn('Error updating UI state:', error);
  }
}

/**
 * Update pause button state and label
 */
function updatePauseButtonState() {
  // Deprecated in favor of updateUIState
}

/**
 * Update restart button state
 */
function updateRestartButtonState() {
  // Deprecated in favor of updateUIState
}

/**
 * Handle window resize event
 * Optionally adjust canvas size or game behavior on resize
 */
function handleWindowResize() {
  // Could add responsive canvas resizing here if needed
  // For now, just log the resize
  console.log('Window resized - game continues at', window.innerWidth, 'x', window.innerHeight);
}

/**
 * Handle page unload
 * Clean up resources and stop audio
 */
function handleWindowUnload() {
  console.log('Window unloading - cleaning up');

  // Stop game loop
  GameLoop.stop();

  // Stop all audio
  try {
    audioManager.stopAll();
  } catch (error) {
    console.warn('Error stopping audio:', error);
  }

  // Remove event listeners
  window.removeEventListener('keydown', null);
  window.removeEventListener('keyup', null);
  window.removeEventListener('resize', handleWindowResize);
}

/**
 * Show startup message in console
 */
function showStartupMessage() {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     Cupid's Invasion - Game Ready     ║
  ║                                       ║
  ║  Controls:                            ║
  ║  • Arrow Left/Right: Move            ║
  ║  • Space: Shoot                       ║
  ║  • P / Enter: Pause/Resume            ║
  ║  • R: Restart (when game over)        ║
  ║                                       ║
  ║  Enjoy the Valentine's themed fun!   ║
  ╚═══════════════════════════════════════╝
  `);
}

// ============================================
// ENTRY POINT - Wait for DOM to be ready
// ============================================

if (document.readyState === 'loading') {
  // DOM is still loading
  document.addEventListener('DOMContentLoaded', () => {
    showStartupMessage();
    initializeGame();
  });
} else {
  // DOM is already loaded
  showStartupMessage();
  initializeGame();
}
