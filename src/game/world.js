import { GameState } from "./state.js";
import { Bullet } from "./entities/bullet.js";
import { Player } from "./entities/player.js";
import { InvaderFormation } from "./invaderFormation.js";
import { EnemyFireControl } from "./enemyFireControl.js";
import { isAabbCollision, runOnCollision } from "./collision.js";
import { createScoreTracker } from "./score.js";
import { createLivesManager } from "./lives.js";
import { Particle } from "./entities/particle.js";

export function createWorld({ width, height, input, gameState, audio = null }) {
  const bullets = [];
  const particles = [];
  const playerSpawn = {
    x: width / 2 - 25,
    y: height - 70,
  };
  const player = new Player({
    x: playerSpawn.x,
    y: playerSpawn.y,
    worldWidth: width,
  });
  const formation = new InvaderFormation();
  const enemyFireControl = new EnemyFireControl();
  const scoreTracker = createScoreTracker();
  const lives = createLivesManager({
    startingLives: 3,
    invulnerabilitySeconds: 1.2,
  });

  let wave = 1;

  function applyWaveDifficulty() {
    formation.baseSpeed = Math.min(160, 36 + (wave - 1) * 8);
    enemyFireControl.minIntervalSeconds = Math.max(0.18, 0.5 - (wave - 1) * 0.03);
    enemyFireControl.maxIntervalSeconds = Math.max(0.45, 1.4 - (wave - 1) * 0.08);
    enemyFireControl.maxEnemyBullets = Math.min(8, 4 + Math.floor((wave - 1) / 2));
  }

  function resetPlayerPosition() {
    player.resetPosition(playerSpawn.x, playerSpawn.y);
  }

  function startWave(nextWave) {
    wave = nextWave;
    bullets.length = 0;
    formation.reset();
    applyWaveDifficulty();
    enemyFireControl.reset();
    resetPlayerPosition();
  }

  function spawnBullet({ x, y, velocityY, owner }) {
    bullets.push(
      new Bullet({
        x,
        y,
        velocityY,
        owner,
      }),
    );
  }

  function spawnPlayerBullet(x, y) {
    spawnBullet({ x, y, velocityY: -560, owner: "player" });
  }

  function spawnEnemyBullet(x, y) {
    spawnBullet({ x, y, velocityY: 280, owner: "enemy" });
  }

  function spawnHeartBurst(x, y) {
    const count = 6 + Math.floor(Math.random() * 3);

    for (let i = 0; i < count; i += 1) {
      const angle = ((Math.PI * 2) / count) * i + (Math.random() - 0.5) * 0.35;
      const speed = 80 + Math.random() * 110;

      particles.push(
        new Particle({
          x,
          y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          lifetime: 0.5 + Math.random() * 0.15,
          size: 4 + Math.random() * 2,
        }),
      );
    }
  }

  function countBulletsByOwner(owner) {
    return bullets.filter((bullet) => bullet.owner === owner && bullet.active).length;
  }

  function removeInactiveOrOffscreenBullets() {
    for (let i = bullets.length - 1; i >= 0; i -= 1) {
      const bullet = bullets[i];

      if (!bullet.active || bullet.isOffscreen(height)) {
        bullets.splice(i, 1);
      }
    }
  }

  function removeInactiveParticles() {
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      if (!particles[i].active) {
        particles.splice(i, 1);
      }
    }
  }

  function handlePlayerBulletHits() {
    for (const bullet of bullets) {
      if (!bullet.active || bullet.owner !== "player") {
        continue;
      }

      for (const invader of formation.invaders) {
        if (!invader.active) {
          continue;
        }

        if (!runOnCollision(bullet, invader, () => {
          bullet.destroy();
          invader.destroy();
          spawnHeartBurst(invader.x + invader.width / 2, invader.y + invader.height / 2);
          scoreTracker.addInvaderHit(invader);
          audio?.playHit?.();
        })) {
          continue;
        }
        break;
      }
    }
  }

  function handleEnemyBulletHits() {
    for (const bullet of bullets) {
      if (!bullet.active || bullet.owner !== "enemy") {
        continue;
      }

      if (!runOnCollision(bullet, player, () => {
        bullet.destroy();
      })) {
        continue;
      }
      const result = lives.registerHit();
      player.lives = lives.getLives();

      if (result.lostLife || result.gameOver) {
        audio?.playPlayerHit?.();
      }

      if (result.gameOver) {
        if (gameState.canTransition(GameState.GAME_OVER)) {
          gameState.transitionTo(GameState.GAME_OVER);
        }
        return;
      }

      if (result.lostLife) {
        resetPlayerPosition();
      }
    }
  }

  function update(deltaSeconds) {
    if (gameState.getState() !== GameState.PLAYING) {
      return;
    }

    lives.update(deltaSeconds);
    player.update(deltaSeconds, { input, world: api });
    formation.update(deltaSeconds, { worldWidth: width });

    if (formation.hasReachedBottom(player.y)) {
      if (gameState.canTransition(GameState.GAME_OVER)) {
        gameState.transitionTo(GameState.GAME_OVER);
      }
      return;
    }

    for (const bullet of bullets) {
      bullet.update(deltaSeconds);
    }

    for (const particle of particles) {
      particle.update(deltaSeconds);
    }

    enemyFireControl.update(deltaSeconds, { formation, world: api });
    handlePlayerBulletHits();
    handleEnemyBulletHits();

    if (formation.getAliveCount() === 0) {
      audio?.playWaveClear?.();
      startWave(wave + 1);
    }

    removeInactiveOrOffscreenBullets();
    removeInactiveParticles();
  }

  function render(context) {
    formation.render(context);
    player.render(context);

    for (const bullet of bullets) {
      bullet.render(context);
    }

    for (const particle of particles) {
      particle.render(context);
    }
  }

  function reset() {
    bullets.length = 0;
    particles.length = 0;
    scoreTracker.reset();
    lives.reset();
    player.lives = lives.getLives();
    startWave(1);
  }

  function getAliveInvaderCount() {
    return formation.getAliveCount();
  }

  function getInvaderBottom() {
    const bounds = formation.getBounds();
    return bounds ? bounds.bottom : 0;
  }

  function getAliveInvaders() {
    return formation.getAliveInvaders();
  }

  function getActiveBullets() {
    return bullets.filter((bullet) => bullet.active);
  }

  function getActiveParticles() {
    return particles.filter((particle) => particle.active);
  }

  function getFormationRows() {
    return formation.rows;
  }

  const api = {
    player,
    update,
    render,
    reset,
    get score() {
      return scoreTracker.getScore();
    },
    get wave() {
      return wave;
    },
    get lives() {
      return lives.getLives();
    },
    get isPlayerInvulnerable() {
      return lives.isInvulnerable();
    },
    getAliveInvaderCount,
    getInvaderBottom,
    getAliveInvaders,
    getActiveBullets,
    getActiveParticles,
    getFormationRows,
    audio,
    countBulletsByOwner,
    spawnPlayerBullet,
    spawnEnemyBullet,
  };

  return api;
}
