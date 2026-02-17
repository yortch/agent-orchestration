/**
 * draw.js
 * Valentine-themed drawing functions for all game entities
 * All rendering uses procedural Canvas API (no image assets)
 */

import { 
    heartShape, 
    arrowShape, 
    cloudShape, 
    envelopeShape,
    sparkleShape,
    bowShape,
    ringShape,
    chocolateBoxShape,
    loveLetterShape
} from './sprites.js';

// Color palette from theme.md
const COLORS = {
    midnightRomance: '#2D0036',
    passionRed: '#FF4D6D',
    sweetPink: '#FF8FA3',
    blushPink: '#FFC4D6',
    cupidGold: '#FFD700',
    paperWhite: '#F0F0F0',
    deepPurple: '#7B2869'
};

/**
 * Draw the player (Cupid's Cloud)
 * A fluffy white cloud with a golden bow on top
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} player - Player entity
 */
export function drawPlayer(ctx, player) {
    if (!player || !player.alive) return;
    
    ctx.save();
    
    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    
    // Flicker effect when invincible (blink every 150ms)
    if (player.invincible) {
        const flickerInterval = 150; // milliseconds
        const shouldShow = Math.floor(player.invincibilityTimer / flickerInterval) % 2 === 0;
        if (!shouldShow) {
            ctx.restore();
            return; // Skip drawing to create flicker effect
        }
    }
    
    // Draw sparkle trail (optional subtle effect)
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = COLORS.cupidGold;
    for (let i = 0; i < 3; i++) {
        sparkleShape(ctx, player.x - 15 + i * 15, player.y + player.height / 2, 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    
    // Draw cloud body
    ctx.fillStyle = COLORS.paperWhite;
    ctx.strokeStyle = COLORS.blushPink;
    ctx.lineWidth = 2;
    
    cloudShape(ctx, player.x, player.y, player.width, player.height * 0.7);
    ctx.fill();
    ctx.stroke();
    
    // Draw golden bow on top
    ctx.fillStyle = COLORS.cupidGold;
    ctx.strokeStyle = '#B8860B'; // Darker gold for outline
    ctx.lineWidth = 1;
    
    bowShape(ctx, player.x, player.y - player.height * 0.3, player.width * 0.4);
    ctx.stroke();
    
    ctx.restore();
}

/**
 * Draw an enemy (Floating Heart)
 * Hearts with different colors based on type, with pulsing animation
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} enemy - Enemy entity
 * @param {number} time - Current game time for animations
 */
export function drawEnemy(ctx, enemy, time = 0) {
    if (!enemy || !enemy.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    
    // Pulse animation (subtle scale)
    const pulseScale = 1.0 + Math.sin(time * 3 + enemy.pulsePhase) * 0.08;
    
    // Color based on enemy type
    let fillColor, strokeColor;
    switch (enemy.type) {
        case 'red':
            fillColor = COLORS.passionRed;
            strokeColor = '#CC0000';
            break;
        case 'pink':
            fillColor = COLORS.sweetPink;
            strokeColor = '#FF6B9D';
            break;
        case 'purple':
        default:
            fillColor = COLORS.deepPurple;
            strokeColor = '#5A1E4F';
            break;
    }
    
    // Create gradient for more visual depth
    const gradient = ctx.createRadialGradient(
        enemy.x, enemy.y + enemy.height * 0.2, 0,
        enemy.x, enemy.y + enemy.height * 0.2, enemy.height * 0.6
    );
    gradient.addColorStop(0, fillColor);
    gradient.addColorStop(1, strokeColor);
    
    // Apply pulse transform
    ctx.translate(enemy.x, enemy.y + enemy.height / 2);
    ctx.scale(pulseScale, pulseScale);
    ctx.translate(-enemy.x, -(enemy.y + enemy.height / 2));
    
    // Draw heart
    heartShape(ctx, enemy.x, enemy.y, enemy.height * 0.9);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Optional: Add subtle shine
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(enemy.x - enemy.width * 0.15, enemy.y + enemy.height * 0.25, enemy.width * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

/**
 * Draw a projectile (Love Arrow or Kiss/Drop)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} projectile - Projectile entity
 * @param {boolean} isPlayerProjectile - True for love arrows, false for enemy kisses
 */
export function drawProjectile(ctx, projectile, isPlayerProjectile) {
    if (!projectile || !projectile.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    
    if (isPlayerProjectile) {
        // Love Arrow (player projectile)
        ctx.strokeStyle = COLORS.cupidGold;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw arrow pointing upward
        arrowShape(ctx, projectile.x, projectile.y, projectile.height, -Math.PI / 2);
        ctx.stroke();
        
        // Pink fletching
        ctx.fillStyle = COLORS.sweetPink;
        ctx.globalAlpha = 0.7;
        arrowShape(ctx, projectile.x, projectile.y, projectile.height, -Math.PI / 2);
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Trailing sparkles
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = COLORS.cupidGold;
        sparkleShape(ctx, projectile.x, projectile.y + 8, 2);
        ctx.fill();
        
    } else {
        // Kiss/Heartbreak drop (enemy projectile)
        ctx.fillStyle = COLORS.passionRed;
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 1.5;
        
        // Draw as small falling heart
        heartShape(ctx, projectile.x, projectile.y, projectile.height * 0.6);
        ctx.fill();
        ctx.stroke();
        
        // Add jagged edges for "heartbreak" effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(projectile.x, projectile.y + projectile.height * 0.3);
        ctx.lineTo(projectile.x + 3, projectile.y + projectile.height * 0.5);
        ctx.lineTo(projectile.x - 3, projectile.y + projectile.height * 0.7);
        ctx.stroke();
    }
    
    ctx.restore();
}

/**
 * Draw a shield (Heart-shaped destructible barrier)
 * Note: Actual drawing now handled by shields.js module
 * This function remains for backward compatibility
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shield - Shield entity
 */
export function drawShield(ctx, shield) {
    // Import and use the shields.js drawShield function
    // This is now just a placeholder - shields are drawn directly from main.js
    if (!shield || !shield.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = false; // Crisp pixel art for blocks
    let healthPercent = 1;
    
    // Draw each block in the shield
    if (shield.blocks) {
        for (let row = 0; row < shield.blocks.length; row++) {
            for (let col = 0; col < shield.blocks[row].length; col++) {
                const block = shield.blocks[row][col];
                
                if (!block.exists || block.health <= 0) continue;
                
                const blockSize = 3;
                const blockX = shield.x + col * blockSize;
                const blockY = shield.y + row * blockSize;
                
                // Color based on health
                let fillColor;
                if (block.health === 2) {
                    fillColor = COLORS.sweetPink;
                } else if (block.health === 1) {
                    fillColor = COLORS.passionRed;
                }
                
                ctx.fillStyle = fillColor;
                ctx.fillRect(blockX, blockY, blockSize, blockSize);
                
                // Subtle border
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 0.5;
                ctx.strokeRect(blockX, blockY, blockSize, blockSize);
            }
        }
        
        // Subtle glow
        ctx.globalAlpha = 0.2;
        ctx.shadowColor = COLORS.sweetPink;
        ctx.shadowBlur = 10;
        ctx.fillStyle = COLORS.sweetPink;
        ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
        ctx.shadowBlur = 0;
    }
    
    ctx.globalAlpha = 1.0;
    
    // Calculate health percentage from blocks
    let totalBlocks = 0, aliveBlocks = 0;
    if (shield.blocks) {
        for (const row of shield.blocks) {
            for (const block of row) {
                if (block.exists) {
                    totalBlocks++;
                    if (block.health > 0) aliveBlocks++;
                }
            }
        }
    }
    healthPercent = totalBlocks > 0 ? aliveBlocks / totalBlocks : 1;
    
    // Draw damage (tears/cracks)
    if (healthPercent < 0.8) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        // Number of tears based on damage
        const tearCount = Math.floor((1 - healthPercent) * 5);
        
        for (let i = 0; i < tearCount; i++) {
            ctx.beginPath();
            const tearX = shield.x + (shield.width / (tearCount + 1)) * (i + 1);
            const tearY = shield.y + shield.height * 0.6;
            ctx.moveTo(tearX, tearY);
            ctx.lineTo(tearX + (Math.random() - 0.5) * 10, tearY + shield.height * 0.3);
            ctx.stroke();
        }
    }
    
    // Confetti effect when nearly destroyed
    if (healthPercent < 0.3) {
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i % 2 === 0 ? COLORS.sweetPink : COLORS.blushPink;
            const confettiX = shield.x + Math.random() * shield.width;
            const confettiY = shield.y + Math.random() * shield.height;
            ctx.fillRect(confettiX, confettiY, 3, 3);
        }
    }
    
    ctx.restore();
}

/**
 * Draw a particle effect (Hearts, Sparkles, Explosions, Confetti, Debris, Score Popups)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} particle - Particle entity
 */
export function drawParticle(ctx, particle) {
    if (!particle || !particle.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    
    // Calculate fade based on age
    const lifePercent = 1 - (particle.age / particle.lifetime);
    ctx.globalAlpha = lifePercent;
    
    if (particle.type === 'heart') {
        // Regular heart particles (when enemy is hit)
        ctx.save();
        
        // Apply rotation if particle has it
        if (particle.rotation) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.translate(-particle.x, -particle.y);
        }
        
        ctx.fillStyle = COLORS.passionRed;
        ctx.strokeStyle = COLORS.sweetPink;
        ctx.lineWidth = 1;
        
        heartShape(ctx, particle.x, particle.y, particle.width);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
    } else if (particle.type === 'mini-heart') {
        // Smaller pink hearts for celebration effects
        ctx.save();
        
        // Apply rotation for spinning celebration hearts
        if (particle.rotation) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.translate(-particle.x, -particle.y);
        }
        
        ctx.fillStyle = COLORS.sweetPink;
        ctx.strokeStyle = COLORS.blushPink;
        ctx.lineWidth = 0.5;
        
        heartShape(ctx, particle.x, particle.y, particle.width * 0.7);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
    } else if (particle.type === 'sparkle') {
        // Sparkle particles (golden stars)
        ctx.fillStyle = COLORS.cupidGold;
        sparkleShape(ctx, particle.x, particle.y, particle.width / 2, 4);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = COLORS.cupidGold;
        ctx.shadowBlur = particle.width;
        sparkleShape(ctx, particle.x, particle.y, particle.width / 2, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        
    } else if (particle.type === 'score') {
        // Score popup (floating text)
        const fadeStart = 0.6; // Start fading at 60% of lifetime
        const agePercent = particle.age / particle.lifetime;
        
        // Extra fade for score popups
        if (agePercent > fadeStart) {
            const fadePercent = (agePercent - fadeStart) / (1 - fadeStart);
            ctx.globalAlpha = 1 - fadePercent;
        } else {
            ctx.globalAlpha = 1;
        }
        
        // Draw text with outline for visibility
        ctx.font = `bold ${particle.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Outline
        ctx.strokeStyle = COLORS.midnightRomance;
        ctx.lineWidth = 3;
        ctx.strokeText(particle.text, particle.x, particle.y);
        
        // Fill
        ctx.fillStyle = particle.color || COLORS.cupidGold;
        ctx.fillText(particle.text, particle.x, particle.y);
        
    } else if (particle.type === 'confetti') {
        // Sparkle particles (golden stars)
        ctx.fillStyle = COLORS.cupidGold;
        sparkleShape(ctx, particle.x, particle.y, particle.width / 2, 4);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = COLORS.cupidGold;
        ctx.shadowBlur = particle.width;
        sparkleShape(ctx, particle.x, particle.y, particle.width / 2, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        
    } else if (particle.type === 'confetti') {
        // Paper confetti (rectangular pieces from shields)
        ctx.fillStyle = Math.random() > 0.5 ? COLORS.sweetPink : COLORS.blushPink;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 0.5;
        
        // Rotate confetti based on particle index for variety
        const rotation = (particle.x * particle.y) % (Math.PI * 2);
        ctx.translate(particle.x, particle.y);
        ctx.rotate(rotation + particle.age * 3);
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height * 1.5);
        ctx.strokeRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height * 1.5);
        
    } else if (particle.type === 'debris') {
        // Shield debris (paper/envelope fragments)
        ctx.fillStyle = COLORS.paperWhite;
        ctx.strokeStyle = COLORS.blushPink;
        ctx.lineWidth = 0.5;
        
        // Irregular shape for debris
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.age * 4);
        ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        ctx.strokeRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
        
    } else if (particle.type === 'explosion') {
        // Explosion particles (bright circles that expand and fade)
        const expansionFactor = 1 + (1 - lifePercent) * 0.5; // Grow as they fade
        const size = particle.width * expansionFactor;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, size);
        gradient.addColorStop(0, COLORS.cupidGold);
        gradient.addColorStop(0.5, COLORS.passionRed);
        gradient.addColorStop(1, 'rgba(255, 77, 109, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
    } else {
        // Default: simple circle
        ctx.fillStyle = COLORS.blushPink;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

/**
 * Draw background elements (subtle Valentine decorations)
 * Uses logical dimensions for consistent rendering across all displays
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} gameWidth - Logical game width
 * @param {number} gameHeight - Logical game height
 * @param {number} time - Current game time for animations
 */
export function drawBackground(ctx, gameWidth, gameHeight, time = 0) {
    ctx.save();
    
    // Base background color
    ctx.fillStyle = COLORS.midnightRomance;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    
    // Subtle floating hearts in background
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 8; i++) {
        const x = (gameWidth / 8) * i + (Math.sin(time * 0.5 + i) * 30);
        const y = (gameHeight / 3) + (Math.cos(time * 0.3 + i) * 50);
        const size = 40 + Math.sin(time + i) * 10;
        
        ctx.fillStyle = COLORS.passionRed;
        heartShape(ctx, x, y, size);
        ctx.fill();
    }
    
    // Sparkles scattered around
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 15; i++) {
        const x = (gameWidth / 15) * i + Math.sin(time * 2 + i) * 20;
        const y = (gameHeight / 4) * (i % 3) + Math.cos(time * 1.5 + i) * 30;
        const size = 2 + Math.sin(time * 3 + i) * 1;
        
        ctx.fillStyle = COLORS.blushPink;
        sparkleShape(ctx, x, y, size, 4);
        ctx.fill();
    }
    
    ctx.restore();
}

/**
 * Draw the bonus enemy (Valentine-themed bonus target)
 * Types: ring (engagement ring), chocolate (box of chocolates), letter (love letter)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} bonus - Bonus entity
 */
export function drawBonus(ctx, bonus) {
    if (!bonus || !bonus.alive) return;
    
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    
    const size = Math.min(bonus.width, bonus.height);
    
    // Pulsing glow effect
    const pulse = 0.9 + Math.sin(Date.now() * 0.005) * 0.1;
    ctx.globalAlpha = 0.4 * pulse;
    ctx.fillStyle = COLORS.cupidGold;
    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Draw based on bonus type
    if (bonus.type === 'ring') {
        // Engagement ring (gold band with diamond)
        ctx.fillStyle = COLORS.cupidGold;
        ctx.strokeStyle = '#B8860B'; // Darker gold
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ringShape(ctx, bonus.x, bonus.y, size);
        ctx.fill();
        ctx.stroke();
        
        // Diamond sparkle (white)
        ctx.fillStyle = COLORS.paperWhite;
        ctx.beginPath();
        sparkleShape(ctx, bonus.x, bonus.y - size * 0.5, size * 0.15, 4);
        ctx.fill();
        
    } else if (bonus.type === 'chocolate') {
        // Box of chocolates (brown box with ribbon)
        ctx.fillStyle = '#663300'; // Brown
        ctx.strokeStyle = '#331800'; // Dark brown
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        chocolateBoxShape(ctx, bonus.x, bonus.y, size);
        ctx.fill();
        ctx.stroke();
        
        // Ribbon (red) - redraw the ribbon parts on top
        ctx.fillStyle = COLORS.passionRed;
        const ribbonWidth = size * 0.12;
        ctx.fillRect(bonus.x - ribbonWidth / 2, bonus.y - size * 0.35, ribbonWidth, size * 0.7);
        ctx.fillRect(bonus.x - size * 0.45, bonus.y - ribbonWidth / 2, size * 0.9, ribbonWidth);
        
    } else if (bonus.type === 'letter') {
        // Love letter (envelope with heart seal)
        ctx.fillStyle = COLORS.paperWhite;
        ctx.strokeStyle = COLORS.blushPink;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        loveLetterShape(ctx, bonus.x, bonus.y, size);
        ctx.fill();
        ctx.stroke();
        
        // Heart seal (red) - draw on top
        ctx.fillStyle = COLORS.passionRed;
        const sealY = bonus.y - size * 0.3 + (size * 0.6 * 0.4) * 0.3;
        const heartSize = size * 0.15;
        ctx.beginPath();
        ctx.arc(bonus.x - heartSize * 0.2, sealY, heartSize * 0.15, 0, Math.PI * 2);
        ctx.arc(bonus.x + heartSize * 0.2, sealY, heartSize * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

/**
 * Draw bonus score display (shown briefly when bonus is hit)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} scoreDisplay - Score display info {x, y, score, timer}
 */
export function drawBonusScore(ctx, scoreDisplay) {
    if (!scoreDisplay) return;
    
    ctx.save();
    
    // Fade out over time
    const fadePercent = Math.max(0, Math.min(1, scoreDisplay.timer / 2.0));
    ctx.globalAlpha = fadePercent;
    
    // Float upward
    const floatY = scoreDisplay.y - (2.0 - scoreDisplay.timer) * 30;
    
    // Draw score text
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = COLORS.cupidGold;
    ctx.strokeStyle = COLORS.midnightRomance;
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const text = `${scoreDisplay.score}`;
    ctx.strokeText(text, scoreDisplay.x, floatY);
    ctx.fillText(text, scoreDisplay.x, floatY);
    
    ctx.restore();
}

