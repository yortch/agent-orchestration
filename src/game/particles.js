/**
 * particles.js
 * Particle system for visual effects (enemy hits, shield damage, player hits, score popups, celebrations)
 * Manages particle lifecycles, spawning presets, and updates with object pooling for performance
 */

import { getEntities } from './entities.js';
import { getGameDimensions } from '../canvas/resize.js';

// ========================================
// PARTICLE CONFIGURATION
// ========================================
const PARTICLE_CONFIG = {
    MAX_PARTICLES: 300, // Performance cap - oldest particles culled when exceeded
    POOL_SIZE: 100, // Pre-allocated particle pool size for performance
    
    // Enemy hit particles (hearts + sparkles bursting outward)
    ENEMY_HIT: {
        COUNT_MIN: 8,
        COUNT_MAX: 15,
        SIZE_MIN: 4,
        SIZE_MAX: 10,
        SPEED_MIN: 80,
        SPEED_MAX: 180,
        LIFETIME_MIN: 0.4,
        LIFETIME_MAX: 0.9,
        TYPES: ['heart', 'sparkle', 'sparkle', 'mini-heart'], // More sparkles than hearts
    },
    
    // Shield hit particles (confetti/paper debris)
    SHIELD_HIT: {
        COUNT_MIN: 4,
        COUNT_MAX: 8,
        SIZE_MIN: 3,
        SIZE_MAX: 7,
        SPEED_MIN: 60,
        SPEED_MAX: 120,
        LIFETIME_MIN: 0.3,
        LIFETIME_MAX: 0.7,
        TYPES: ['confetti', 'debris'],
    },
    
    // Player hit particles (explosion burst)
    PLAYER_HIT: {
        COUNT_MIN: 15,
        COUNT_MAX: 25,
        SIZE_MIN: 5,
        SIZE_MAX: 12,
        SPEED_MIN: 100,
        SPEED_MAX: 250,
        LIFETIME_MIN: 0.5,
        LIFETIME_MAX: 1.2,
        TYPES: ['heart', 'sparkle', 'explosion', 'sparkle'], // Mix of types
    },
    
    // Score popup particles (floating numbers)
    SCORE_POPUP: {
        LIFETIME: 1.2,
        RISE_SPEED: 40, // Pixels per second upward
        SIZE: 16, // Font size
        FADE_START: 0.6, // Start fading at 60% of lifetime
    },
    
    // Level celebration particles (screen-wide burst)
    CELEBRATION: {
        COUNT: 50, // Total particles for celebration
        SIZE_MIN: 6,
        SIZE_MAX: 16,
        SPEED_MIN: 100,
        SPEED_MAX: 400,
        LIFETIME_MIN: 1.0,
        LIFETIME_MAX: 2.5,
        TYPES: ['heart', 'sparkle', 'mini-heart', 'sparkle', 'heart'], // Valentine-themed
    },
    
    // Physics
    GRAVITY: 120, // Downward acceleration (pixels per second squared)
    FRICTION: 0.98, // Velocity multiplier per frame (slight slowdown)
};

// Particle pool for performance (reuse instead of creating new objects)
const particlePool = [];

/**
 * Initialize particle pool for better performance
 */
function initParticlePool() {
    for (let i = 0; i < PARTICLE_CONFIG.POOL_SIZE; i++) {
        particlePool.push({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            velocityX: 0,
            velocityY: 0,
            type: '',
            lifetime: 0,
            age: 0,
            alive: false,
            hasGravity: false,
            text: '', // For score popups
            color: '', // For custom colors
            rotation: 0, // For spinning effects
            rotationSpeed: 0,
        });
    }
}

/**
 * Update all particles - move, age, and cull expired
 * @param {number} deltaTime - Time elapsed since last frame (in seconds)
 */
export function updateParticles(deltaTime) {
    const entities = getEntities();
    const particles = entities.particles;
    
    if (!particles || particles.length === 0) return;
    
    // Update each particle
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Age the particle
        particle.age += deltaTime;
        
        // Check if expired
        if (particle.age >= particle.lifetime) {
            particle.alive = false;
            continue;
        }
        
        // Update position based on velocity
        particle.x += particle.velocityX * deltaTime;
        particle.y += particle.velocityY * deltaTime;
        
        // Apply gravity (if enabled for this particle)
        if (particle.hasGravity) {
            particle.velocityY += PARTICLE_CONFIG.GRAVITY * deltaTime;
        }
        
        // Apply friction (only to non-score-popup particles)
        if (particle.type !== 'score') {
            particle.velocityX *= PARTICLE_CONFIG.FRICTION;
            particle.velocityY *= PARTICLE_CONFIG.FRICTION;
        }
        
        // Update rotation for spinning particles
        if (particle.rotationSpeed) {
            particle.rotation += particle.rotationSpeed * deltaTime;
        }
        
        // Fade out (calculated in draw.js based on age/lifetime ratio)
    }
    
    // Cleanup dead particles happens in entities.js cleanupDeadEntities()
    
    // Enforce max particle limit (cull oldest if exceeded)
    if (particles.length > PARTICLE_CONFIG.MAX_PARTICLES) {
        const excess = particles.length - PARTICLE_CONFIG.MAX_PARTICLES;
        particles.splice(0, excess); // Remove oldest particles from beginning
    }
}

/**
 * Spawn particles for enemy hit effect
 * Hearts and sparkles burst outward from the hit position
 * @param {number} x - X position of enemy
 * @param {number} y - Y position of enemy
 */
export function spawnEnemyHitParticles(x, y) {
    const cfg = PARTICLE_CONFIG.ENEMY_HIT;
    const count = randomInt(cfg.COUNT_MIN, cfg.COUNT_MAX);
    
    for (let i = 0; i < count; i++) {
        // Random angle for burst effect (full 360 degrees)
        const angle = Math.random() * Math.PI * 2;
        const speed = randomFloat(cfg.SPEED_MIN, cfg.SPEED_MAX);
        
        // Calculate velocity from angle and speed
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        
        // Choose random particle type from preset
        const type = cfg.TYPES[Math.floor(Math.random() * cfg.TYPES.length)];
        
        createParticleInternal({
            x: x,
            y: y,
            velocityX: velocityX,
            velocityY: velocityY,
            type: type,
            size: randomFloat(cfg.SIZE_MIN, cfg.SIZE_MAX),
            lifetime: randomFloat(cfg.LIFETIME_MIN, cfg.LIFETIME_MAX),
            hasGravity: false, // Float freely for enemy hits
        });
    }
}

/**
 * Spawn particles for shield hit effect
 * Paper confetti/debris falls downward from the hit position
 * @param {number} x - X position of shield block
 * @param {number} y - Y position of shield block
 */
export function spawnShieldHitParticles(x, y) {
    const cfg = PARTICLE_CONFIG.SHIELD_HIT;
    const count = randomInt(cfg.COUNT_MIN, cfg.COUNT_MAX);
    
    for (let i = 0; i < count; i++) {
        // Spread horizontally with slight upward initial velocity
        const velocityX = (Math.random() - 0.5) * cfg.SPEED_MAX;
        const velocityY = randomFloat(-cfg.SPEED_MIN, cfg.SPEED_MIN * 0.5);
        
        // Choose random particle type from preset
        const type = cfg.TYPES[Math.floor(Math.random() * cfg.TYPES.length)];
        
        createParticleInternal({
            x: x,
            y: y,
            velocityX: velocityX,
            velocityY: velocityY,
            type: type,
            size: randomFloat(cfg.SIZE_MIN, cfg.SIZE_MAX),
            lifetime: randomFloat(cfg.LIFETIME_MIN, cfg.LIFETIME_MAX),
            hasGravity: true, // Paper falls down
        });
    }
}

/**
 * Spawn particles for player hit effect
 * Large explosion burst with mix of hearts, sparkles, and debris
 * @param {number} x - X position of player
 * @param {number} y - Y position of player
 */
export function spawnPlayerHitParticles(x, y) {
    const cfg = PARTICLE_CONFIG.PLAYER_HIT;
    const count = randomInt(cfg.COUNT_MIN, cfg.COUNT_MAX);
    
    for (let i = 0; i < count; i++) {
        // Full 360-degree burst pattern
        const angle = Math.random() * Math.PI * 2;
        const speed = randomFloat(cfg.SPEED_MIN, cfg.SPEED_MAX);
        
        // Higher speeds in outer ring for more dramatic effect
        const speedVariation = i < count / 2 ? 1.0 : 1.5;
        
        // Calculate velocity from angle and speed
        const velocityX = Math.cos(angle) * speed * speedVariation;
        const velocityY = Math.sin(angle) * speed * speedVariation;
        
        // Choose random particle type from preset
        const type = cfg.TYPES[Math.floor(Math.random() * cfg.TYPES.length)];
        
        createParticleInternal({
            x: x + (Math.random() - 0.5) * 10, // Small spread from center
            y: y + (Math.random() - 0.5) * 10,
            velocityX: velocityX,
            velocityY: velocityY,
            type: type,
            size: randomFloat(cfg.SIZE_MIN, cfg.SIZE_MAX),
            lifetime: randomFloat(cfg.LIFETIME_MIN, cfg.LIFETIME_MAX),
            hasGravity: type === 'debris', // Only debris falls
        });
    }
}

/**
 * Spawn a floating score popup at a position
 * Shows points earned from destroying an enemy
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} points - Points to display
 * @param {string} color - Color for the text (optional)
 */
export function spawnScorePopup(x, y, points, color = '#FFD700') {
    const cfg = PARTICLE_CONFIG.SCORE_POPUP;
    
    createParticleInternal({
        x: x,
        y: y,
        velocityX: 0,
        velocityY: -cfg.RISE_SPEED, // Float upward
        type: 'score',
        size: cfg.SIZE,
        lifetime: cfg.LIFETIME,
        hasGravity: false,
        text: `+${points}`,
        color: color,
        rotation: 0,
        rotationSpeed: 0,
    });
}

/**
 * Spawn celebration particles across the screen for level clear
 * Creates a romantic burst of hearts and sparkles
 */
export function spawnCelebrationParticles() {
    const cfg = PARTICLE_CONFIG.CELEBRATION;
    const dimensions = getGameDimensions();
    
    // Create particles from multiple spawn points across the top
    const spawnPoints = 5; // Number of spawn locations
    const particlesPerPoint = Math.ceil(cfg.COUNT / spawnPoints);
    
    for (let point = 0; point < spawnPoints; point++) {
        const spawnX = (dimensions.width / (spawnPoints + 1)) * (point + 1);
        const spawnY = dimensions.height * 0.3; // Spawn from upper part of screen
        
        for (let i = 0; i < particlesPerPoint; i++) {
            // Create a fountain/burst effect pointing slightly upward
            const angle = randomFloat(-Math.PI * 0.3, -Math.PI * 0.7); // Upward arc
            const speed = randomFloat(cfg.SPEED_MIN, cfg.SPEED_MAX);
            
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            
            // Choose random particle type from Valentine theme
            const type = cfg.TYPES[Math.floor(Math.random() * cfg.TYPES.length)];
            
            // Add slight horizontal spread
            const xOffset = (Math.random() - 0.5) * 100;
            
            createParticleInternal({
                x: spawnX + xOffset,
                y: spawnY,
                velocityX: velocityX,
                velocityY: velocityY,
                type: type,
                size: randomFloat(cfg.SIZE_MIN, cfg.SIZE_MAX),
                lifetime: randomFloat(cfg.LIFETIME_MIN, cfg.LIFETIME_MAX),
                hasGravity: true, // Hearts fall like confetti
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: randomFloat(-3, 3), // Spinning hearts
            });
        }
    }
    
    console.log(`🎉 Spawned ${cfg.COUNT} celebration particles!`);
}

/**
 * Internal function to create a single particle with full customization
 * Uses object pooling when possible for performance
 * @param {Object} params - Particle parameters
 */
function createParticleInternal(params) {
    const entities = getEntities();
    
    // Try to reuse a dead particle from the pool first
    let particle = null;
    for (let i = 0; i < entities.particles.length; i++) {
        if (!entities.particles[i].alive) {
            particle = entities.particles[i];
            break;
        }
    }
    
    // If no dead particle found, create new one (or reuse from pool if available)
    if (!particle) {
        if (particlePool.length > 0) {
            particle = particlePool.pop();
        } else {
            particle = {};
        }
        entities.particles.push(particle);
    }
    
    // Initialize/reset particle properties
    particle.x = params.x;
    particle.y = params.y;
    particle.width = params.size;
    particle.height = params.size;
    particle.velocityX = params.velocityX;
    particle.velocityY = params.velocityY;
    particle.type = params.type;
    particle.lifetime = params.lifetime;
    particle.age = 0;
    particle.alive = true;
    particle.hasGravity = params.hasGravity || false;
    particle.text = params.text || '';
    particle.color = params.color || '';
    particle.rotation = params.rotation || 0;
    particle.rotationSpeed = params.rotationSpeed || 0;
    
    return particle;
}

/**
 * Helper: Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Helper: Generate random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Initialize particle pool on module load
initParticlePool();
console.log('✨ Particle system initialized with pool of', PARTICLE_CONFIG.POOL_SIZE);
