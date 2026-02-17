/**
 * player.js
 * Player (Cupid's Cloud) gameplay mechanics
 * Handles movement, shooting, hit detection, and respawning
 */

import { getGameDimensions } from '../canvas/resize.js';
import { PLAYER_CONFIG } from './config.js';

// Additional player constants not in config
const INVINCIBILITY_DURATION = 2000; // milliseconds (2 seconds)
const BOUNDS_PADDING = 10; // pixels from edge

/**
 * Initialize a new player entity
 * @returns {Object} Player entity with initial properties
 */
export function initPlayer() {
    const dimensions = getGameDimensions();
    
    return {
        x: dimensions.width / 2,
        y: dimensions.height - 80, // Near bottom of screen
        width: PLAYER_CONFIG.WIDTH,
        height: PLAYER_CONFIG.HEIGHT,
        velocityX: 0,
        speed: PLAYER_CONFIG.SPEED,
        lives: PLAYER_CONFIG.STARTING_LIVES,
        alive: true,
        invincible: false,
        invincibilityTimer: 0,
        lastShotTime: 0
    };
}

/**
 * Update player state based on input and time
 * @param {Object} player - Player entity
 * @param {Object} input - Input state object with left, right properties
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 * @param {number} canvasWidth - Logical game width for boundary checking (from getGameDimensions)
 */
export function updatePlayer(player, input, deltaTime, canvasWidth) {
    if (!player || !player.alive) return;
    
    // Update invincibility timer
    if (player.invincible) {
        player.invincibilityTimer -= deltaTime * 1000; // Convert to milliseconds
        if (player.invincibilityTimer <= 0) {
            player.invincible = false;
            player.invincibilityTimer = 0;
        }
    }
    
    // Calculate velocity based on input
    player.velocityX = 0;
    
    if (input.left) {
        player.velocityX = -player.speed;
    }
    if (input.right) {
        player.velocityX = player.speed;
    }
    
    // Update position based on velocity
    player.x += player.velocityX * deltaTime;
    
    // Constrain player to canvas bounds with padding
    const minX = BOUNDS_PADDING + player.width / 2;
    const maxX = canvasWidth - BOUNDS_PADDING - player.width / 2;
    
    if (player.x < minX) {
        player.x = minX;
    }
    if (player.x > maxX) {
        player.x = maxX;
    }
}

/**
 * Check if the player can shoot based on cooldown and projectile limit
 * @param {Object} player - Player entity
 * @param {number} currentTime - Current time in milliseconds (from performance.now())
 * @param {Array} playerProjectiles - Array of player projectiles (for checking limit)
 * @returns {boolean} True if player can shoot
 */
export function canShoot(player, currentTime, playerProjectiles) {
    if (!player || !player.alive) return false;
    
    // Check cooldown timer
    const timeSinceLastShot = currentTime - player.lastShotTime;
    if (timeSinceLastShot < PLAYER_CONFIG.SHOOT_COOLDOWN) {
        return false;
    }
    
    // Check projectile limit (classic Space Invaders: only 1 shot on screen at a time)
    const activeProjectiles = playerProjectiles.filter(p => p.alive).length;
    if (activeProjectiles >= PLAYER_CONFIG.MAX_PROJECTILES) {
        return false;
    }
    
    return true;
}

/**
 * Mark that the player has shot (updates cooldown timer)
 * @param {Object} player - Player entity
 * @param {number} currentTime - Current time in milliseconds (from performance.now())
 */
export function shoot(player, currentTime) {
    if (!player || !player.alive) return;
    
    player.lastShotTime = currentTime;
}

/**
 * Handle player being hit by an enemy projectile
 * Decreases lives, activates invincibility, and respawns if lives remain
 * @param {Object} player - Player entity
 */
export function hitPlayer(player) {
    if (!player || !player.alive || player.invincible) return;
    
    // Lose a life
    player.lives--;
    
    console.log(`💔 Player hit! Lives remaining: ${player.lives}`);
    
    // Check if player is dead
    if (player.lives <= 0) {
        player.alive = false;
        console.log('💀 Player eliminated');
        return;
    }
    
    // Activate invincibility period
    player.invincible = true;
    player.invincibilityTimer = INVINCIBILITY_DURATION;
    
    // Respawn at center bottom
    const dimensions = getGameDimensions();
    player.x = dimensions.width / 2;
    player.y = dimensions.height - 80;
    player.velocityX = 0;
}

/**
 * Check if player is currently invincible
 * @param {Object} player - Player entity
 * @returns {boolean} True if player is invincible
 */
export function isInvincible(player) {
    return player && player.invincible;
}

/**
 * Check if player is alive
 * @param {Object} player - Player entity
 * @returns {boolean} True if player is alive
 */
export function isAlive(player) {
    return player && player.alive;
}

/**
 * Get player's current lives
 * @param {Object} player - Player entity
 * @returns {number} Number of lives remaining
 */
export function getLives(player) {
    return player ? player.lives : 0;
}

/**
 * Reset player for new game or level
 * Restores lives, position, state, and clears cooldowns
 * @param {Object} player - Player entity
 */
export function resetPlayer(player) {
    if (!player) return;
    
    const dimensions = getGameDimensions();
    
    // Reset position to center bottom
    player.x = dimensions.width / 2;
    player.y = dimensions.height - 80;
    player.velocityX = 0;
    
    // Reset lives and state
    player.lives = PLAYER_CONFIG.STARTING_LIVES;
    player.alive = true;
    player.invincible = false;
    player.invincibilityTimer = 0;
    player.lastShotTime = 0;
    
    console.log('💘 Cupid reset for new game');
}

/**
 * Reset player position for new level (preserves lives)
 * Used when advancing to next level to keep score/lives progress
 * @param {Object} player - Player entity
 */
export function resetPlayerPosition(player) {
    if (!player) return;
    
    const dimensions = getGameDimensions();
    
    // Reset position to center bottom
    player.x = dimensions.width / 2;
    player.y = dimensions.height - 80;
    player.velocityX = 0;
    
    // Clear temporary states but keep lives
    player.invincible = false;
    player.invincibilityTimer = 0;
    player.lastShotTime = 0;
    
    console.log('💘 Cupid repositioned for next level (Lives: ' + player.lives + ')');
}

/**
 * Get player bounds for collision detection
 * @param {Object} player - Player entity
 * @returns {Object|null} Bounding box with left, right, top, bottom
 */
export function getPlayerBounds(player) {
    if (!player) return null;
    
    const halfWidth = player.width / 2;
    const halfHeight = player.height / 2;
    
    return {
        left: player.x - halfWidth,
        right: player.x + halfWidth,
        top: player.y - halfHeight,
        bottom: player.y + halfHeight,
        centerX: player.x,
        centerY: player.y
    };
}

/**
 * Get shooting cooldown progress (for UI indicators)
 * @param {Object} player - Player entity
 * @param {number} currentTime - Current time in milliseconds
 * @returns {number} 0 (ready) to 1 (just shot)
 */
export function getShootCooldownRatio(player, currentTime) {
    if (!player) return 0;
    
    const timeSinceLastShot = currentTime - player.lastShotTime;
    if (timeSinceLastShot >= SHOOT_COOLDOWN) return 0;
    
    return 1 - (timeSinceLastShot / SHOOT_COOLDOWN);
}
