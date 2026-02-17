/**
 * Renderer - Handles all canvas drawing for Valentine's Space Invaders
 * Renders game entities, HUD, and UI overlays
 */

const Renderer = {
  canvas: null,
  ctx: null,
  config: null,

  /**
   * Initialize the renderer with canvas and configuration
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on
   * @param {Object} config - Game configuration object
   */
  init(canvas, config) {
    if (!canvas) {
      console.error('Renderer.init: Canvas element not provided');
      return false;
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = config;

    if (!this.ctx) {
      console.error('Renderer.init: Could not get 2D context from canvas');
      return false;
    }

    console.log(`Renderer initialized: ${config.canvas.width}x${config.canvas.height}`);
    return true;
  },

  /**
   * Clear the canvas with background color
   */
  clear() {
    const { colors, canvas } = this.config;
    
    // Fill canvas with light pink background
    this.ctx.fillStyle = colors.backgroundColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  },

  /**
   * Main drawing method called each frame
   * Draws all game elements in proper order
   * @param {Object} gameEntities - Contains {player, enemies, enemyBullets, playerBullets, particles}
   * @param {Object} gameState - Current game state
   */
  drawGame(gameEntities, gameState) {
    this.clear();
    
    // Draw background decorations first
    this.drawBackgroundDecorations();

    // Draw game elements in order (back to front)
    if (gameEntities.enemies) {
      this.drawEnemies(gameEntities.enemies);
    }

    if (gameEntities.player) {
      this.drawPlayer(gameEntities.player);
    }

    if (gameEntities.playerBullets || gameEntities.enemyBullets) {
      this.drawBullets(
        gameEntities.playerBullets || [],
        gameEntities.enemyBullets || []
      );
    }

    if (gameEntities.particles) {
      this.drawParticles(gameEntities.particles);
    }

    /* 
       Drawing HUD and overlays on canvas is now handled by HTML/CSS for a better Valentine's UI.
       See index.html and style.css.
    */
  },

  /**
   * Draw the player ship
   * @param {Object} player - Player entity with x, y, width, height, invulnerableFrames
   */
  drawPlayer(player) {
    const { colors } = this.config;
    
    // Draw invulnerability effect if applicable
    if (player.invulnerableFrames > 0) {
      const flashAlpha = Math.sin(player.invulnerableFrames * 0.2) * 0.3 + 0.3;
      this.ctx.globalAlpha = 0.5 + flashAlpha * 0.5;
    }

    // Draw player as heart shape
    this.drawHeart(
      player.x + player.width / 2,
      player.y + player.height / 2,
      player.width * 0.6,
      colors.playerColor
    );

    this.ctx.globalAlpha = 1;
  },

  /**
   * Draw all enemy ships
   * @param {Array} enemies - Array of enemy entities
   */
  drawEnemies(enemies) {
    const { colors } = this.config;
    
    for (let enemy of enemies) {
      if (enemy.alive) {
        this.drawCupid(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.width,
          colors.enemyColor
        );
      }
    }
  },

  /**
   * Draw all bullets
   * @param {Array} playerBullets - Player bullets (moving upward)
   * @param {Array} enemyBullets - Enemy bullets (moving downward)
   */
  drawBullets(playerBullets, enemyBullets) {
    const { colors } = this.config;

    // Draw player bullets as small hearts
    for (let bullet of playerBullets) {
      if (bullet.active) {
        this.drawHeart(
          bullet.x + bullet.width / 2,
          bullet.y + bullet.height / 2,
          bullet.width + 2,
          colors.bulletColor
        );
      }
    }

    // Draw enemy bullets as arrows
    for (let bullet of enemyBullets) {
      if (bullet.active) {
        this.drawArrow(
          bullet.x + bullet.width / 2,
          bullet.y + bullet.height / 2,
          bullet.width + 1,
          '#ffb3d9'
        );
      }
    }
  },

  /**
   * Draw all particles
   * @param {Array} particles - Array of particle entities
   */
  drawParticles(particles) {
    for (let particle of particles) {
      if (particle.active) {
        // Calculate opacity based on remaining lifetime
        const opacity = particle.lifetime / particle.maxLifetime;
        this.ctx.globalAlpha = opacity;

        // Draw particle as small circle
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
    }

    this.ctx.globalAlpha = 1;
  },

  /**
   * Draw the heads-up display (HUD)
   * @param {Object} gameState - Game state with score, lives, wave
   */
  drawHUD(gameState) {
    const { colors, canvas } = this.config;
    const padding = 20;
    const fontSize = 24;

    this.ctx.fillStyle = colors.textColor;
    this.ctx.font = `bold ${fontSize}px Arial`;

    // Score in top-left
    this.ctx.textAlign = 'left';
    this.drawText(
      `Score: ${gameState.score}`,
      padding,
      padding + fontSize,
      fontSize,
      colors.textColor,
      'left'
    );

    // Lives in top-center
    this.ctx.textAlign = 'center';
    const livesText = `Lives: ${gameState.lives}`;
    this.drawText(
      livesText,
      canvas.width / 2,
      padding + fontSize,
      fontSize,
      colors.textColor,
      'center'
    );

    // Wave in top-right
    this.ctx.textAlign = 'right';
    this.drawText(
      `Wave: ${gameState.wave}`,
      canvas.width - padding,
      padding + fontSize,
      fontSize,
      colors.textColor,
      'right'
    );
  },

  /**
   * Draw game over screen
   * @param {Object} gameState - Game state with final score
   */
  drawGameOver(gameState) {
    const { canvas, colors } = this.config;

    // Semi-transparent dark overlay
    this.ctx.globalAlpha = 0.6;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.globalAlpha = 1;

    // GAME OVER text
    this.drawText(
      'GAME OVER',
      canvas.width / 2,
      canvas.height / 2 - 60,
      60,
      colors.accent,
      'center'
    );

    // Final score
    this.drawText(
      `Final Score: ${gameState.score}`,
      canvas.width / 2,
      canvas.height / 2 + 20,
      32,
      colors.textColor,
      'center'
    );

    // Restart instruction
    this.drawText(
      'Press R to Restart',
      canvas.width / 2,
      canvas.height / 2 + 80,
      24,
      colors.textColor,
      'center'
    );
  },

  /**
   * Draw pause screen overlay
   */
  drawPauseScreen() {
    const { canvas, colors } = this.config;

    // Semi-transparent overlay
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.globalAlpha = 1;

    // PAUSED text
    this.drawText(
      'PAUSED',
      canvas.width / 2,
      canvas.height / 2 - 40,
      56,
      colors.accent,
      'center'
    );

    // Pause instruction
    this.drawText(
      'Press P to Resume',
      canvas.width / 2,
      canvas.height / 2 + 50,
      24,
      colors.textColor,
      'center'
    );
  },

  /**
   * Draw subtle background decorations
   * Small scattered hearts in very light colors
   */
  drawBackgroundDecorations() {
    const { canvas, colors } = this.config;
    
    this.ctx.globalAlpha = 0.08;
    this.ctx.fillStyle = colors.primary;

    // Draw subtle hearts in a grid pattern
    const spacing = 120;
    const heartSize = 20;

    for (let x = heartSize; x < canvas.width; x += spacing) {
      for (let y = heartSize; y < canvas.height; y += spacing) {
        this.drawHeart(x, y, heartSize, colors.primary);
      }
    }

    this.ctx.globalAlpha = 1;
  },

  /**
   * Draw text utility
   * @param {string} text - Text to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} fontSize - Font size in pixels
   * @param {string} color - Text color
   * @param {string} align - Text alignment ('left', 'center', 'right')
   */
  drawText(text, x, y, fontSize, color, align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${fontSize}px Arial`;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x, y);
  },

  /**
   * Draw a heart shape at specified position
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} size - Size of heart (roughly diameter)
   * @param {string} color - Heart color
   */
  drawHeart(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    // Heart shape using bezier curves
    const w = size;
    const h = size;

    // Top two bumps
    this.ctx.moveTo(x - w * 0.5, y - h * 0.3);
    this.ctx.bezierCurveTo(
      x - w * 0.7, y - h * 0.6,
      x - w * 0.8, y - h * 0.3,
      x - w * 0.4, y + h * 0.1
    );

    this.ctx.bezierCurveTo(
      x, y + h * 0.5,
      x, y + h * 0.5,
      x, y + h * 0.5
    );

    this.ctx.bezierCurveTo(
      x, y + h * 0.5,
      x + w * 0.4, y + h * 0.1,
      x + w * 0.8, y - h * 0.3
    );

    this.ctx.bezierCurveTo(
      x + w * 0.7, y - h * 0.6,
      x + w * 0.5, y - h * 0.3,
      x, y - h * 0.1
    );

    this.ctx.closePath();
    this.ctx.fill();
  },

  /**
   * Draw a Cupid enemy shape
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} size - Size of Cupid
   * @param {string} color - Cupid color
   */
  drawCupid(x, y, size, color) {
    this.ctx.fillStyle = color;

    // Head (circle)
    const headRadius = size * 0.35;
    this.ctx.beginPath();
    this.ctx.arc(x, y - size * 0.2, headRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Body (circle below head)
    const bodyRadius = size * 0.4;
    this.ctx.beginPath();
    this.ctx.arc(x, y + size * 0.1, bodyRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Wings (two curved shapes on sides)
    this.ctx.beginPath();
    // Left wing
    this.ctx.ellipse(x - size * 0.5, y, size * 0.25, size * 0.3, -0.3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.beginPath();
    // Right wing
    this.ctx.ellipse(x + size * 0.5, y, size * 0.25, size * 0.3, 0.3, 0, Math.PI * 2);
    this.ctx.fill();

    // Simple face (eyes)
    const eyeRadius = size * 0.1;
    this.ctx.fillStyle = '#fff';
    
    // Left eye
    this.ctx.beginPath();
    this.ctx.arc(x - headRadius * 0.4, y - size * 0.3, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Right eye
    this.ctx.beginPath();
    this.ctx.arc(x + headRadius * 0.4, y - size * 0.3, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();
  },

  /**
   * Draw an arrow shape for enemy bullets
   * @param {number} x - Center X position
   * @param {number} y - Center Y position
   * @param {number} size - Size of arrow
   * @param {string} color - Arrow color
   */
  drawArrow(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    // Pointing downward arrow
    const w = size;
    const h = size * 1.2;

    // Arrow tip (bottom point)
    this.ctx.moveTo(x, y + h * 0.5);

    // Left side of shaft
    this.ctx.lineTo(x - w * 0.3, y - h * 0.3);

    // Left arrowhead inner
    this.ctx.lineTo(x - w * 0.15, y - h * 0.1);

    // Right side inner
    this.ctx.lineTo(x, y);

    // Right arrowhead inner
    this.ctx.lineTo(x + w * 0.15, y - h * 0.1);

    // Right side of shaft
    this.ctx.lineTo(x + w * 0.3, y - h * 0.3);

    this.ctx.closePath();
    this.ctx.fill();
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Renderer;
}
