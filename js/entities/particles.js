/**
 * Particle System for Valentine's Space Invaders
 * Handles particle effects for explosions, hearts, and confetti
 */

/**
 * Particle - Individual particle object
 */
class Particle {
  /**
   * Create a particle
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} velocityX - Velocity in x direction
   * @param {number} velocityY - Velocity in y direction
   * @param {number} lifetime - Lifetime in frames
   * @param {string} color - Color of the particle
   * @param {number} size - Size of the particle
   */
  constructor(x, y, velocityX, velocityY, lifetime, color, size) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.color = color;
    this.size = size;
    this.active = true;
  }

  /**
   * Update particle position and lifetime
   */
  update() {
    if (!this.active) return;

    // Move particle
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Apply gravity (gentle downward pull)
    this.velocityY += 0.1;

    // Decrement lifetime
    this.lifetime--;

    // Deactivate if lifetime expired
    if (this.lifetime <= 0) {
      this.active = false;
    }
  }

  /**
   * Check if particle is active
   * @returns {boolean} True if particle is active
   */
  isActive() {
    return this.active && this.lifetime > 0;
  }

  /**
   * Deactivate the particle
   */
  deactivate() {
    this.active = false;
  }

  /**
   * Calculate opacity based on remaining lifetime
   * @returns {number} Opacity value between 0 and 1
   */
  getOpacity() {
    return Math.max(0, this.lifetime / this.maxLifetime);
  }
}

/**
 * ParticleEmitter - Creates particle effects
 */
class ParticleEmitter {
  /**
   * Create an explosion effect with heart-shaped particles
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {object} config - Game configuration
   * @returns {array} Array of Particle objects
   */
  static createExplosion(x, y, config) {
    const particles = [];
    const particleCount = 12;
    const speed = 3;
    const lifetime = 60;
    const colors = ['#e91e63', '#ff69b4', '#ff1744', '#ff6ec7'];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push(
        new Particle(x, y, vx, vy, lifetime, color, 4)
      );
    }

    return particles;
  }

  /**
   * Create a heart burst effect - multiple hearts bursting outward
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {object} config - Game configuration
   * @returns {array} Array of Particle objects
   */
  static createHeartBurst(x, y, config) {
    const particles = [];
    const particleCount = 8;
    const speed = 4;
    const lifetime = 80;
    const colors = ['#ff1744', '#e91e63', '#ff69b4'];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push(
        new Particle(x, y, vx, vy, lifetime, color, 6)
      );
    }

    return particles;
  }

  /**
   * Create confetti effect - mixed Valentine's themed particles
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {object} config - Game configuration
   * @returns {array} Array of Particle objects
   */
  static createConfetti(x, y, config) {
    const particles = [];
    const particleCount = 20;
    const lifetime = 100;
    const colors = ['#e91e63', '#ff69b4', '#ff1744', '#ff6ec7', '#fff'];
    const sizes = [3, 4, 5, 6];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 2;
      const vx = Math.cos(angle) * speed;
      const vy = (Math.random() - 0.7) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      particles.push(
        new Particle(x, y, vx, vy, lifetime, color, size)
      );
    }

    return particles;
  }

  /**
   * Create sparkle particles
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {object} config - Game configuration
   * @returns {array} Array of Particle objects
   */
  static createSparkles(x, y, config) {
    const particles = [];
    const particleCount = 6;
    const speed = 2;
    const lifetime = 40;
    const colors = ['#fff', '#ff69b4', '#ff6ec7'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particles.push(
        new Particle(x, y, vx, vy, lifetime, color, 2)
      );
    }

    return particles;
  }
}

/**
 * ParticleManager - Manages all active particles
 */
const ParticleManager = {
  particles: [],

  /**
   * Add particles from an emitter
   * @param {array} particleArray - Array of Particle objects to add
   */
  addParticles(particleArray) {
    if (Array.isArray(particleArray)) {
      this.particles.push(...particleArray);
    }
  },

  /**
   * Update all active particles and remove inactive ones
   */
  updateAll() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();

      if (!this.particles[i].isActive()) {
        this.particles.splice(i, 1);
      }
    }
  },

  /**
   * Get all active particles for rendering
   * @returns {array} Array of active Particle objects
   */
  getParticles() {
    return this.particles.filter(p => p.isActive());
  },

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  },

  /**
   * Convenience method to emit particles by type
   * @param {string} emitterType - Type of emitter: 'explosion', 'heartburst', 'confetti', 'sparkles'
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {object} config - Game configuration
   */
  emit(emitterType, x, y, config) {
    let particles = [];

    switch (emitterType) {
      case 'explosion':
        particles = ParticleEmitter.createExplosion(x, y, config);
        break;
      case 'heartburst':
        particles = ParticleEmitter.createHeartBurst(x, y, config);
        break;
      case 'confetti':
        particles = ParticleEmitter.createConfetti(x, y, config);
        break;
      case 'sparkles':
        particles = ParticleEmitter.createSparkles(x, y, config);
        break;
      default:
        console.warn(`Unknown emitter type: ${emitterType}`);
        return;
    }

    this.addParticles(particles);
  },

  /**
   * Get particle count for debugging
   * @returns {number} Number of active particles
   */
  getParticleCount() {
    return this.particles.length;
  },

  /**
   * Initialize the particle manager
   */
  init() {
    this.clear();
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Particle, ParticleEmitter, ParticleManager };
}
