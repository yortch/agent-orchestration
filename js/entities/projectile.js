/**
 * Projectile module for Valentine's Space Invaders
 * Manages player and enemy bullets with collision detection support
 */

class PlayerBullet {
  constructor(x, y, speed = 7) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 15;
    this.velocityY = -speed; // Negative = upward movement
    this.active = true;
    this.type = 'player';
  }

  update(config) {
    // Move bullet upward
    this.y += this.velocityY;
    
    // Mark inactive if off-screen (above top)
    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  isActive() {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }
}

class EnemyBullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 4;
    this.height = 10;
    this.velocityY = 4; // Positive = downward movement
    this.active = true;
    this.type = 'enemy';
  }

  update(config) {
    // Move bullet downward
    this.y += this.velocityY;
    
    // Mark inactive if off-screen (below bottom)
    if (this.y > config.canvas.height) {
      this.active = false;
    }
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  isActive() {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }
}

// Bullet management system
const BulletManager = {
  playerBullets: [],
  enemyBullets: [],

  addPlayerBullet(bullet) {
    this.playerBullets.push(bullet);
  },

  addEnemyBullet(bullet) {
    this.enemyBullets.push(bullet);
  },

  updateAll(config) {
    // Update all player bullets and remove inactive ones
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      this.playerBullets[i].update(config);
      if (!this.playerBullets[i].isActive()) {
        this.playerBullets.splice(i, 1);
      }
    }

    // Update all enemy bullets and remove inactive ones
    for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
      this.enemyBullets[i].update(config);
      if (!this.enemyBullets[i].isActive()) {
        this.enemyBullets.splice(i, 1);
      }
    }
  },

  getPlayerBullets() {
    return this.playerBullets;
  },

  getEnemyBullets() {
    return this.enemyBullets;
  },

  clear() {
    this.playerBullets = [];
    this.enemyBullets = [];
  }
};

// Module exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PlayerBullet, EnemyBullet, BulletManager };
}
