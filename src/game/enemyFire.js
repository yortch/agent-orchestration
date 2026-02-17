/**
 * enemyFire.js
 * Enemy firing AI with difficulty scaling and fair gameplay limits
 * Implements classic "random shots from bottom-most enemies per column" with constraints
 */

import { createEnemyProjectile } from './entities.js';
import { getBottomEnemiesPerColumn } from './enemies.js';
import { getEnemyFireRate } from './levels.js';
import { ENEMY_CONFIG } from './config.js';
import { playSfxEnemyShoot } from '../audio/audio.js';

// Firing state
const fireState = {
    timeSinceLastShot: 0,  // Time elapsed since last enemy shot (seconds)
    shotCooldown: ENEMY_CONFIG.MIN_SHOT_INTERVAL // Minimum time between shots
};

/**
 * Initialize the enemy firing system
 */
export function initEnemyFire() {
    fireState.timeSinceLastShot = 0;
    console.log('🎯 Enemy firing system initialized');
}

/**
 * Reset firing cooldown timer
 */
export function resetEnemyFire() {
    fireState.timeSinceLastShot = 0;
}

/**
 * Update enemy firing behavior
 * Selects random bottom-most enemies to fire, with level-based difficulty scaling
 * and limits to keep gameplay fair
 * 
 * @param {Array} enemies - Array of enemy entities
 * @param {Array} enemyProjectiles - Array of existing enemy projectiles
 * @param {number} deltaTime - Time elapsed since last frame (seconds)
 */
export function updateEnemyFire(enemies, enemyProjectiles, deltaTime) {
    // Filter to alive enemies only
    const aliveEnemies = enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) return;
    
    // Update cooldown timer
    fireState.timeSinceLastShot += deltaTime;
    
    // Check if we're still in cooldown period
    if (fireState.timeSinceLastShot < fireState.shotCooldown) {
        return; // Too soon to fire again
    }
    
    // Count active enemy projectiles
    const activeProjectiles = enemyProjectiles.filter(p => p.alive).length;
    
    // Check if we've reached max projectile limit
    if (activeProjectiles >= ENEMY_CONFIG.MAX_PROJECTILES) {
        return; // Too many projectiles on screen
    }
    
    // Get level-based fire rate (probability per frame)
    const fireRate = getEnemyFireRate();
    
    // Get bottom-most enemies per column (only they can shoot)
    const shooters = getBottomEnemiesPerColumn(aliveEnemies);
    
    if (shooters.length === 0) return;
    
    // Calculate adjusted fire rate based on number of potential shooters
    // More shooters = higher overall chance something fires this frame
    const adjustedFireRate = fireRate * shooters.length;
    
    // Check if any enemy should fire this frame
    if (Math.random() < adjustedFireRate) {
        // Select a random bottom enemy to fire
        const randomShooter = shooters[Math.floor(Math.random() * shooters.length)];
        
        // Create projectile from enemy position (center-bottom of enemy)
        const projectileX = randomShooter.x;
        const projectileY = randomShooter.y + randomShooter.height / 2;
        
        createEnemyProjectile(projectileX, projectileY);
        
        // Play enemy shoot sound
        playSfxEnemyShoot();
        
        // Reset cooldown timer
        fireState.timeSinceLastShot = 0;
        
        console.log(`💔 Enemy fired from column ${randomShooter.col}`);
    }
}

/**
 * Get firing statistics for debugging/display
 * @returns {Object} Object with firing stats
 */
export function getFireStats() {
    return {
        timeSinceLastShot: fireState.timeSinceLastShot,
        cooldown: fireState.shotCooldown,
        maxProjectiles: ENEMY_CONFIG.MAX_PROJECTILES
    };
}
