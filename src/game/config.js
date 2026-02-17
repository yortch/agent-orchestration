/**
 * config.js
 * Centralized gameplay constants and tuning parameters
 * All magic numbers should be defined here for easy game balance adjustments
 */

// ========================================
// PLAYER CONFIGURATION
// ========================================
export const PLAYER_CONFIG = {
    // Movement
    SPEED: 250, // pixels per second
    WIDTH: 40,
    HEIGHT: 40,
    
    // Shooting
    SHOOT_COOLDOWN: 500, // milliseconds between shots
    MAX_PROJECTILES: 1, // Limit simultaneous projectiles (classic Space Invaders style)
    
    // Lives
    STARTING_LIVES: 3
};

// ========================================
// ENEMY CONFIGURATION
// ========================================
export const ENEMY_CONFIG = {
    // Grid layout
    ROWS: 5,
    COLS: 11,
    WIDTH: 32,
    HEIGHT: 32,
    SPACING_X: 50,
    SPACING_Y: 45,
    START_Y: 80, // Starting Y position from top
    
    // Movement
    BASE_SPEED: 30, // Base horizontal speed (pixels per second)
    SPEED_PER_LEVEL: 0.15, // 15% speed increase per level
    DROP_DISTANCE: 20, // Pixels to drop when changing direction
    
    // Speed scaling based on remaining enemies (simulates "heartbeat" acceleration)
    SPEED_SCALE_MIN: 1.0, // Speed multiplier with all enemies alive
    SPEED_SCALE_MAX: 3.0, // Speed multiplier with few enemies left
    SPEED_SCALE_THRESHOLD: 0.2, // When 20% or fewer enemies remain, use max speed
    
    // Shooting
    BASE_FIRE_RATE: 0.002, // Base probability of enemy shooting per frame (per enemy)
    FIRE_RATE_PER_LEVEL: 0.0003, // Increase per level
    MAX_PROJECTILES: 3, // Maximum enemy projectiles on screen at once
    MIN_SHOT_INTERVAL: 0.5, // Minimum seconds between any enemy shots (global cooldown)
    
    // Animation
    PULSE_SPEED: 2.0, // Speed of pulse animation
    PULSE_AMOUNT: 0.15, // Scale factor for pulse (0.85 - 1.15)
    
    // Point values by row type (from spec)
    POINTS: {
        red: 10,    // Bottom row (easy to hit)
        pink: 20,   // Middle rows
        purple: 30  // Top rows (hardest to reach)
    }
};

// Row types from top to bottom
export const ENEMY_ROW_TYPES = ['purple', 'purple', 'pink', 'pink', 'red'];

// ========================================
// PROJECTILE CONFIGURATION
// ========================================
export const PROJECTILE_CONFIG = {
    // Player projectiles (love arrows)
    PLAYER_WIDTH: 6,
    PLAYER_HEIGHT: 20,
    PLAYER_SPEED: 400, // pixels per second (upward)
    PLAYER_COLOR: '#FF1493', // Deep Pink
    
    // Enemy projectiles (falling hearts/kisses)
    ENEMY_WIDTH: 6,
    ENEMY_HEIGHT: 16,
    ENEMY_SPEED: 200, // pixels per second (downward)
    ENEMY_COLOR: '#FF69B4' // Hot Pink
};

// ========================================
// SHIELD CONFIGURATION
// ========================================
export const SHIELD_CONFIG = {
    COUNT: 4,
    BLOCK_SIZE: 3, // Size of each destructible pixel/block
    Y_OFFSET: 200, // Distance from bottom of screen
    BLOCKS_PER_HIT: 1, // Blocks destroyed per hit
    BLOCK_HEALTH: 2 // Hits a block can take before destruction
};

// ========================================
// LEVEL PROGRESSION
// ========================================
export const LEVEL_CONFIG = {
    STARTING_LEVEL: 1,
    SPEED_INCREASE: 0.15, // 15% speed increase per level (multiplicative)
    FIRE_RATE_INCREASE: 0.0003, // Additive fire rate increase per level
    
    // Optional: Grid starts lower each level (more aggressive)
    START_Y_DROP_PER_LEVEL: 0, // Set to 0 to disable, or 20 for one row lower per level
    
    // Level clear
    CLEAR_DURATION: 3.0 // Seconds to display "Level Clear" before next level
};

// ========================================
// SCORING CONFIGURATION
// ========================================
export const SCORING_CONFIG = {
    // Enemy point values defined in ENEMY_CONFIG.POINTS
    
    // Bonus UFO/OFO (Optional Feature Object)
    BONUS_MIN: 100,
    BONUS_MAX: 300,
    
    // High score storage
    HIGH_SCORE_KEY: 'loveInvaders_highScore'
};

// ========================================
// COLLISION DETECTION
// ========================================
export const COLLISION_CONFIG = {
    // Collision box adjustments (multipliers of entity size)
    PLAYER_HITBOX_SCALE: 0.8, // Slightly smaller hitbox for player (more forgiving)
    ENEMY_HITBOX_SCALE: 0.9,
    PROJECTILE_HITBOX_SCALE: 1.0
};

// ========================================
// GAME BOUNDS
// ========================================
export const GAME_CONFIG = {
    // Invasion line (if enemies reach this Y, game over)
    INVASION_Y_THRESHOLD: 0.85, // 85% of screen height
    
    // Projectile cleanup (off-screen removal)
    PROJECTILE_CLEANUP_MARGIN: 50 // pixels off-screen before removal
};

// ========================================
// DEBUGGING & TUNING
// ========================================
export const DEBUG = {
    SHOW_HITBOXES: false,
    SHOW_GRID_BOUNDS: false,
    LOG_COLLISIONS: false,
    INVINCIBLE_PLAYER: false
};

// Export all configs as a single object for convenience
export default {
    PLAYER_CONFIG,
    ENEMY_CONFIG,
    ENEMY_ROW_TYPES,
    PROJECTILE_CONFIG,
    SHIELD_CONFIG,
    LEVEL_CONFIG,
    SCORING_CONFIG,
    COLLISION_CONFIG,
    GAME_CONFIG,
    DEBUG
};
