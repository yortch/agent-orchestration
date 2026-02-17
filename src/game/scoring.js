/**
 * scoring.js
 * Manages game score, high score persistence, and point calculations
 */

import { SCORING_CONFIG, ENEMY_CONFIG } from './config.js';

// Current game score
let currentScore = 0;

// High score (loaded from localStorage)
let highScore = 0;

/**
 * Initialize scoring system
 * Loads high score from localStorage
 */
export function initScoring() {
    currentScore = 0;
    loadHighScore();
    console.log(`🏆 High Score: ${highScore}`);
}

/**
 * Get the current score
 * @returns {number} Current score
 */
export function getScore() {
    return currentScore;
}

/**
 * Get the high score
 * @returns {number} High score
 */
export function getHighScore() {
    return highScore;
}

/**
 * Reset score to zero (for new game)
 */
export function resetScore() {
    currentScore = 0;
    console.log('🎯 Score reset');
}

/**
 * Add points to current score
 * @param {number} points - Points to add
 * @returns {number} New total score
 */
export function addScore(points) {
    currentScore += points;
    
    // Check if we beat the high score
    if (currentScore > highScore) {
        highScore = currentScore;
        saveHighScore();
        console.log(`🎉 NEW HIGH SCORE: ${highScore}!`);
    }
    
    return currentScore;
}

/**
 * Get points for destroying an enemy of a given type
 * @param {string} enemyType - Enemy type ('red', 'pink', 'purple')
 * @returns {number} Points awarded
 */
export function getEnemyPoints(enemyType) {
    return ENEMY_CONFIG.POINTS[enemyType] || 0;
}

/**
 * Add points for destroying an enemy
 * @param {string} enemyType - Enemy type ('red', 'pink', 'purple')
 * @returns {number} Points awarded
 */
export function addEnemyKillScore(enemyType) {
    const points = getEnemyPoints(enemyType);
    addScore(points);
    console.log(`💕 +${points} points (${enemyType} heart destroyed)`);
    return points;
}

/**
 * Add bonus points (for OFO/UFO or special achievements)
 * @param {number} bonus - Bonus points to award
 * @returns {number} New total score
 */
export function addBonus(bonus) {
    addScore(bonus);
    console.log(`✨ BONUS: +${bonus} points!`);
    return currentScore;
}

/**
 * Get a random bonus value for OFO/UFO
 * @returns {number} Random bonus between BONUS_MIN and BONUS_MAX
 */
export function getRandomBonus() {
    const min = SCORING_CONFIG.BONUS_MIN;
    const max = SCORING_CONFIG.BONUS_MAX;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Load high score from localStorage
 */
function loadHighScore() {
    try {
        const stored = localStorage.getItem(SCORING_CONFIG.HIGH_SCORE_KEY);
        if (stored !== null) {
            highScore = parseInt(stored, 10);
            if (isNaN(highScore)) {
                highScore = 0;
            }
        }
    } catch (err) {
        console.warn('⚠️ Could not load high score from localStorage:', err);
        highScore = 0;
    }
}

/**
 * Save high score to localStorage
 */
function saveHighScore() {
    try {
        localStorage.setItem(SCORING_CONFIG.HIGH_SCORE_KEY, highScore.toString());
    } catch (err) {
        console.warn('⚠️ Could not save high score to localStorage:', err);
    }
}

/**
 * Clear high score (for debugging/testing)
 */
export function clearHighScore() {
    highScore = 0;
    try {
        localStorage.removeItem(SCORING_CONFIG.HIGH_SCORE_KEY);
        console.log('🗑️ High score cleared');
    } catch (err) {
        console.warn('⚠️ Could not clear high score:', err);
    }
}

/**
 * Format score with leading zeros (classic arcade style)
 * @param {number} score - Score to format
 * @param {number} digits - Minimum number of digits (default: 6)
 * @returns {string} Formatted score string
 */
export function formatScore(score, digits = 6) {
    return score.toString().padStart(digits, '0');
}
