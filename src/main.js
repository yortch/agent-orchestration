/**
 * main.js
 * Entry point for Love Invaders game
 * Initializes all systems and starts the game loop
 */

import { setupCanvas, handleResize, getGameDimensions } from './canvas/resize.js';
import { startGameLoop, stopGameLoop } from './game/loop.js';
import { setupInput, getInput, updateInput } from './game/input.js';
import { getState, setState, updateLevelClear, getGameOverReason } from './game/state.js';
import { initEntities, getEntities, createPlayerProjectile, cleanupDeadEntities, resetEntitiesForLevel } from './game/entities.js';
import { updatePlayer, canShoot, shoot, resetPlayer, resetPlayerPosition } from './game/player.js';
import { initEnemies, updateEnemies, updateEnemyAnimations } from './game/enemies.js';
import { initEnemyFire, updateEnemyFire } from './game/enemyFire.js';
import { initScoring, getScore, getHighScore, resetScore, formatScore } from './game/scoring.js';
import { initLevels, getLevel, resetLevel, nextLevel, getDifficultyName } from './game/levels.js';
import { 
    updatePlayerProjectiles, 
    updateEnemyProjectiles
} from './game/projectiles.js';
import { updateParticles, spawnCelebrationParticles } from './game/particles.js';
import { 
    drawPlayer, 
    drawEnemy, 
    drawProjectile, 
    drawShield, 
    drawParticle,
    drawBackground,
    drawBonus,
    drawBonusScore
} from './render/draw.js';
import { resolveCollisions } from './game/collisions.js';
import { 
    initBonus, 
    updateBonus, 
    updateBonusScoreDisplay, 
    getBonusScoreDisplay,
    resetBonus 
} from './game/bonus.js';
import { 
    playSfxShoot, 
    initAudio, 
    toggleMute, 
    isMutedState,
    startBackgroundMusic,
    stopBackgroundMusic
} from './audio/audio.js';

// Get canvas reference
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Track total elapsed time for animations
let totalTime = 0;

// Track previous state for detecting transitions
let previousState = null;

// Get title overlay reference for managing visibility
const titleOverlay = document.getElementById('titleOverlay');

// Export canvas and context for other modules to use
export { canvas, ctx };

/**
 * Initialize all game systems
 */
function init() {
    console.log('🎮 Initializing Love Invaders...');
    
    // Initialize audio system first
    initAudio();
    
    // Setup canvas with HiDPI support
    setupCanvas(canvas);
    
    // Setup input handlers
    setupInput();
    
    // Initialize scoring and level systems
    initScoring();
    initLevels();
    
    // Initialize game entities
    initEntities();
    
    // Initialize enemy formation movement
    const entities = getEntities();
    const dimensions = getGameDimensions();
    initEnemies(entities.enemies, dimensions.width);
    
    // Initialize enemy firing system
    initEnemyFire();
    
    // Initialize bonus system
    initBonus();
    
    // Handle window resize
    window.addEventListener('resize', () => handleResize(canvas));
    
    // Set initial game state to 'start'
    setState('start');
    
    // Start the game loop
    startGameLoop(update, render);
    
    console.log('✅ Game initialized successfully');
}

/**
 * Main update function - called every frame
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
function update(deltaTime) {
    const state = getState();
    
    // Detect state transitions and handle resets
    if (previousState === 'gameover' && state === 'start') {
        // Reset game when restarting from game over
        resetScore();
        resetLevel();
        resetBonus();
        
        // Re-initialize all entities for a fresh game
        initEntities();
        
        // Get fresh entity references after initialization
        const entities = getEntities();
        const dimensions = getGameDimensions();
        
        // Initialize enemy movement system with new entities
        initEnemies(entities.enemies, dimensions.width);
        
        console.log('🔄 Game reset - ready to play!');
    }
    
    // Start new game from start screen
    if (previousState === 'start' && state === 'playing') {
        // Ensure systems are initialized for a new game
        // (Score and level already reset when transitioning from gameover → start)
        console.log('🎮 Starting new game!');
    }
    
    previousState = state;
    
    // Update total time for animations
    totalTime += deltaTime;
    
    // Update logic based on current game state
    switch (state) {
        case 'start':
            // Update start screen animations/UI
            break;
        case 'playing':
            updateGameEntities(deltaTime);
            checkLevelClearCondition();
            break;
        case 'paused':
            // No updates while paused
            break;
        case 'levelclear':
            // Update level clear timer
            if (updateLevelClear(deltaTime)) {
                // Duration elapsed - advance to next level
                const currentLevel = nextLevel();
                console.log(`⏱️ Level clear complete - starting level ${currentLevel}`);
                
                const entities = getEntities();
                
                // Reset entities for new level (preserves player lives and score)
                resetEntitiesForLevel();
                
                // Reset bonus system for new level
                resetBonus();
                
                // Re-initialize enemy formation with increased difficulty
                const dimensions = getGameDimensions();
                initEnemies(entities.enemies, dimensions.width);
                
                // Reset player position but keep lives
                if (entities.player && entities.player.alive) {
                    resetPlayerPosition(entities.player);
                }
                
                // Resume gameplay
                setState('playing');
            }
            break;
        case 'gameover':
            // Update game over screen
            break;
    }
    
    // Update input edge detection (must be at end of update)
    updateInput();
}

/**
 * Update all game entities during gameplay
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
function updateGameEntities(deltaTime) {
    const entities = getEntities();
    const input = getInput();
    const currentTime = performance.now();
    const dimensions = getGameDimensions();
    
    // Update player
    if (entities.player && entities.player.alive) {
        updatePlayer(entities.player, input, deltaTime, dimensions.width);
        
        // Handle shooting
        if (input.shoot && canShoot(entities.player, currentTime, entities.playerProjectiles)) {
            // Create projectile at player position (top-center of player)
            const projectileX = entities.player.x;
            const projectileY = entities.player.y - entities.player.height / 2;
            
            createPlayerProjectile(projectileX, projectileY);
            shoot(entities.player, currentTime);
            
            // Play shoot sound effect
            playSfxShoot();
            
            console.log('💘 Love arrow fired!');
        }
    }
    
    // Update enemy formation movement
    updateEnemies(entities.enemies, deltaTime, dimensions.width);
    
    // Update enemy firing (with difficulty scaling and limits)
    updateEnemyFire(entities.enemies, entities.enemyProjectiles, deltaTime);
    
    // Update enemy animations (pulse effect)
    updateEnemyAnimations(entities.enemies, deltaTime);
    
    // Update projectiles
    updatePlayerProjectiles(entities.playerProjectiles, deltaTime);
    updateEnemyProjectiles(entities.enemyProjectiles, deltaTime);
    
    // Update particles (movement, aging, cleanup)
    updateParticles(deltaTime);
    
    // Update bonus enemy (spawn, movement, despawn)
    entities.bonus = updateBonus(entities.bonus, deltaTime);
    
    // Update bonus score display (fading text when bonus is hit)
    updateBonusScoreDisplay(deltaTime);
    
    // Resolve all collisions (player/enemy projectiles vs enemies/shields/player)
    resolveCollisions(entities);
    
    // Clean up dead entities
    cleanupDeadEntities();
}

/**
 * Check if level is cleared (all enemies destroyed)
 */
function checkLevelClearCondition() {
    const entities = getEntities();
    const aliveEnemies = entities.enemies.filter(e => e.alive).length;
    
    // Only trigger level clear if there were enemies to begin with
    if (entities.enemies.length > 0 && aliveEnemies === 0) {
        console.log('🎉 All enemies destroyed! Level cleared!');
        
        // Spawn celebration particles for visual flair
        spawnCelebrationParticles();
        
        setState('levelclear');
    }
}

/**
 * Main render function - called every frame
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
function render(deltaTime) {
    const state = getState();
    const dimensions = getGameDimensions();
    
    // Manage title overlay visibility based on game state
    if (titleOverlay) {
        if (state === 'start' || state === 'gameover') {
            titleOverlay.classList.remove('hidden');
        } else {
            titleOverlay.classList.add('hidden');
        }
    }
    
    // Draw Valentine-themed background
    drawBackground(ctx, dimensions.width, dimensions.height, totalTime);
    
    // Render based on current game state
    switch (state) {
        case 'start':
            renderStartScreen();
            break;
        case 'playing':
            renderGame();
            break;
        case 'paused':
            renderGame();
            renderPauseOverlay();
            break;
        case 'levelclear':
            renderGame();
            renderLevelClearOverlay();
            break;
        case 'gameover':
            renderGameOverScreen();
            break;
    }
}

/**
 * Render start screen
 */
function renderStartScreen() {
    const dimensions = getGameDimensions();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Scale fonts based on canvas size
    const titleSize = Math.max(40, Math.min(72, dimensions.width / 10));
    const subtitleSize = Math.max(20, Math.min(32, dimensions.width / 25));
    const instructionSize = Math.max(14, Math.min(22, dimensions.width / 36));
    
    ctx.textAlign = 'center';
    
    // Animated pulse effect for title
    const pulse = Math.sin(totalTime * 2) * 0.15 + 1;
    const slowPulse = Math.sin(totalTime * 1.5) * 0.2 + 0.8;
    
    // Decorative hearts floating around title
    ctx.save();
    ctx.font = `${titleSize * 0.6}px Arial`;
    ctx.globalAlpha = slowPulse * 0.6;
    ctx.fillStyle = '#FF69B4';
    ctx.fillText('💕', centerX - titleSize * 1.8, centerY - titleSize * 2.5);
    ctx.fillText('💕', centerX + titleSize * 1.8, centerY - titleSize * 2.5);
    ctx.restore();
    
    // Main title with layered glow effect
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 30 * pulse;
    ctx.fillStyle = '#FFD700'; // Cupid Gold
    ctx.font = `bold ${titleSize}px "Pacifico", cursive`;
    ctx.fillText('💘 LOVE INVADERS 💘', centerX, centerY - titleSize * 1.8);
    
    // Add secondary glow
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 20 * pulse;
    ctx.fillText('💘 LOVE INVADERS 💘', centerX, centerY - titleSize * 1.8);
    ctx.restore();
    
    // Tagline with fancy font
    ctx.save();
    ctx.fillStyle = '#FFB6C1'; // Light Pink
    ctx.font = `${subtitleSize * 0.75}px "Dancing Script", cursive`;
    ctx.globalAlpha = 0.9;
    ctx.fillText('Cupid\'s Quest to Capture Hearts', centerX, centerY - titleSize * 0.6);
    ctx.restore();
    
    // Start instruction with animated gradient effect
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowColor = '#FF69B4';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FF1493'; // Deep Pink
    ctx.font = `bold ${subtitleSize}px "Quicksand", sans-serif`;
    ctx.fillText('Press SPACE to Start', centerX, centerY + subtitleSize * 0.2);
    ctx.restore();
    
    // Decorative divider
    ctx.save();
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    const dividerY = centerY + subtitleSize * 1.2;
    ctx.beginPath();
    ctx.moveTo(centerX - dimensions.width * 0.15, dividerY);
    ctx.lineTo(centerX + dimensions.width * 0.15, dividerY);
    ctx.stroke();
    ctx.restore();
    
    // Controls section with better hierarchy
    const controlsY = centerY + subtitleSize * 2;
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `bold ${instructionSize * 1.1}px "Quicksand", sans-serif`;
    ctx.fillText('HOW TO PLAY', centerX, controlsY);
    
    ctx.fillStyle = '#FFB6C1'; // Light Pink
    ctx.font = `${instructionSize}px "Quicksand", sans-serif`;
    const lineSpacing = instructionSize * 1.5;
    ctx.fillText('← → or A/D: Move Cupid', centerX, controlsY + lineSpacing);
    ctx.fillText('SPACE: Fire Love Arrows', centerX, controlsY + lineSpacing * 2);
    ctx.fillText('P: Pause Game', centerX, controlsY + lineSpacing * 3);
    ctx.fillText('M: Mute/Unmute Audio', centerX, controlsY + lineSpacing * 4);
    
    // High score display with trophy
    const highScore = getHighScore();
    if (highScore > 0) {
        ctx.save();
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.font = `bold ${instructionSize * 1.2}px "Quicksand", sans-serif`;
        ctx.fillText(`🏆 High Score: ${formatScore(highScore)} 🏆`, centerX, controlsY + lineSpacing * 5.5);
        ctx.restore();
    }
    
    // Fun tip at bottom
    ctx.save();
    ctx.fillStyle = '#9370DB';
    ctx.font = `italic ${instructionSize * 0.8}px "Dancing Script", cursive`;
    ctx.globalAlpha = slowPulse;
    ctx.fillText('💕 Spread love, not war! 💕', centerX, dimensions.height - instructionSize * 0.5);
    ctx.restore();
}

/**
 * Render main game
 */
function renderGame() {
    // Placeholder - entities will be rendered here
    const entities = getEntities();
    
    // Draw shields (love letters) - behind everything else
    entities.shields.forEach(shield => {
        drawShield(ctx, shield);
    });
    
    // Draw player (Cupid's cloud)
    if (entities.player) {
        drawPlayer(ctx, entities.player);
    }
    
    // Draw enemies (floating hearts)
    entities.enemies.forEach(enemy => {
        drawEnemy(ctx, enemy, totalTime);
    });
    
    // Draw player projectiles (love arrows)
    entities.playerProjectiles.forEach(projectile => {
        drawProjectile(ctx, projectile, true);
    });
    
    // Draw enemy projectiles (kisses/drops)
    entities.enemyProjectiles.forEach(projectile => {
        drawProjectile(ctx, projectile, false);
    });
    
    // Draw particles (sparkles, hearts)
    entities.particles.forEach(particle => {
        drawParticle(ctx, particle);
    });
    
    // Draw bonus enemy (ring/chocolate/letter)
    if (entities.bonus) {
        drawBonus(ctx, entities.bonus);
    }
    
    // Draw bonus score display (shows points briefly when hit)
    const bonusScoreDisplay = getBonusScoreDisplay();
    if (bonusScoreDisplay) {
        drawBonusScore(ctx, bonusScoreDisplay);
    }
    
    // Draw UI elements (score, lives, etc.)
    renderUI(entities);
}

/**
 * Render UI elements (score, lives, etc.)
 * @param {Object} entities - All game entities
 */
function renderUI(entities) {
    const dimensions = getGameDimensions();
    const score = getScore();
    const highScore = getHighScore();
    const level = getLevel();
    
    // Scale font size based on canvas width for responsiveness
    const baseFontSize = Math.max(18, Math.min(28, dimensions.width / 35));
    const labelFontSize = Math.max(12, Math.min(18, dimensions.width / 45));
    const margin = Math.max(20, dimensions.width * 0.025);
    
    ctx.save();
    
    // Top row - Score, Level, High Score with enhanced styling
    const topY = margin + baseFontSize;
    
    // Top left: Score with label and glow
    ctx.fillStyle = '#FFB6C1'; // Light Pink for label
    ctx.font = `600 ${labelFontSize}px "Quicksand", sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText('SCORE', margin, topY - baseFontSize * 0.5);
    
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FFD700'; // Gold for value
    ctx.font = `bold ${baseFontSize}px "Quicksand", sans-serif`;
    ctx.fillText(formatScore(score), margin, topY);
    ctx.restore();
    
    // Top center: Level with decorative hearts and glow
    ctx.save();
    ctx.shadowColor = '#9370DB';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FF69B4'; // Hot Pink
    ctx.font = `bold ${baseFontSize * 1.1}px "Quicksand", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`💕 LEVEL ${level} 💕`, dimensions.width / 2, topY);
    ctx.restore();
    
    // Top right: High Score with label and glow
    ctx.fillStyle = '#FFB6C1'; // Light Pink for label
    ctx.font = `600 ${labelFontSize}px "Quicksand", sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText('HIGH SCORE', dimensions.width - margin, topY - baseFontSize * 0.5);
    
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FFD700'; // Gold for value
    ctx.font = `bold ${baseFontSize}px "Quicksand", sans-serif`;
    ctx.fillText(formatScore(highScore), dimensions.width - margin, topY);
    ctx.restore();
    
    // Bottom left: Lives with heart icons, label, and invincibility indicator
    if (entities.player) {
        const bottomY = dimensions.height - margin;
        
        ctx.fillStyle = '#FFB6C1'; // Light Pink for label
        ctx.font = `600 ${labelFontSize}px "Quicksand", sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('LIVES', margin, bottomY - baseFontSize * 1.2);
        
        // Draw individual heart icons with spacing and glow
        ctx.save();
        ctx.shadowColor = '#FF1493';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#FF1493'; // Deep Pink for hearts
        ctx.font = `${baseFontSize * 1.3}px Arial`;
        for (let i = 0; i < entities.player.lives; i++) {
            ctx.fillText('❤️', margin + i * (baseFontSize * 1.6), bottomY);
        }
        ctx.restore();
        
        // Invincibility indicator (if player is invincible)
        if (entities.player.invincible && entities.player.invincibleUntil) {
            const currentTime = performance.now();
            const timeLeft = (entities.player.invincibleUntil - currentTime) / 1000;
            
            if (timeLeft > 0) {
                const invincX = margin;
                const invincY = bottomY - baseFontSize * 2.5;
                
                // Flashing shield icon
                const flash = Math.sin(totalTime * 10) * 0.3 + 0.7;
                ctx.save();
                ctx.globalAlpha = flash;
                ctx.shadowColor = '#00FFFF';
                ctx.shadowBlur = 15;
                ctx.fillStyle = '#00FFFF'; // Cyan for shield
                ctx.font = `${baseFontSize * 1.2}px Arial`;
                ctx.textAlign = 'left';
                ctx.fillText('🛡️', invincX, invincY);
                
                // Timer bar
                const barWidth = baseFontSize * 3;
                const barHeight = baseFontSize * 0.3;
                const barX = invincX + baseFontSize * 1.5;
                const barY = invincY - baseFontSize * 0.7;
                const fillWidth = (timeLeft / 3) * barWidth; // Assuming 3 second invincibility
                
                // Background bar
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(barX, barY, barWidth, barHeight);
                
                // Fill bar (gradient)
                const gradient = ctx.createLinearGradient(barX, barY, barX + fillWidth, barY);
                gradient.addColorStop(0, '#00FFFF');
                gradient.addColorStop(1, '#FF1493');
                ctx.fillStyle = gradient;
                ctx.fillRect(barX, barY, fillWidth, barHeight);
                
                // Border
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, barY, barWidth, barHeight);
                ctx.restore();
            }
        }
    }
    
    // Bottom right: Shoot cooldown indicator (visual feedback)
    if (entities.player && entities.player.lastShootTime !== undefined) {
        const currentTime = performance.now();
        const shootCooldown = 250; // ms (must match config)
        const timeSinceShot = currentTime - entities.player.lastShootTime;
        const cooldownRemaining = Math.max(0, shootCooldown - timeSinceShot);
        const cooldownPercent = cooldownRemaining / shootCooldown;
        
        if (cooldownPercent > 0) {
            const cooldownX = dimensions.width - margin - baseFontSize * 3;
            const cooldownY = bottomY - baseFontSize * 0.5;
            const barWidth = baseFontSize * 3;
            const barHeight = baseFontSize * 0.35;
            const fillWidth = cooldownPercent * barWidth;
            
            ctx.save();
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFB6C1';
            ctx.font = `${labelFontSize * 0.9}px "Quicksand", sans-serif`;
            ctx.fillText('RELOAD', dimensions.width - margin, cooldownY - baseFontSize * 0.7);
            
            // Background bar
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(cooldownX, cooldownY, barWidth, barHeight);
            
            // Fill bar (pink gradient)
            const gradient = ctx.createLinearGradient(cooldownX, cooldownY, cooldownX + barWidth, cooldownY);
            gradient.addColorStop(0, '#FF69B4');
            gradient.addColorStop(1, '#FF1493');
            ctx.fillStyle = gradient;
            ctx.fillRect(cooldownX, cooldownY, fillWidth, barHeight);
            
            // Border with glow
            ctx.shadowColor = '#FF1493';
            ctx.shadowBlur = 5;
            ctx.strokeStyle = '#FF1493';
            ctx.lineWidth = 2;
            ctx.strokeRect(cooldownX, cooldownY, barWidth, barHeight);
            ctx.restore();
        } else {
            // Show ready indicator when can shoot
            const readyPulse = Math.sin(totalTime * 8) * 0.3 + 0.7;
            ctx.save();
            ctx.globalAlpha = readyPulse;
            ctx.textAlign = 'right';
            ctx.shadowColor = '#00FF00';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#00FF00';
            ctx.font = `bold ${labelFontSize}px "Quicksand", sans-serif`;
            ctx.fillText('✓ READY', dimensions.width - margin, bottomY);
            ctx.restore();
        }
    }
    
    // Top right corner: Mute indicator
    const muteIndicatorX = dimensions.width - margin - baseFontSize * 1.2;
    const muteIndicatorY = margin + baseFontSize * 2;
    
    ctx.save();
    ctx.textAlign = 'right';
    ctx.font = `${baseFontSize}px Arial`;
    
    // Show mute/unmute status with icon
    if (isMutedState()) {
        ctx.shadowColor = '#888';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#888'; // Gray when muted
        ctx.fillText('🔇', muteIndicatorX, muteIndicatorY);
    } else {
        const volumePulse = Math.sin(totalTime * 4) * 0.1 + 0.9;
        ctx.globalAlpha = volumePulse;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#FFD700'; // Gold when unmuted
        ctx.fillText('🔊', muteIndicatorX, muteIndicatorY);
    }
    
    // Add "M to mute" hint (very subtle)
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#FFB6C1';
    ctx.font = `${labelFontSize * 0.7}px "Quicksand", sans-serif`;
    ctx.fillText('M', muteIndicatorX, muteIndicatorY + baseFontSize * 0.8);
    ctx.restore();
    
    ctx.restore();
}

/**
 * Render pause overlay
 */
function renderPauseOverlay() {
    const dimensions = getGameDimensions();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Scale fonts
    const titleSize = Math.max(36, Math.min(56, dimensions.width / 13));
    const textSize = Math.max(18, Math.min(28, dimensions.width / 30));
    
    // Semi-transparent purple overlay with vignette
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, dimensions.width * 0.7);
    gradient.addColorStop(0, 'rgba(45, 0, 54, 0.75)');
    gradient.addColorStop(1, 'rgba(26, 0, 31, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Decorative border with glow
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 4;
    const boxWidth = dimensions.width * 0.6;
    const boxHeight = dimensions.height * 0.4;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - boxHeight / 2;
    
    // Inner fill with gradient
    const boxGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    boxGradient.addColorStop(0, 'rgba(123, 40, 105, 0.3)');
    boxGradient.addColorStop(1, 'rgba(230, 57, 70, 0.2)');
    ctx.fillStyle = boxGradient;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.restore();
    
    ctx.textAlign = 'center';
    
    // Pulsing pause icon and text
    const pulse = Math.sin(totalTime * 3) * 0.2 + 1;
    ctx.save();
    ctx.shadowColor = '#9370DB';
    ctx.shadowBlur = 15 * pulse;
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `bold ${titleSize}px "Pacifico", cursive`;
    ctx.fillText('⏸ PAUSED ⏸', centerX, centerY - titleSize * 0.3);
    ctx.restore();
    
    // Instructions with styling
    ctx.save();
    ctx.shadowColor = '#FF69B4';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#FFB6C1'; // Light Pink
    ctx.font = `bold ${textSize}px "Quicksand", sans-serif`;
    ctx.fillText('Press P to Resume', centerX, centerY + textSize * 0.8);
    ctx.restore();
    
    // Encouraging message
    ctx.fillStyle = '#9370DB'; // Purple
    ctx.font = `italic ${textSize * 0.8}px "Dancing Script", cursive`;
    ctx.fillText('Take a breath... Cupid needs a break too! 💕', centerX, centerY + textSize * 2.5);
}

/**
 * Render level clear overlay
 */
function renderLevelClearOverlay() {
    const dimensions = getGameDimensions();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const level = getLevel();
    const score = getScore();
    const nextLevelNum = level + 1;
    const nextDifficulty = getDifficultyName(); // This will be for the NEXT level after we advance
    
    // Scale fonts
    const titleSize = Math.max(36, Math.min(64, dimensions.width / 12));
    const subtitleSize = Math.max(20, Math.min(36, dimensions.width / 22));
    const textSize = Math.max(16, Math.min(24, dimensions.width / 35));
    
    // Golden celebration overlay with radial gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, dimensions.width * 0.6);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.25)');
    gradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.15)');
    gradient.addColorStop(1, 'rgba(230, 57, 70, 0.05)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Multiple pulse effects for sparkle
    const pulse1 = Math.sin(totalTime * 4) * 0.3 + 0.7;
    const pulse2 = Math.cos(totalTime * 3) * 0.2 + 0.8;
    const pulse3 = Math.sin(totalTime * 5) * 0.25 + 0.75;
    
    ctx.textAlign = 'center';
    
    // Floating celebration hearts
    ctx.save();
    ctx.font = `${titleSize * 0.5}px Arial`;
    ctx.globalAlpha = pulse3 * 0.7;
    const heartOffsets = [
        { x: -titleSize * 2.5, y: -titleSize * 1.5, delay: 0 },
        { x: titleSize * 2.5, y: -titleSize * 1.5, delay: 0.3 },
        { x: -titleSize * 3, y: titleSize * 0.5, delay: 0.6 },
        { x: titleSize * 3, y: titleSize * 0.5, delay: 0.9 }
    ];
    heartOffsets.forEach(({ x, y, delay }) => {
        const heartPulse = Math.sin((totalTime + delay) * 4) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = heartPulse * 0.6;
        ctx.fillStyle = '#FF69B4';
        ctx.fillText('💖', centerX + x, centerY + y);
        ctx.restore();
    });
    ctx.restore();
    
    // Animated celebration text with layered glow
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 40 * pulse1;
    ctx.globalAlpha = pulse1;
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `bold ${titleSize}px "Pacifico", cursive`;
    ctx.fillText('✨ LEVEL CLEARED! ✨', centerX, centerY - titleSize * 0.8);
    ctx.restore();
    
    // Secondary glow layer
    ctx.save();
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 30 * pulse2;
    ctx.globalAlpha = pulse2 * 0.8;
    ctx.fillStyle = '#FF1493';
    ctx.font = `bold ${titleSize}px "Pacifico", cursive`;
    ctx.fillText('✨ LEVEL CLEARED! ✨', centerX, centerY - titleSize * 0.8);
    ctx.restore();
    
    // Level number with hearts
    ctx.save();
    ctx.globalAlpha = pulse2;
    ctx.shadowColor = '#FF69B4';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FF1493'; // Deep Pink
    ctx.font = `bold ${subtitleSize * 1.1}px "Quicksand", sans-serif`;
    ctx.fillText(`💕 Level ${level} Complete 💕`, centerX, centerY + subtitleSize * 0.2);
    ctx.restore();
    
    // Encouraging message with script font
    ctx.save();
    ctx.fillStyle = '#FFB6C1'; // Light Pink
    ctx.font = `italic ${subtitleSize * 0.9}px "Dancing Script", cursive`;
    ctx.shadowColor = '#FFB6C1';
    ctx.shadowBlur = 10;
    ctx.fillText('Love conquers all!', centerX, centerY + subtitleSize * 1.3);
    ctx.restore();
    
    // Score display box
    const scoreBoxY = centerY + subtitleSize * 2.2;
    ctx.save();
    ctx.fillStyle = 'rgba(147, 112, 219, 0.3)';
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#9370DB';
    ctx.shadowBlur = 10;
    const boxWidth = dimensions.width * 0.4;
    const boxHeight = textSize * 2;
    ctx.fillRect(centerX - boxWidth / 2, scoreBoxY - textSize, boxWidth, boxHeight);
    ctx.strokeRect(centerX - boxWidth / 2, scoreBoxY - textSize, boxWidth, boxHeight);
    ctx.restore();
    
    // Current score
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `bold ${textSize * 1.1}px "Quicksand", sans-serif`;
    ctx.fillText(`Score: ${formatScore(score)}`, centerX, scoreBoxY + textSize * 0.1);
    ctx.restore();
    
    // Next level preview with animation
    ctx.save();
    ctx.globalAlpha = pulse1;
    ctx.shadowColor = '#FF69B4';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FF69B4';
    ctx.font = `bold ${textSize}px "Quicksand", sans-serif`;
    ctx.fillText(`Get ready for Level ${nextLevelNum}...`, centerX, centerY + subtitleSize * 4);
    ctx.restore();
    
    // Show next difficulty hint with icon
    ctx.fillStyle = '#9370DB';
    ctx.font = `italic ${textSize * 0.85}px "Quicksand", sans-serif`;
    ctx.fillText('💘 Hearts will move faster! 💘', centerX, centerY + subtitleSize * 5);
}

/**
 * Render game over screen
 */
function renderGameOverScreen() {
    const dimensions = getGameDimensions();
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const score = getScore();
    const highScore = getHighScore();
    const level = getLevel();
    const isNewHighScore = score === highScore && score > 0;
    const gameOverReason = getGameOverReason();
    
    // Scale fonts
    const titleSize = Math.max(40, Math.min(68, dimensions.width / 11));
    const subtitleSize = Math.max(22, Math.min(40, dimensions.width / 20));
    const textSize = Math.max(18, Math.min(28, dimensions.width / 30));
    const smallTextSize = Math.max(16, Math.min(24, dimensions.width / 35));
    
    ctx.textAlign = 'center';
    
    // Dramatic vignette overlay for "heartbreak" effect
    const vignetteGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, dimensions.width * 0.7);
    vignetteGradient.addColorStop(0, 'rgba(230, 57, 70, 0.15)');
    vignetteGradient.addColorStop(0.6, 'rgba(123, 40, 105, 0.25)');
    vignetteGradient.addColorStop(1, 'rgba(26, 0, 31, 0.4)');
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Pulsing heartbreak animation
    const pulse = Math.sin(totalTime * 2) * 0.2 + 0.85;
    const slowPulse = Math.sin(totalTime * 1.5) * 0.15 + 0.85;
    
    // Broken hearts floating in background
    ctx.save();
    ctx.font = `${titleSize * 0.5}px Arial`;
    ctx.globalAlpha = slowPulse * 0.3;
    ctx.fillStyle = '#FF1493';
    const brokenHeartPositions = [
        { x: centerX - titleSize * 3, y: centerY - titleSize * 2 },
        { x: centerX + titleSize * 3, y: centerY - titleSize * 2 },
        { x: centerX - titleSize * 2.5, y: centerY + titleSize * 1.5 },
        { x: centerX + titleSize * 2.5, y: centerY + titleSize * 1.5 }
    ];
    brokenHeartPositions.forEach(pos => {
        ctx.fillText('💔', pos.x, pos.y);
    });
    ctx.restore();
    
    // Main title with broken heart and dramatic glow
    ctx.save();
    ctx.shadowColor = '#FF1493';
    ctx.shadowBlur = 30 * pulse;
    ctx.fillStyle = '#FF1493'; // Deep Pink
    ctx.font = `bold ${titleSize}px "Pacifico", cursive`;
    ctx.fillText('💔 HEARTBROKEN! 💔', centerX, centerY - titleSize * 1.5);
    
    // Secondary glow layer
    ctx.shadowColor = '#E63946';
    ctx.shadowBlur = 20 * pulse;
    ctx.fillText('💔 HEARTBROKEN! 💔', centerX, centerY - titleSize * 1.5);
    ctx.restore();
    
    // Game over subtitle with specific reason
    ctx.save();
    ctx.fillStyle = '#FFB6C1'; // Light Pink
    ctx.font = `${textSize * 1.1}px "Dancing Script", cursive`;
    ctx.shadowColor = '#FFB6C1';
    ctx.shadowBlur = 8;
    
    if (gameOverReason === 'invasion') {
        ctx.fillText('The hearts reached you!', centerX, centerY - titleSize * 0.7);
    } else if (gameOverReason === 'lives') {
        ctx.fillText('Cupid\'s arrows have run out...', centerX, centerY - titleSize * 0.7);
    } else {
        ctx.fillText('Game Over', centerX, centerY - titleSize * 0.7);
    }
    ctx.restore();
    
    // Stats box with elegant styling
    const boxWidth = dimensions.width * 0.65;
    const boxHeight = subtitleSize * 5;
    const boxX = centerX - boxWidth / 2;
    const boxY = centerY - subtitleSize * 1.5;
    
    // Background with gradient
    ctx.save();
    const boxGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    boxGradient.addColorStop(0, 'rgba(147, 112, 219, 0.25)');
    boxGradient.addColorStop(1, 'rgba(230, 57, 70, 0.2)');
    ctx.fillStyle = boxGradient;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    
    // Glowing border
    ctx.shadowColor = '#9370DB';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = '#9370DB';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.restore();
    
    // Final Score with emphasis
    ctx.save();
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFD700'; // Gold
    ctx.font = `bold ${subtitleSize}px "Quicksand", sans-serif`;
    ctx.fillText(`Final Score: ${formatScore(score)}`, centerX, centerY + subtitleSize * 0.2);
    ctx.restore();
    
    // Level reached
    ctx.save();
    ctx.fillStyle = '#FFB6C1';
    ctx.font = `600 ${textSize}px "Quicksand", sans-serif`;
    ctx.fillText(`Level Reached: ${level}`, centerX, centerY + subtitleSize * 1.4);
    ctx.restore();
    
    // High score celebration or display
    if (isNewHighScore) {
        // Confetti effect for new high score
        ctx.save();
        ctx.font = `${textSize * 0.7}px Arial`;
        const confettiColors = ['#FFD700', '#FF1493', '#FF69B4', '#9370DB'];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = subtitleSize * 1.2;
            const x = centerX + Math.cos(angle + totalTime * 2) * distance;
            const y = centerY + subtitleSize * 2.3 + Math.sin(angle + totalTime * 2) * distance;
            ctx.fillStyle = confettiColors[i % confettiColors.length];
            ctx.globalAlpha = pulse * 0.7;
            ctx.fillText(['✨', '⭐', '💫', '🌟'][i % 4], x, y);
        }
        ctx.restore();
        
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${subtitleSize * 0.9}px "Pacifico", cursive`;
        ctx.fillText('🎉 NEW HIGH SCORE! 🎉', centerX, centerY + subtitleSize * 2.8);
        ctx.restore();
    } else if (highScore > 0) {
        ctx.save();
        ctx.fillStyle = '#9370DB';
        ctx.font = `${textSize * 0.95}px "Quicksand", sans-serif`;
        ctx.fillText(`High Score: ${formatScore(highScore)}`, centerX, centerY + subtitleSize * 2.8);
        ctx.restore();
    }
    
    // Restart instruction with animated pulse
    const restartY = dimensions.height - titleSize * 1.8;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowColor = '#FF69B4';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FF1493'; // Deep Pink
    ctx.font = `bold ${textSize * 1.1}px "Quicksand", sans-serif`;
    ctx.fillText('Press ENTER to Try Again', centerX, restartY);
    ctx.restore();
    
    // Encouraging message with heart
    ctx.save();
    ctx.fillStyle = '#FFB6C1';
    ctx.font = `italic ${smallTextSize}px "Dancing Script", cursive`;
    ctx.globalAlpha = slowPulse;
    ctx.shadowColor = '#FFB6C1';
    ctx.shadowBlur = 8;
    ctx.fillText('💕 Love never gives up! 💕', centerX, dimensions.height - smallTextSize * 1.5);
    ctx.restore();
    
    // Additional motivational quotes (rotates based on score)
    const motivationalQuotes = [
        'Every heart is worth fighting for!',
        'Cupid believes in second chances!',
        'Love is patient, love is kind... try again!',
        'The arrow of love never misses twice!',
        'Hearts are meant to be won!'
    ];
    const quoteIndex = Math.floor(score / 1000) % motivationalQuotes.length;
    
    ctx.save();
    ctx.fillStyle = '#9370DB';
    ctx.font = `italic ${smallTextSize * 0.8}px "Quicksand", sans-serif`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(motivationalQuotes[quoteIndex], centerX, dimensions.height - smallTextSize * 0.3);
    ctx.restore();
}

// Start the game when the page loads
init();
