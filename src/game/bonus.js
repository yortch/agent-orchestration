/**
 * bonus.js
 * Manages the periodic bonus enemy that moves horizontally across the top
 * Valentine-themed (engagement ring, chocolate box, or love letter)
 * Awards 100-300 points when hit
 */

import { getGameDimensions } from '../canvas/resize.js';

// Bonus configuration
const BONUS_CONFIG = {
    // Spawn timing
    MIN_SPAWN_INTERVAL: 20, // seconds
    MAX_SPAWN_INTERVAL: 30, // seconds
    
    // Movement
    SPEED: 100, // pixels per second
    Y_POSITION: 40, // Y position from top of screen
    
    // Size
    WIDTH: 40,
    HEIGHT: 40,
    
    // Scoring
    MIN_POINTS: 100,
    MAX_POINTS: 300,
    POINTS_STEP: 50, // Points awarded in increments of 50 (100, 150, 200, 250, 300)
    
    // Type variants (for visual variety)
    TYPES: ['ring', 'chocolate', 'letter']
};

// Bonus state
let spawnTimer = 0;
let nextSpawnTime = getRandomSpawnInterval();
let bonusScoreDisplay = null; // Stores {x, y, score, timer} for displaying bonus score

/**
 * Get random spawn interval between min and max
 * @returns {number} Spawn interval in seconds
 */
function getRandomSpawnInterval() {
    return BONUS_CONFIG.MIN_SPAWN_INTERVAL + 
           Math.random() * (BONUS_CONFIG.MAX_SPAWN_INTERVAL - BONUS_CONFIG.MIN_SPAWN_INTERVAL);
}

/**
 * Get random point value for bonus enemy
 * @returns {number} Points (100-300 in steps of 50)
 */
function getRandomBonusPoints() {
    const steps = (BONUS_CONFIG.MAX_POINTS - BONUS_CONFIG.MIN_POINTS) / BONUS_CONFIG.POINTS_STEP;
    const randomStep = Math.floor(Math.random() * (steps + 1));
    return BONUS_CONFIG.MIN_POINTS + (randomStep * BONUS_CONFIG.POINTS_STEP);
}

/**
 * Get random bonus type
 * @returns {string} One of: 'ring', 'chocolate', 'letter'
 */
function getRandomBonusType() {
    return BONUS_CONFIG.TYPES[Math.floor(Math.random() * BONUS_CONFIG.TYPES.length)];
}

/**
 * Create a new bonus enemy
 * @returns {Object} Bonus entity
 */
function createBonusEnemy() {
    const dimensions = getGameDimensions();
    const direction = Math.random() < 0.5 ? 1 : -1; // Random direction
    
    const bonus = {
        x: direction > 0 ? -BONUS_CONFIG.WIDTH : dimensions.width + BONUS_CONFIG.WIDTH,
        y: BONUS_CONFIG.Y_POSITION,
        width: BONUS_CONFIG.WIDTH,
        height: BONUS_CONFIG.HEIGHT,
        velocityX: BONUS_CONFIG.SPEED * direction,
        type: getRandomBonusType(),
        points: getRandomBonusPoints(),
        alive: true
    };
    
    console.log(`✨ Bonus spawned: ${bonus.type} worth ${bonus.points} points`);
    return bonus;
}

/**
 * Initialize bonus system
 * Resets spawn timer and clears any active bonus
 */
export function initBonus() {
    spawnTimer = 0;
    nextSpawnTime = getRandomSpawnInterval();
    bonusScoreDisplay = null;
    console.log(`🎁 Bonus system initialized (next spawn in ${nextSpawnTime.toFixed(1)}s)`);
}

/**
 * Reset bonus system (for new game or level)
 */
export function resetBonus() {
    spawnTimer = 0;
    nextSpawnTime = getRandomSpawnInterval();
    bonusScoreDisplay = null;
}

/**
 * Update bonus enemy and spawn timer
 * @param {Object|null} bonus - Current bonus entity (or null)
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 * @returns {Object|null} Updated bonus entity (or null if despawned/not spawned)
 */
export function updateBonus(bonus, deltaTime) {
    const dimensions = getGameDimensions();
    
    // Update existing bonus
    if (bonus && bonus.alive) {
        // Move horizontally
        bonus.x += bonus.velocityX * deltaTime;
        
        // Check if bonus has moved off screen
        if (bonus.velocityX > 0 && bonus.x > dimensions.width + BONUS_CONFIG.WIDTH) {
            console.log('✨ Bonus despawned (off screen right)');
            return null; // Despawn
        } else if (bonus.velocityX < 0 && bonus.x < -BONUS_CONFIG.WIDTH) {
            console.log('✨ Bonus despawned (off screen left)');
            return null; // Despawn
        }
        
        return bonus; // Continue existing bonus
    }
    
    // Update spawn timer if no active bonus
    if (!bonus) {
        spawnTimer += deltaTime;
        
        if (spawnTimer >= nextSpawnTime) {
            // Spawn new bonus
            spawnTimer = 0;
            nextSpawnTime = getRandomSpawnInterval();
            return createBonusEnemy();
        }
    }
    
    return null; // No bonus active
}

/**
 * Update bonus score display (shows score briefly when bonus is hit)
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateBonusScoreDisplay(deltaTime) {
    if (bonusScoreDisplay) {
        bonusScoreDisplay.timer -= deltaTime;
        
        if (bonusScoreDisplay.timer <= 0) {
            bonusScoreDisplay = null;
        }
    }
}

/**
 * Award points for hitting bonus enemy
 * @param {Object} bonus - Bonus entity that was hit
 */
export function awardBonusPoints(bonus) {
    if (!bonus) return;
    
    // Store score display info
    bonusScoreDisplay = {
        x: bonus.x,
        y: bonus.y,
        score: bonus.points,
        timer: 2.0 // Display for 2 seconds
    };
    
    console.log(`💰 Bonus hit! Awarded ${bonus.points} points`);
}

/**
 * Get current bonus score display (for rendering)
 * @returns {Object|null} Score display info or null
 */
export function getBonusScoreDisplay() {
    return bonusScoreDisplay;
}

/**
 * Get bonus configuration (for external systems)
 * @returns {Object} Bonus config
 */
export function getBonusConfig() {
    return BONUS_CONFIG;
}
