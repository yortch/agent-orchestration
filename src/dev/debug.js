function isRenderableCollidable(entity) {
  return Boolean(
    entity
      && entity.active
      && Number.isFinite(entity.x)
      && Number.isFinite(entity.y)
      && Number.isFinite(entity.width)
      && Number.isFinite(entity.height)
      && entity.width > 0
      && entity.height > 0,
  );
}

function formatCount(value) {
  return Number.isFinite(value) ? String(value) : "0";
}

function formatFps(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "0.0";
  }

  return value.toFixed(1);
}

function drawHitbox(context, entity, color) {
  if (!isRenderableCollidable(entity)) {
    return;
  }

  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.strokeRect(
    Math.floor(entity.x) + 0.5,
    Math.floor(entity.y) + 0.5,
    Math.max(1, Math.floor(entity.width)),
    Math.max(1, Math.floor(entity.height)),
  );
  context.restore();
}

export function createDebugOverlay({ world, gameState, getDpr = () => window.devicePixelRatio || 1 } = {}) {
  let enabled = false;
  let showHitboxes = true;

  let fps = 0;
  let fpsAccumulatorSeconds = 0;
  let fpsFrameCounter = 0;

  function toggle() {
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  function setEnabled(nextValue) {
    enabled = Boolean(nextValue);
  }

  function toggleHitboxes() {
    showHitboxes = !showHitboxes;
    return showHitboxes;
  }

  function areHitboxesVisible() {
    return showHitboxes;
  }

  function updateTiming(deltaSeconds) {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
      return;
    }

    fpsAccumulatorSeconds += deltaSeconds;
    fpsFrameCounter += 1;

    if (fpsAccumulatorSeconds < 0.25) {
      return;
    }

    fps = fpsFrameCounter / fpsAccumulatorSeconds;
    fpsAccumulatorSeconds = 0;
    fpsFrameCounter = 0;
  }

  function collectStats() {
    const invaderCount = world?.getAliveInvaders?.().length ?? 0;
    const bulletCount = world?.getActiveBullets?.().length ?? 0;
    const particleCount = world?.getActiveParticles?.().length ?? 0;
    const currentState = gameState?.getState?.() ?? "UNKNOWN";
    const dpr = Number(getDpr?.()) || 1;

    return {
      invaderCount,
      bulletCount,
      particleCount,
      currentState,
      dpr,
    };
  }

  function drawOverlay(context, { width } = {}) {
    if (!enabled) {
      return;
    }

    const { invaderCount, bulletCount, particleCount, currentState, dpr } = collectStats();

    const lines = [
      "DEBUG [D]",
      `FPS: ${formatFps(fps)}`,
      `State: ${currentState}`,
      `Invaders: ${formatCount(invaderCount)}`,
      `Bullets: ${formatCount(bulletCount)}`,
      `Particles: ${formatCount(particleCount)}`,
      `DPR: ${dpr.toFixed(2)}`,
      `Hitboxes: ${showHitboxes ? "ON" : "OFF"}`,
    ];

    context.save();
    context.font = "13px monospace";
    context.textBaseline = "top";

    const panelX = 12;
    const panelY = 12;
    const lineHeight = 18;
    const panelWidth = Math.min(280, (width ?? 280) - panelX * 2);
    const panelHeight = lineHeight * lines.length + 12;

    context.fillStyle = "rgba(8, 12, 24, 0.72)";
    context.fillRect(panelX, panelY, panelWidth, panelHeight);

    context.strokeStyle = "rgba(255, 214, 232, 0.9)";
    context.strokeRect(panelX + 0.5, panelY + 0.5, panelWidth - 1, panelHeight - 1);

    context.fillStyle = "#ffd6e8";
    lines.forEach((line, index) => {
      context.fillText(line, panelX + 10, panelY + 7 + index * lineHeight);
    });

    context.restore();
  }

  function drawHitboxes(context, { world: currentWorld } = {}) {
    if (!enabled || !showHitboxes) {
      return;
    }

    const activeWorld = currentWorld ?? world;

    drawHitbox(context, activeWorld?.player, "rgba(129, 233, 184, 0.95)");

    for (const invader of activeWorld?.getAliveInvaders?.() ?? []) {
      drawHitbox(context, invader, "rgba(255, 168, 213, 0.95)");
    }

    for (const bullet of activeWorld?.getActiveBullets?.() ?? []) {
      drawHitbox(context, bullet, "rgba(168, 230, 255, 0.95)");
    }
  }

  return {
    toggle,
    isEnabled,
    setEnabled,
    toggleHitboxes,
    areHitboxesVisible,
    updateTiming,
    drawOverlay,
    drawHitboxes,
  };
}
