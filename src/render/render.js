import { GameState } from "../game/state.js";
import { drawPlayer } from "./drawPlayer.js";
import { drawInvader } from "./drawInvader.js";
import { drawBullet } from "./drawBullet.js";
import { drawHud } from "../ui/hud.js";
import { drawStartScreen, drawGameOverScreen } from "../ui/screens.js";

const BACKGROUND = "#2C001E";
const STAR_COLORS = ["rgba(255, 255, 255, 0.65)", "rgba(255, 245, 201, 0.55)"];

function createStars(width, height, count = 42) {
  const stars = [];

  for (let i = 0; i < count; i += 1) {
    stars.push({
      x: (i * 157) % width,
      y: (i * 89) % height,
      radius: 1 + (i % 3) * 0.4,
      phase: (i % 7) * 0.6,
      color: STAR_COLORS[i % STAR_COLORS.length],
    });
  }

  return stars;
}

export function createRenderer({ context, width, height, world, gameState, debugOverlay = null }) {
  let viewWidth = width;
  let viewHeight = height;
  let stars = createStars(width, height);
  let highScore = 0;

  function resize(nextWidth, nextHeight) {
    viewWidth = nextWidth;
    viewHeight = nextHeight;
    stars = createStars(nextWidth, nextHeight);
  }

  function drawBackdrop() {
    context.clearRect(0, 0, viewWidth, viewHeight);
    context.fillStyle = BACKGROUND;
    context.fillRect(0, 0, viewWidth, viewHeight);

    const pulseTick = performance.now() * 0.0035;
    for (const star of stars) {
      context.globalAlpha = 0.45 + 0.35 * Math.sin(pulseTick + star.phase);
      context.fillStyle = star.color;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
  }

  function drawStateOverlay() {
    const currentState = gameState.getState();

    if (currentState !== GameState.START && currentState !== GameState.GAME_OVER) {
      return;
    }

    if (currentState === GameState.START) {
      drawStartScreen(context, {
        width: viewWidth,
        height: viewHeight,
      });
    }

    if (currentState === GameState.GAME_OVER) {
      drawGameOverScreen(context, {
        width: viewWidth,
        height: viewHeight,
        score: world.score,
        highScore,
      });
    }
  }

  function drawEntities() {
    const invaders = world.getAliveInvaders();
    const bullets = world.getActiveBullets();
    const particles = world.getActiveParticles();
    const player = world.player;

    for (const invader of invaders) {
      drawInvader(context, invader, { totalRows: world.getFormationRows() });
    }

    for (const bullet of bullets) {
      drawBullet(context, bullet);
    }

    for (const particle of particles) {
      particle.render(context);
    }

    const invulnerable = world.isPlayerInvulnerable;
    const flashVisible = !invulnerable || Math.floor(performance.now() / 100) % 2 === 0;
    drawPlayer(context, player, { visible: flashVisible });
  }

  function render(frameInfo = {}) {
    if (debugOverlay) {
      debugOverlay.updateTiming(frameInfo.deltaSeconds ?? 0);
    }

    highScore = Math.max(highScore, world.score);
    drawBackdrop();
    drawEntities();

    if (debugOverlay) {
      debugOverlay.drawHitboxes(context, { world });
    }

    if (gameState.getState() === GameState.PLAYING) {
      drawHud(context, {
        width: viewWidth,
        score: world.score,
        lives: world.lives,
        wave: world.wave,
      });
    }

    drawStateOverlay();

    if (debugOverlay) {
      debugOverlay.drawOverlay(context, {
        width: viewWidth,
        height: viewHeight,
      });
    }
  }

  return {
    render,
    resize,
  };
}
