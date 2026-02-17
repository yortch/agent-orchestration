/**
 * enemies.js
 * Enemy formation management with classic Space Invaders movement
 * Handles formation initialization, synchronized movement, speed scaling
 */

import { ENEMY_CONFIG } from './config.js';
import { playSfxEnemyStep } from '../audio/audio.js';
import { getEnemySpeedMultiplier } from './levels.js';

// Formation state
const formation = {
    direction: 1,           // 1 = right, -1 = left
    speed: ENEMY_CONFIG.BASE_SPEED, // Current speed (pixels/second)
    baseSpeed: ENEMY_CONFIG.BASE_SPEED, // Base movement speed
    dropDistance: ENEMY_CONFIG.DROP_DISTANCE, // How far to drop when reversing
    edgeMargin: 20,         // Distance from edge before reversing
    initialEnemyCount: 55,  // Total enemies at start (5 rows × 11 cols)
    
    // Shooting config
    shootTimer: 0,
    shootInterval: 1.5,     // Time between enemy shots (seconds)
    shootChance: 0.3        // Probability of shooting each interval
};

/**
 * Initialize the enemy formation
 * Sets up movement parameters for the enemy grid
 * @param {Array} enemies - Array of enemy entities
 * @param {number} canvasWidth - Logical game width (from getGameDimensions)
 */
export function initEnemies(enemies, canvasWidth) {
    // Reset formation state
    formation.direction = 1;
    formation.speed = formation.baseSpeed;
    formation.initialEnemyCount = enemies.filter(e => e.alive).length;
    formation.shootTimer = 0;
    
    console.log(`💕 Formation initialized: ${formation.initialEnemyCount} hearts`);
}

/**
 * Update the enemy formation with classic Space Invaders movement
 * All enemies move together horizontally; formation reverses and drops at edges
 * Speed increases as enemies are destroyed
 * @param {Array} enemies - Array of enemy entities
 * @param {number} deltaTime - Time elapsed since last frame (seconds)
 * @param {number} canvasWidth - Logical game width (from getGameDimensions)
 */
export function updateEnemies(enemies, deltaTime, canvasWidth) {
    // Filter to alive enemies only
    const aliveEnemies = enemies.filter(e => e.alive);
    
    if (aliveEnemies.length === 0) return;
    
    // Get level-based speed multiplier
    const levelSpeedMultiplier = getEnemySpeedMultiplier();
    
    // Calculate enemy count-based speed scaling (heartbeat acceleration)
    const survivalRatio = aliveEnemies.length / formation.initialEnemyCount;
    let countSpeedMultiplier = 1.0;
    
    if (survivalRatio <= ENEMY_CONFIG.SPEED_SCALE_THRESHOLD) {
        // Few enemies left - maximum speed
        countSpeedMultiplier = ENEMY_CONFIG.SPEED_SCALE_MAX;
    } else {
        // Interpolate between min and max based on survival ratio
        const t = (1 - survivalRatio) / (1 - ENEMY_CONFIG.SPEED_SCALE_THRESHOLD);
        countSpeedMultiplier = ENEMY_CONFIG.SPEED_SCALE_MIN + 
            t * (ENEMY_CONFIG.SPEED_SCALE_MAX - ENEMY_CONFIG.SPEED_SCALE_MIN);
    }
    
    // Combine level and count multipliers
    const currentSpeed = formation.baseSpeed * levelSpeedMultiplier * countSpeedMultiplier;
    
    // Calculate horizontal movement
    const moveDistance = currentSpeed * deltaTime * formation.direction;
    
    // Get formation bounds before moving
    const bounds = getFormationBounds(aliveEnemies);
    
    // Check if formation will hit edge after this move
    const willHitLeftEdge = bounds.left + moveDistance <= formation.edgeMargin;
    const willHitRightEdge = bounds.right + moveDistance >= canvasWidth - formation.edgeMargin;
    
    if (willHitLeftEdge || willHitRightEdge) {
        // Reverse direction and drop down
        formation.direction *= -1;
        
        // Move all enemies down
        aliveEnemies.forEach(enemy => {
            enemy.y += formation.dropDistance;
        });
        
        // Play heartbeat "thrum" on enemy step/drop
        playSfxEnemyStep();
        
        // Don't move horizontally this frame (just drop)
        return;
    }
    
    // Move all enemies horizontally
    aliveEnemies.forEach(enemy => {
        enemy.x += moveDistance;
    });
}

/**
 * Update enemy animations (pulse effect)
 * @param {Array} enemies - Array of enemy entities
 * @param {number} deltaTime - Time elapsed since last frame (seconds)
 */
export function updateEnemyAnimations(enemies, deltaTime) {
    const aliveEnemies = enemies.filter(e => e.alive);
    const pulseSpeed = ENEMY_CONFIG.PULSE_SPEED; // Radians per second
    
    aliveEnemies.forEach(enemy => {
        // Update pulse phase for pulsing heart animation
        enemy.pulsePhase += pulseSpeed * deltaTime;
        
        // Keep phase in 0-2π range to prevent overflow
        if (enemy.pulsePhase > Math.PI * 2) {
            enemy.pulsePhase -= Math.PI * 2;
        }
    });
}

/**
 * Get the bounds of the enemy formation
 * Returns the leftmost and rightmost positions of alive enemies
 * @param {Array} enemies - Array of enemy entities
 * @returns {Object} Object with left, right, top, bottom bounds
 */
export function getFormationBounds(enemies) {
    const aliveEnemies = enemies.filter(e => e.alive);
    
    if (aliveEnemies.length === 0) {
        return { left: 0, right: 0, top: 0, bottom: 0 };
    }
    
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    
    aliveEnemies.forEach(enemy => {
        // Account for enemy width when calculating bounds
        const enemyLeft = enemy.x - enemy.width / 2;
        const enemyRight = enemy.x + enemy.width / 2;
        const enemyTop = enemy.y - enemy.height / 2;
        const enemyBottom = enemy.y + enemy.height / 2;
        
        if (enemyLeft < left) left = enemyLeft;
        if (enemyRight > right) right = enemyRight;
        if (enemyTop < top) top = enemyTop;
        if (enemyBottom > bottom) bottom = enemyBottom;
    });
    
    return { left, right, top, bottom };
}

/**
 * Get the bottom-most enemy in each column (for shooting logic)
 * @param {Array} enemies - Array of enemy entities
 * @returns {Array} Array of bottom-most enemies per column
 */
export function getBottomEnemiesPerColumn(enemies) {
    const aliveEnemies = enemies.filter(e => e.alive);
    
    if (aliveEnemies.length === 0) return [];
    
    // Group enemies by column
    const columnMap = new Map();
    
    aliveEnemies.forEach(enemy => {
        if (!columnMap.has(enemy.col) || enemy.y > columnMap.get(enemy.col).y) {
            columnMap.set(enemy.col, enemy);
        }
    });
    
    return Array.from(columnMap.values());
}

/**
 * Get formation direction (for advanced AI or visual effects)
 * @returns {number} 1 for right, -1 for left
 */
export function getFormationDirection() {
    return formation.direction;
}

/**
 * Get current formation speed (for debugging/UI)
 * @returns {number} Current speed in pixels/second
 */
export function getFormationSpeed() {
    return formation.speed;
}

/**
 * Check if the formation has reached the bottom of the screen
 * @param {Array} enemies - Array of enemy entities
 * @param {number} canvasHeight - Height of the canvas
 * @returns {boolean} True if formation reached bottom (game over condition)
 */
export function hasFormationReachedBottom(enemies, canvasHeight) {
    const aliveEnemies = enemies.filter(e => e.alive);
    
    if (aliveEnemies.length === 0) {
        return false;
    }
    
    const bounds = getFormationBounds(aliveEnemies);
    const playerZone = canvasHeight - 100; // Area where player exists
    
    return bounds.bottom >= playerZone;
}

/**
 * Check if all enemies are destroyed
 * @param {Array} enemies - Array of enemy entities
 * @returns {boolean} True if no enemies remain
 */
export function areAllEnemiesDestroyed(enemies) {
    const aliveEnemies = enemies.filter(e => e.alive);
    return aliveEnemies.length === 0;
}

/**
 * Get the count of alive enemies
 * @param {Array} enemies - Array of enemy entities
 * @returns {number} Number of alive enemies
 */
export function getAliveEnemyCount(enemies) {
    return enemies.filter(e => e.alive).length;
}
