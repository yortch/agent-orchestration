/**
 * entities.js
 * Defines entity data structures and factory functions
 * Manages entity arrays for player, enemies, projectiles, shields, and particles
 */

import { getGameDimensions } from '../canvas/resize.js';
import { initPlayer } from './player.js';
import { initShields } from './shields.js';
import { ENEMY_CONFIG, ENEMY_ROW_TYPES, PROJECTILE_CONFIG } from './config.js';
import { getEnemyStartY } from './levels.js';

// Entity arrays - managed here for easy access across the game
const entities = {
    player: null,
    enemies: [],
    playerProjectiles: [],
    enemyProjectiles: [],
    shields: [],
    particles: [],
    bonus: null // Periodic bonus enemy (ring/chocolate/letter)
};

/**
 * Initialize all game entities
 */
export function initEntities() {
    // Clear all entity arrays
    entities.enemies = [];
    entities.playerProjectiles = [];
    entities.enemyProjectiles = [];
    entities.shields = [];
    entities.particles = [];
    entities.bonus = null;
    
    // Create player (Cupid on a cloud) using player.js
    entities.player = initPlayer();
    
    // Create enemy grid (hearts)
    createEnemyGrid();
    
    // Create shields (destructible heart-shaped barriers)
    entities.shields = initShields();
    
    console.log('🎯 Entities initialized');
}

/**
 * Create enemy grid (5 rows of 11 hearts)
 * Uses config values and level-based starting position
 */
function createEnemyGrid() {
    const dimensions = getGameDimensions();
    
    // Use config values for grid layout
    const rows = ENEMY_CONFIG.ROWS;
    const cols = ENEMY_CONFIG.COLS;
    const enemyWidth = ENEMY_CONFIG.WIDTH;
    const enemyHeight = ENEMY_CONFIG.HEIGHT;
    const spacingX = ENEMY_CONFIG.SPACING_X;
    const spacingY = ENEMY_CONFIG.SPACING_Y;
    
    // Starting position (centered grid, Y adjusted by level)
    const gridWidth = cols * spacingX;
    const startX = (dimensions.width - gridWidth) / 2 + spacingX / 2;
    const startY = getEnemyStartY();
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const enemyType = ENEMY_ROW_TYPES[row];
            
            const enemy = {
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                width: enemyWidth,
                height: enemyHeight,
                row: row,
                col: col,
                type: enemyType,
                points: ENEMY_CONFIG.POINTS[enemyType],
                alive: true,
                // Animation properties
                pulsePhase: Math.random() * Math.PI * 2 // Randomize pulse offset
            };
            
            entities.enemies.push(enemy);
        }
    }
    
    console.log(`💕 Created ${entities.enemies.length} hearts`);
}

// Note: Shield creation now handled by shields.js module

/**
 * Create a player projectile (love arrow)
 * @param {number} x - Starting x position
 * @param {number} y - Starting y position
 * @returns {Object} Projectile entity
 */
export function createPlayerProjectile(x, y) {
    const projectile = {
        x: x,
        y: y,
        width: PROJECTILE_CONFIG.PLAYER_WIDTH,
        height: PROJECTILE_CONFIG.PLAYER_HEIGHT,
        velocityY: -PROJECTILE_CONFIG.PLAYER_SPEED, // Moves upward (pixels per second)
        alive: true
    };
    
    entities.playerProjectiles.push(projectile);
    return projectile;
}

/**
 * Create an enemy projectile (kiss/drop)
 * @param {number} x - Starting x position
 * @param {number} y - Starting y position
 * @returns {Object} Projectile entity
 */
export function createEnemyProjectile(x, y) {
    const projectile = {
        x: x,
        y: y,
        width: PROJECTILE_CONFIG.ENEMY_WIDTH,
        height: PROJECTILE_CONFIG.ENEMY_HEIGHT,
        velocityY: PROJECTILE_CONFIG.ENEMY_SPEED, // Moves downward (pixels per second)
        alive: true
    };
    
    entities.enemyProjectiles.push(projectile);
    return projectile;
}

/**
 * Create a particle effect
 * @param {number} x - Starting x position
 * @param {number} y - Starting y position
 * @param {string} type - Particle type ('heart', 'sparkle', etc.)
 * @returns {Object} Particle entity
 */
export function createParticle(x, y, type = 'heart') {
    const particle = {
        x: x,
        y: y,
        width: 8,
        height: 8,
        velocityX: (Math.random() - 0.5) * 100, // Random horizontal velocity
        velocityY: (Math.random() - 0.5) * 100 - 50, // Mostly upward
        type: type,
        lifetime: 1.0, // seconds
        age: 0,
        alive: true
    };
    
    entities.particles.push(particle);
    return particle;
}

/**
 * Get all entities
 * @returns {Object} All entity arrays
 */
export function getEntities() {
    return entities;
}

/**
 * Get player entity
 * @returns {Object} Player entity
 */
export function getPlayer() {
    return entities.player;
}

/**
 * Remove dead entities from all arrays
 */
export function cleanupDeadEntities() {
    entities.enemies = entities.enemies.filter(e => e.alive);
    entities.playerProjectiles = entities.playerProjectiles.filter(p => p.alive);
    entities.enemyProjectiles = entities.enemyProjectiles.filter(p => p.alive);
    entities.shields = entities.shields.filter(s => s.alive);
    entities.particles = entities.particles.filter(p => p.alive);
}

/**
 * Reset entities for a new level (preserves player lives and score)
 * Clears projectiles, recreates enemies with increased difficulty, resets shields
 */
export function resetEntitiesForLevel() {
    // Clear all projectiles and particles
    entities.playerProjectiles = [];
    entities.enemyProjectiles = [];
    entities.bonus = null;
    entities.particles = [];
    
    // Recreate enemies with current level difficulty
    entities.enemies = [];
    createEnemyGrid();
    
    // Reset shields to full health (classic Space Invaders behavior)
    entities.shields = initShields();
    
    console.log('🔄 Entities reset for new level');
}
