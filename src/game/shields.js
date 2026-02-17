/**
 * shields.js
 * Destructible shields/bunkers system with pixel-based damage
 * Valentine-themed heart-shaped shields that protect the player
 */

import { getGameDimensions } from '../canvas/resize.js';

// Shield configuration
const SHIELD_COUNT = 4;
const BLOCK_SIZE = 3; // Size of each destructible pixel/block
const SHIELD_Y_OFFSET = 200; // Distance from bottom of screen

/**
 * Heart-shaped shield template (1 = block exists, 0 = empty space)
 * Creates a symmetrical heart shape perfect for Valentine's theme
 */
const HEART_TEMPLATE = [
    [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
];

/**
 * Initialize shields for a new game/level
 * @returns {Array} Array of shield objects
 */
export function initShields() {
    const dimensions = getGameDimensions();
    const shields = [];
    
    // Calculate shield dimensions from template
    const templateHeight = HEART_TEMPLATE.length;
    const templateWidth = HEART_TEMPLATE[0].length;
    const shieldWidth = templateWidth * BLOCK_SIZE;
    const shieldHeight = templateHeight * BLOCK_SIZE;
    
    // Calculate spacing to evenly distribute shields
    const spacing = dimensions.width / (SHIELD_COUNT + 1);
    const shieldY = dimensions.height - SHIELD_Y_OFFSET;
    
    // Create each shield
    for (let i = 0; i < SHIELD_COUNT; i++) {
        const shieldX = spacing * (i + 1) - shieldWidth / 2;
        
        const shield = {
            x: shieldX,
            y: shieldY,
            width: shieldWidth,
            height: shieldHeight,
            blocks: createShieldBlocks(HEART_TEMPLATE),
            alive: true
        };
        
        shields.push(shield);
    }
    
    console.log(`💕 Created ${shields.length} heart-shaped shields`);
    return shields;
}

/**
 * Create a 2D array of shield blocks from template
 * @param {Array} template - 2D array template (1 = block, 0 = empty)
 * @returns {Array} 2D array of block objects
 */
function createShieldBlocks(template) {
    const blocks = [];
    
    for (let row = 0; row < template.length; row++) {
        blocks[row] = [];
        for (let col = 0; col < template[row].length; col++) {
            blocks[row][col] = {
                exists: template[row][col] === 1,
                health: template[row][col] === 1 ? 2 : 0 // Blocks can take 2 hits
            };
        }
    }
    
    return blocks;
}

/**
 * Reset all shields to full health (for new level)
 * @param {Array} shields - Array of shield objects
 */
export function resetShields(shields) {
    shields.forEach(shield => {
        shield.blocks = createShieldBlocks(HEART_TEMPLATE);
        shield.alive = true;
    });
    
    console.log('💌 Shields reset to full health');
}

/**
 * Check collision between projectile and shields
 * Damages shield blocks on hit
 * @param {Object} projectile - Projectile entity with x, y, width, height
 * @param {Array} shields - Array of shield objects
 * @returns {boolean} True if projectile hit a shield (and should be destroyed)
 */
export function checkShieldCollision(projectile, shields) {
    if (!projectile || !projectile.alive) return false;
    
    for (const shield of shields) {
        if (!shield.alive) continue;
        
        // Quick AABB check first
        if (!aabbCollision(projectile, shield)) continue;
        
        // Detailed pixel-level collision
        if (damageShieldAtPoint(shield, projectile.x, projectile.y, projectile.width, projectile.height)) {
            return true; // Projectile hit shield
        }
    }
    
    return false;
}

/**
 * Damage shield blocks at the given point
 * Destroys blocks in a small radius around impact point
 * @param {Object} shield - Shield object
 * @param {number} x - Impact x coordinate (CENTER of projectile)
 * @param {number} y - Impact y coordinate (CENTER of projectile)
 * @param {number} impactWidth - Width of impact area
 * @param {number} impactHeight - Height of impact area
 * @returns {boolean} True if any blocks were hit
 */
function damageShieldAtPoint(shield, x, y, impactWidth, impactHeight) {
    let hitDetected = false;
    
    // Convert world coordinates to shield-relative coordinates
    const relativeX = x - shield.x;
    const relativeY = y - shield.y;
    
    // Calculate block indices (with some padding for impact area)
    const startCol = Math.max(0, Math.floor((relativeX - impactWidth / 2) / BLOCK_SIZE));
    const endCol = Math.min(shield.blocks[0].length - 1, Math.ceil((relativeX + impactWidth / 2) / BLOCK_SIZE));
    const startRow = Math.max(0, Math.floor((relativeY - impactHeight / 2) / BLOCK_SIZE));
    const endRow = Math.min(shield.blocks.length - 1, Math.ceil((relativeY + impactHeight / 2) / BLOCK_SIZE));
    
    // Damage blocks in impact area
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const block = shield.blocks[row][col];
            
            if (block.exists && block.health > 0) {
                block.health--;
                
                if (block.health <= 0) {
                    block.exists = false;
                }
                
                hitDetected = true;
            }
        }
    }
    
    // Check if shield is completely destroyed
    if (hitDetected) {
        checkShieldDestroyed(shield);
    }
    
    return hitDetected;
}

/**
 * Check if shield is completely destroyed (no blocks remaining)
 * @param {Object} shield - Shield object
 */
function checkShieldDestroyed(shield) {
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
        console.log('💔 Shield destroyed!');
    }
}

/**
 * Simple AABB (Axis-Aligned Bounding Box) collision detection
 * Note: Entities use CENTER-BASED positioning (x, y is center)
 * Shields use TOP-LEFT corner positioning
 * @param {Object} entity - Entity with x, y, width, height (center-based)
 * @param {Object} shield - Shield with x, y, width, height (corner-based)
 * @returns {boolean} True if boxes overlap
 */
function aabbCollision(entity, shield) {
    // Convert entity from center-based to corner-based for comparison
    const entityLeft = entity.x - entity.width / 2;
    const entityRight = entity.x + entity.width / 2;
    const entityTop = entity.y - entity.height / 2;
    const entityBottom = entity.y + entity.height / 2;
    
    // Shield is already corner-based
    const shieldLeft = shield.x;
    const shieldRight = shield.x + shield.width;
    const shieldTop = shield.y;
    const shieldBottom = shield.y + shield.height;
    
    return entityRight > shieldLeft &&
           entityLeft < shieldRight &&
           entityBottom > shieldTop &&
           entityTop < shieldBottom;
}

/**
 * Get block at specific world coordinates
 * Useful for checking if a point is blocked by shield
 * @param {Object} shield - Shield object
 * @param {number} x - World x coordinate
 * @param {number} y - World y coordinate
 * @returns {Object|null} Block object or null if no block at position
 */
export function getBlockAtPosition(shield, x, y) {
    if (!shield.alive) return null;
    
    // Convert to shield-relative coordinates
    const relativeX = x - shield.x;
    const relativeY = y - shield.y;
    
    // Convert to block indices
    const col = Math.floor(relativeX / BLOCK_SIZE);
    const row = Math.floor(relativeY / BLOCK_SIZE);
    
    // Check bounds
    if (row < 0 || row >= shield.blocks.length || 
        col < 0 || col >= shield.blocks[0].length) {
        return null;
    }
    
    const block = shield.blocks[row][col];
    return (block.exists && block.health > 0) ? block : null;
}

/**
 * Count remaining blocks across all shields
 * @param {Array} shields - Array of shield objects
 * @returns {number} Total number of intact blocks
 */
export function countRemainingBlocks(shields) {
    let count = 0;
    
    shields.forEach(shield => {
        if (!shield.alive) return;
        
        shield.blocks.forEach(row => {
            row.forEach(block => {
                if (block.exists && block.health > 0) {
                    count++;
                }
            });
        });
    });
    
    return count;
}

/**
 * Get shield health percentage (0-1)
 * @param {Object} shield - Shield object
 * @returns {number} Health percentage (0 = destroyed, 1 = full health)
 */
export function getShieldHealth(shield) {
    if (!shield.alive) return 0;
    
    let totalBlocks = 0;
    let intactBlocks = 0;
    
    shield.blocks.forEach(row => {
        row.forEach(block => {
            if (block.health > 0 || block.exists) {
                totalBlocks++;
                if (block.exists && block.health > 0) {
                    intactBlocks++;
                }
            }
        });
    });
    
    return totalBlocks > 0 ? intactBlocks / totalBlocks : 0;
}

/**
 * Draw a shield with pixel-level detail
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shield - Shield object
 */
export function drawShield(ctx, shield) {
    if (!shield.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = false; // Crisp pixel art
    
    // Draw each block
    for (let row = 0; row < shield.blocks.length; row++) {
        for (let col = 0; col < shield.blocks[row].length; col++) {
            const block = shield.blocks[row][col];
            
            if (!block.exists || block.health <= 0) continue;
            
            const blockX = shield.x + col * BLOCK_SIZE;
            const blockY = shield.y + row * BLOCK_SIZE;
            
            // Color based on health (damaged blocks are darker)
            let fillColor;
            if (block.health === 2) {
                // Full health - bright pink/red
                fillColor = '#FF8FA3'; // Sweet Pink
            } else if (block.health === 1) {
                // Damaged - darker pink
                fillColor = '#FF4D6D'; // Passion Red
            }
            
            ctx.fillStyle = fillColor;
            ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
            
            // Add a subtle border for definition
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
    
    // Add a subtle glow effect around the shield
    ctx.globalAlpha = 0.2;
    ctx.shadowColor = '#FF8FA3';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FF8FA3';
    ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
    ctx.shadowBlur = 0;
    
    ctx.restore();
}

/**
 * Create particle effects when shield block is destroyed
 * @param {number} x - Block x position
 * @param {number} y - Block y position
 * @returns {Array} Array of particle objects
 */
export function createShieldParticles(x, y) {
    const particles = [];
    const particleCount = 3;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            width: 2,
            height: 2,
            velocityX: (Math.random() - 0.5) * 80,
            velocityY: (Math.random() - 0.5) * 80 - 20,
            type: 'shield',
            color: '#FF8FA3',
            lifetime: 0.5,
            age: 0,
            alive: true
        });
    }
    
    return particles;
}
