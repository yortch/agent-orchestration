/**
 * resize.js
 * Handles canvas resizing with HiDPI (devicePixelRatio) support
 * Maintains aspect ratio and makes canvas responsive to window size
 * 
 * COORDINATE SYSTEM:
 * ==================
 * This module establishes a dual coordinate system:
 * 
 * 1. LOGICAL COORDINATES (800x600):
 *    - All game logic, rendering, and collision detection uses these fixed dimensions
 *    - Accessed via getGameDimensions() - always returns {width: 800, height: 600}
 *    - Consistent across all displays regardless of physical resolution
 * 
 * 2. PHYSICAL/BACKING BUFFER COORDINATES:
 *    - canvas.width and canvas.height are scaled by devicePixelRatio (DPR)
 *    - On a 2x display: canvas.width = 1600, canvas.height = 1200
 *    - Used internally by the browser for crisp HiDPI rendering
 *    - NEVER use canvas.width/height in game logic or rendering code
 * 
 * TRANSFORM MATRIX:
 * =================
 * ctx.setTransform(dpr, 0, 0, dpr, 0, 0) establishes the scaling transformation
 * - Resets any previous transformations (non-cumulative)
 * - Maps logical coordinates to physical pixels automatically
 * - When you draw at logical position (400, 300), it renders at physical (800, 600) on 2x displays
 * 
 * USAGE:
 * ======
 * ✅ DO:     const dimensions = getGameDimensions(); player.x < dimensions.width
 * ✅ DO:     ctx.fillRect(0, 0, 800, 600) // Uses logical coordinates
 * ❌ DON'T:  player.x < canvas.width // Wrong! Uses physical pixels
 * ❌ DON'T:  ctx.scale(dpr, dpr) // Wrong! Causes cumulative scaling on resize
 */

// Target aspect ratio for the game (classic arcade 4:3)
const TARGET_ASPECT_RATIO = 4 / 3;

// Target game dimensions (logical pixels)
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

/**
 * Setup canvas with initial size and HiDPI support
 * @param {HTMLCanvasElement} canvas - The game canvas element
 */
export function setupCanvas(canvas) {
    handleResize(canvas);
}

/**
 * Handle canvas resizing with HiDPI support
 * Maintains aspect ratio and scales to fit window
 * 
 * This function:
 * 1. Calculates CSS display size (how big the canvas appears on screen)
 * 2. Sets backing buffer size (canvas.width/height) accounting for DPR
 * 3. Uses setTransform() to map logical coords → physical pixels (non-cumulative)
 * 
 * @param {HTMLCanvasElement} canvas - The game canvas element
 */
export function handleResize(canvas) {
    // Get device pixel ratio for HiDPI displays
    const dpr = window.devicePixelRatio || 1;
    
    // Get available space
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate display size maintaining aspect ratio
    let displayWidth = windowWidth;
    let displayHeight = windowHeight;
    
    const windowAspectRatio = windowWidth / windowHeight;
    
    if (windowAspectRatio > TARGET_ASPECT_RATIO) {
        // Window is wider than target ratio - constrain by height
        displayWidth = windowHeight * TARGET_ASPECT_RATIO;
    } else {
        // Window is taller than target ratio - constrain by width
        displayHeight = windowWidth / TARGET_ASPECT_RATIO;
    }
    
    // Add some padding (90% of available space)
    displayWidth *= 0.9;
    displayHeight *= 0.9;
    
    // Set CSS display size
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    
    // Set actual canvas size accounting for device pixel ratio
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    
    // Use setTransform to set scaling without accumulation
    // This resets any previous transform and sets the new one
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    console.log(`📐 Canvas resized: ${GAME_WIDTH}x${GAME_HEIGHT} logical pixels (${canvas.width}x${canvas.height} actual pixels, DPR: ${dpr})`);
}

/**
 * Get logical game dimensions
 * @returns {{width: number, height: number}} Game dimensions
 */
export function getGameDimensions() {
    return {
        width: GAME_WIDTH,
        height: GAME_HEIGHT
    };
}
