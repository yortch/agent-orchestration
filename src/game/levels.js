/**
 * levels.js
 * Level progression, difficulty scaling, and level management
 */

import { LEVEL_CONFIG, ENEMY_CONFIG } from './config.js';

// Current level
let currentLevel = LEVEL_CONFIG.STARTING_LEVEL;

/**
 * Initialize level system
 */
export function initLevels() {
    currentLevel = LEVEL_CONFIG.STARTING_LEVEL;
    console.log(`📊 Starting at level ${currentLevel}`);
}

/**
 * Get the current level number
 * @returns {number} Current level
 */
export function getLevel() {
    return currentLevel;
}

/**
 * Reset to starting level (for new game)
 */
export function resetLevel() {
    currentLevel = LEVEL_CONFIG.STARTING_LEVEL;
    console.log(`🔄 Level reset to ${currentLevel}`);
}

/**
 * Advance to the next level
 * @returns {number} New level number
 */
export function nextLevel() {
    currentLevel++;
    console.log(`⬆️ Advanced to level ${currentLevel}`);
    return currentLevel;
}

/**
 * Get enemy speed multiplier for current level
 * Speed increases by LEVEL_CONFIG.SPEED_INCREASE (15%) per level
 * @returns {number} Speed multiplier (1.0 = base speed, 1.15 = level 2, etc.)
 */
export function getEnemySpeedMultiplier() {
    // Level 1 = 1.0x, Level 2 = 1.15x, Level 3 = 1.32x, etc.
    return Math.pow(1 + LEVEL_CONFIG.SPEED_INCREASE, currentLevel - 1);
}

/**
 * Get enemy fire rate for current level
 * Fire rate increases additively by LEVEL_CONFIG.FIRE_RATE_INCREASE per level
 * @returns {number} Fire rate probability per frame
 */
export function getEnemyFireRate() {
    const baseRate = ENEMY_CONFIG.BASE_FIRE_RATE;
    const increase = LEVEL_CONFIG.FIRE_RATE_INCREASE * (currentLevel - 1);
    return baseRate + increase;
}

/**
 * Get starting Y position for enemy grid (can drop per level for difficulty)
 * @returns {number} Y position for enemy grid
 */
export function getEnemyStartY() {
    const baseY = ENEMY_CONFIG.START_Y;
    const dropPerLevel = LEVEL_CONFIG.START_Y_DROP_PER_LEVEL;
    return baseY + dropPerLevel * (currentLevel - 1);
}

/**
 * Get difficulty descriptor for current level
 * @returns {string} Difficulty descriptor
 */
export function getDifficultyName() {
    if (currentLevel === 1) return 'First Date';
    if (currentLevel === 2) return 'Getting Serious';
    if (currentLevel === 3) return 'Love Struck';
    if (currentLevel === 4) return 'Head Over Heels';
    if (currentLevel === 5) return 'Soulmates';
    if (currentLevel >= 6 && currentLevel <= 9) return 'Eternal Love';
    if (currentLevel >= 10) return 'Legendary Romance';
    return 'Unknown';
}

/**
 * Calculate difficulty stats for display/debugging
 * @returns {Object} Object with difficulty stats
 */
export function getDifficultyStats() {
    return {
        level: currentLevel,
        difficultyName: getDifficultyName(),
        speedMultiplier: getEnemySpeedMultiplier(),
        fireRate: getEnemyFireRate(),
        startY: getEnemyStartY()
    };
}

/**
 * Get level clear bonus score (optional feature)
 * @returns {number} Bonus points for completing level
 */
export function getLevelClearBonus() {
    // Award bonus based on level difficulty
    return currentLevel * 100;
}
