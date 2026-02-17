/**
 * loop.js
 * Implements requestAnimationFrame-based game loop
 * Handles delta time calculation with clamping for tab switching
 * Separates update and render phases
 */

// Maximum delta time to prevent physics issues when tab is backgrounded
const MAX_DELTA_TIME = 0.1; // 100ms = 10 FPS minimum

// Game loop state
let isRunning = false;
let animationFrameId = null;
let lastTimestamp = 0;

// Callbacks for update and render
let updateCallback = null;
let renderCallback = null;

/**
 * Start the game loop
 * @param {Function} updateFn - Update function to call each frame
 * @param {Function} renderFn - Render function to call each frame
 */
export function startGameLoop(updateFn, renderFn) {
    if (isRunning) {
        console.warn('⚠️ Game loop already running');
        return;
    }
    
    updateCallback = updateFn;
    renderCallback = renderFn;
    isRunning = true;
    lastTimestamp = performance.now();
    
    console.log('▶️ Game loop started');
    
    // Start the loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Stop the game loop
 */
export function stopGameLoop() {
    if (!isRunning) {
        console.warn('⚠️ Game loop not running');
        return;
    }
    
    isRunning = false;
    
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    console.log('⏸️ Game loop stopped');
}

/**
 * Main game loop function
 * @param {number} timestamp - Current timestamp from requestAnimationFrame
 */
function gameLoop(timestamp) {
    if (!isRunning) return;
    
    // Calculate delta time in seconds
    let deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    
    // Clamp delta time to prevent physics issues
    // This handles cases where:
    // - Tab is switched (can cause large delta)
    // - Browser is slow/frozen temporarily
    deltaTime = Math.min(deltaTime, MAX_DELTA_TIME);
    
    // Update phase - game logic, physics, collisions
    if (updateCallback) {
        updateCallback(deltaTime);
    }
    
    // Render phase - draw everything
    if (renderCallback) {
        renderCallback(deltaTime);
    }
    
    // Schedule next frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * Check if game loop is running
 * @returns {boolean} True if loop is running
 */
export function isLoopRunning() {
    return isRunning;
}
