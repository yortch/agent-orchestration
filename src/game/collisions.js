/**
 * collisions.js
 * AABB collision detection and resolution for all game entities
 * Handles player/enemy projectiles vs enemies/shields/player
 * Manages damage, scoring, particles, and game over conditions
 */

import { COLLISION_CONFIG, GAME_CONFIG, DEBUG } from './config.js';
import { addEnemyKillScore, addScore } from './scoring.js';
import { setState } from './state.js';
import { getGameDimensions } from '../canvas/resize.js';
import { spawnEnemyHitParticles, spawnShieldHitParticles, spawnPlayerHitParticles, spawnScorePopup } from './particles.js';
import { awardBonusPoints } from './bonus.js';
import { playSfxEnemyHit, playSfxPlayerHit, playSfxBonusHit, playSfxShieldHit } from '../audio/audio.js';

/**
 * AABB (Axis-Aligned Bounding Box) collision detection
 * @param {Object} entityA - First entity with x, y, width, height
 * @param {Object} entityB - Second entity with x, y, width, height
 * @param {number} scaleA - Hitbox scale multiplier for A (default 1.0)
 * @param {number} scaleB - Hitbox scale multiplier for B (default 1.0)
 * @returns {boolean} True if entities are colliding
 */
export function checkAABB(entityA, entityB, scaleA = 1.0, scaleB = 1.0) {
    if (!entityA || !entityB) return false;
    
    // Apply hitbox scaling (for more forgiving collision)
    const aWidth = entityA.width * scaleA;
    const aHeight = entityA.height * scaleA;
    const bWidth = entityB.width * scaleB;
    const bHeight = entityB.height * scaleB;
    
    // Calculate bounds (entities use center-based positioning)
    const aLeft = entityA.x - aWidth / 2;
    const aRight = entityA.x + aWidth / 2;
    const aTop = entityA.y - aHeight / 2;
    const aBottom = entityA.y + aHeight / 2;
    
    const bLeft = entityB.x - bWidth / 2;
    const bRight = entityB.x + bWidth / 2;
    const bTop = entityB.y - bHeight / 2;
    const bBottom = entityB.y + bHeight / 2;
    
    // Check for overlap
    const collision = !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom);
    
    if (collision && DEBUG.LOG_COLLISIONS) {
        console.log('💥 Collision detected', { entityA, entityB });
    }
    
    return collision;
}

/**
 * Check collision between projectile and shield blocks
 * Returns true if projectile hits any block in the shield
 * @param {Object} projectile - Projectile entity
 * @param {Object} shield - Shield entity with blocks array
 * @returns {Object|null} Hit info with block coordinates, or null if no hit
 */
function checkProjectileShieldCollision(projectile, shield) {
    if (!projectile || !shield || !shield.alive) return null;
    if (!projectile.alive) return null;
    if (!shield.blocks) return null;
    
    const BLOCK_SIZE = 3; // From shields.js
    
    // Calculate projectile bounds
    const pLeft = projectile.x - projectile.width / 2;
    const pRight = projectile.x + projectile.width / 2;
    const pTop = projectile.y - projectile.height / 2;
    const pBottom = projectile.y + projectile.height / 2;
    
    // Check each block in the shield
    for (let row = 0; row < shield.blocks.length; row++) {
        for (let col = 0; col < shield.blocks[row].length; col++) {
            const block = shield.blocks[row][col];
            
            // Skip blocks that don't exist or are destroyed
            if (!block.exists || block.health <= 0) continue;
            
            // Calculate block bounds
            const blockX = shield.x + col * BLOCK_SIZE;
            const blockY = shield.y + row * BLOCK_SIZE;
            const blockLeft = blockX;
            const blockRight = blockX + BLOCK_SIZE;
            const blockTop = blockY;
            const blockBottom = blockY + BLOCK_SIZE;
            
            // Check AABB collision
            if (!(pRight < blockLeft || pLeft > blockRight || pBottom < blockTop || pTop > blockBottom)) {
                // Hit detected
                return { row, col, blockX, blockY };
            }
        }
    }
    
    return null;
}

/**
 * Damage a shield block and surrounding blocks
 * @param {Object} shield - Shield entity
 * @param {number} hitRow - Row of the hit block
 * @param {number} hitCol - Column of the hit block
 */
function damageShield(shield, hitRow, hitCol) {
    if (!shield || !shield.blocks) return;
    
    // Damage the directly hit block
    const block = shield.blocks[hitRow][hitCol];
    if (block && block.exists) {
        block.health--;
        if (block.health <= 0) {
            block.exists = false;
            block.health = 0;
        }
    }
    
    // Play shield hit sound
    playSfxShieldHit();
    
    // Check if shield should be marked dead (no blocks remain)
    updateShieldAliveStatus(shield);
}

/**
 * Update shield alive status based on remaining blocks
 * @param {Object} shield - Shield entity
 */
function updateShieldAliveStatus(shield) {
    if (!shield || !shield.blocks) {
        shield.alive = false;
        return;
    }
    
    // Check if any blocks still exist
    let hasBlocks = false;
    for (let row = 0; row < shield.blocks.length; row++) {
        for (let col = 0; col < shield.blocks[row].length; col++) {
            if (shield.blocks[row][col].exists && shield.blocks[row][col].health > 0) {
                hasBlocks = true;
                break;
            }
        }
        if (hasBlocks) break;
    }
    
    if (!hasBlocks) {
        shield.alive = false;
        if (DEBUG.LOG_COLLISIONS) {
            console.log('💔 Shield destroyed');
        }
    }
}

/**
 * Handle player being hit by enemy projectile
 * @param {Object} player - Player entity
 * @param {Object} projectile - Enemy projectile that hit player
 */
function handlePlayerHit(player, projectile) {
    if (!player || !player.alive || player.invincible) return;
    
    // Mark projectile as dead
    projectile.alive = false;
    
    // Lose a life
    player.lives--;
    
    // Play player hit sound
    playSfxPlayerHit();
    
    console.log(`💔 Player hit! Lives remaining: ${player.lives}`);
    
    // Create particle effect at hit location
    spawnPlayerHitParticles(player.x, player.y);
    
    // Check if player is dead
    if (player.lives <= 0) {
        player.alive = false;
        console.log('💀 Player eliminated - GAME OVER');
        setState('gameover', 'lives'); // Pass reason
        return;
    }
    
    // Activate invincibility period
    const INVINCIBILITY_DURATION = 2000; // milliseconds
    player.invincible = true;
    player.invincibilityTimer = INVINCIBILITY_DURATION;
    
    // Respawn at center bottom
    const dimensions = getGameDimensions();
    player.x = dimensions.width / 2;
    player.y = dimensions.height - 80;
    player.velocityX = 0;
}

/**
 * Handle enemy being hit by player projectile
 * @param {Object} enemy - Enemy entity
 * @param {Object} projectile - Player projectile that hit enemy
 */
function handleEnemyHit(enemy, projectile) {
    if (!enemy || !enemy.alive) return;
    if (!projectile || !projectile.alive) return;
    
    // Mark both as dead
    enemy.alive = false;
    projectile.alive = false;
    
    // Award points based on enemy type
    const points = addEnemyKillScore(enemy.type);
    
    // Play enemy hit sound
    playSfxEnemyHit();
    
    // Create particle effect at enemy position
    spawnEnemyHitParticles(enemy.x, enemy.y);
    
    // Spawn floating score popup
    spawnScorePopup(enemy.x, enemy.y - 10, points, '#FFD700'); // Gold color for scores
    
    if (DEBUG.LOG_COLLISIONS) {
        console.log(`💕 Enemy destroyed: ${enemy.type} at (${enemy.x}, ${enemy.y})`);
    }
}

/**
 * Handle bonus enemy being hit by player projectile
 * @param {Object} bonus - Bonus entity
 * @param {Object} projectile - Player projectile that hit bonus
 */
function handleBonusHit(bonus, projectile) {
    if (!bonus || !bonus.alive) return;
    
    // Mark both as dead
    bonus.alive = false;
    projectile.alive = false;
    
    // Award bonus points and display score
    awardBonusPoints(bonus);
    addScore(bonus.points);
    
    // Play bonus hit sound (magical chime)
    playSfxBonusHit();
    
    // Create particle effect at bonus position
    spawnEnemyHitParticles(bonus.x, bonus.y);
    
    // Spawn special score popup for bonus (pink color for bonuses)
    spawnScorePopup(bonus.x, bonus.y - 10, bonus.points, '#FF69B4'); // Hot pink for bonus scores
    
    if (DEBUG.LOG_COLLISIONS) {
        console.log(`✨ Bonus hit: ${bonus.type} worth ${bonus.points} points at (${bonus.x}, ${bonus.y})`);
    }
}

/**
 * Check if enemies have reached the invasion threshold
 * @param {Array} enemies - Array of enemy entities
 * @returns {boolean} True if invasion has occurred
 */
export function checkEnemyInvasion(enemies) {
    if (!enemies || enemies.length === 0) return false;
    
    const dimensions = getGameDimensions();
    const invasionY = dimensions.height * GAME_CONFIG.INVASION_Y_THRESHOLD;
    
    // Check if any alive enemy has reached the threshold
    for (const enemy of enemies) {
        if (enemy.alive && enemy.y >= invasionY) {
            console.log('🚨 ENEMY INVASION! Hearts reached the player!');
            return true;
        }
    }
    
    return false;
}

/**
 * Resolve all collisions for the current frame
 * @param {Object} entities - All game entities
 */
export function resolveCollisions(entities) {
    if (!entities) return;
    
    const { player, enemies, playerProjectiles, enemyProjectiles, shields, bonus } = entities;
    
    // 1. Check player projectiles vs enemies
    if (playerProjectiles && enemies) {
        for (const projectile of playerProjectiles) {
            if (!projectile.alive) continue;
            
            for (const enemy of enemies) {
                if (!enemy.alive) continue;
                
                if (checkAABB(
                    projectile, 
                    enemy, 
                    COLLISION_CONFIG.PROJECTILE_HITBOX_SCALE,
                    COLLISION_CONFIG.ENEMY_HITBOX_SCALE
                )) {
                    handleEnemyHit(enemy, projectile);
                    break; // Projectile can only hit one enemy
                }
            }
        }
    }
    
    // 2. Check player projectiles vs bonus enemy
    if (playerProjectiles && bonus && bonus.alive) {
        for (const projectile of playerProjectiles) {
            if (!projectile.alive) continue;
            
            if (checkAABB(
                projectile,
                bonus,
                COLLISION_CONFIG.PROJECTILE_HITBOX_SCALE,
                COLLISION_CONFIG.ENEMY_HITBOX_SCALE
            )) {
                handleBonusHit(bonus, projectile);
                break; // Projectile can only hit one target
            }
        }
    }
    
    // 3. Check player projectiles vs shields
    if (playerProjectiles && shields) {
        for (const projectile of playerProjectiles) {
            if (!projectile.alive) continue;
            
            for (const shield of shields) {
                if (!shield.alive) continue;
                
                const hit = checkProjectileShieldCollision(projectile, shield);
                if (hit) {
                    projectile.alive = false;
                    damageShield(shield, hit.row, hit.col);
                    
                    // Create shield damage particles at hit location
                    spawnShieldHitParticles(hit.blockX + 1.5, hit.blockY + 1.5);
                    
                    break; // Projectile can only hit one shield
                }
            }
        }
    }
    
    // 4. Check enemy projectiles vs shields
    if (enemyProjectiles && shields) {
        for (const projectile of enemyProjectiles) {
            if (!projectile.alive) continue;
            
            for (const shield of shields) {
                if (!shield.alive) continue;
                
                const hit = checkProjectileShieldCollision(projectile, shield);
                if (hit) {
                    projectile.alive = false;
                    damageShield(shield, hit.row, hit.col);
                    
                    // Create shield damage particles at hit location
                    spawnShieldHitParticles(hit.blockX + 1.5, hit.blockY + 1.5);
                    
                    break; // Projectile can only hit one shield
                }
            }
        }
    }
    
    // 5. Check enemy projectiles vs player
    if (enemyProjectiles && player && player.alive && !DEBUG.INVINCIBLE_PLAYER) {
        for (const projectile of enemyProjectiles) {
            if (!projectile.alive) continue;
            
            if (checkAABB(
                projectile, 
                player, 
                COLLISION_CONFIG.PROJECTILE_HITBOX_SCALE,
                COLLISION_CONFIG.PLAYER_HITBOX_SCALE
            )) {
                handlePlayerHit(player, projectile);
                break; // Only one projectile can hit per frame
            }
        }
    }
    
    // 6. Check enemy invasion (enemies reaching player Y threshold)
    if (enemies) {
        if (checkEnemyInvasion(enemies)) {
            // Enemies have reached the player line - instant game over
            if (player) {
                player.alive = false;
            }
            setState('gameover', 'invasion'); // Pass reason
        }
    }
}
