/**
 * projectiles.js
 * Projectile movement and bounds checking
 * Handles both player projectiles (kisses/arrows going up) and enemy projectiles (broken hearts going down)
 * Note: Collision detection is now handled by collisions.js
 */

import { getGameDimensions } from '../canvas/resize.js';

/**
 * Update all player projectiles
 * Moves projectiles upward and removes those that go off-screen
 * @param {Array} playerProjectiles - Array of player projectile entities
 * @param {number} deltaTime - Time elapsed since last frame (seconds)
 */
export function updatePlayerProjectiles(playerProjectiles, deltaTime) {
    const dimensions = getGameDimensions();
    
    // Update each projectile position
    playerProjectiles.forEach(projectile => {
        if (!projectile.alive) return;
        
        // Move projectile (velocityY is negative for upward movement)
        projectile.y += projectile.velocityY * deltaTime;
        
        // Remove projectile if it goes off the top of the screen
        const projectileTop = projectile.y - projectile.height / 2;
        if (projectileTop < 0) {
            projectile.alive = false;
        }
    });
}

/**
 * Update all enemy projectiles
 * Moves projectiles downward and removes those that go off-screen
 * @param {Array} enemyProjectiles - Array of enemy projectile entities
 * @param {number} deltaTime - Time elapsed since last frame (seconds)
 */
export function updateEnemyProjectiles(enemyProjectiles, deltaTime) {
    const dimensions = getGameDimensions();
    
    // Update each projectile position
    enemyProjectiles.forEach(projectile => {
        if (!projectile.alive) return;
        
        // Move projectile (velocityY is positive for downward movement)
        projectile.y += projectile.velocityY * deltaTime;
        
        // Remove projectile if it goes off the bottom of the screen
        const projectileBottom = projectile.y + projectile.height / 2;
        if (projectileBottom > dimensions.height) {
            projectile.alive = false;
        }
    });
}

/**
 * Get statistics about active projectiles (for debugging/UI)
 * @param {Array} playerProjectiles - Player projectiles
 * @param {Array} enemyProjectiles - Enemy projectiles
 * @returns {Object} Stats with player and enemy projectile counts
 */
export function getProjectileStats(playerProjectiles, enemyProjectiles) {
    const playerCount = playerProjectiles.filter(p => p.alive).length;
    const enemyCount = enemyProjectiles.filter(p => p.alive).length;
    
    return {
        playerProjectileCount: playerCount,
        enemyProjectileCount: enemyCount,
        totalProjectiles: playerCount + enemyCount
    };
}
