const PLAYER_BODY_BOTTOM = "#FF004D";
const PLAYER_BODY_TOP = "#FF69B4";
const PLAYER_HIGHLIGHT = "rgba(255, 255, 255, 0.4)";
const TURRET_COLOR = "#b4003e";
const TRACK_COLOR = "#708090";

function drawHeartPath(ctx, width, height) {
  const left = -width / 2;
  const top = -height / 2;
  const bottom = top + height;

  const lobeY = top + height * 0.28;
  const indentationY = top + height * 0.06;

  ctx.beginPath();
  ctx.moveTo(0, indentationY);
  ctx.bezierCurveTo(width * 0.28, top - height * 0.08, width * 0.58, lobeY, 0, bottom);
  ctx.bezierCurveTo(-width * 0.58, lobeY, -width * 0.28, top - height * 0.08, 0, indentationY);
  ctx.closePath();

  ctx.moveTo(left + width * 0.5, indentationY);
}

export function drawPlayer(ctx, player, { visible = true } = {}) {
  if (!player || !visible) {
    return;
  }

  const centerX = player.x + player.width / 2;
  const centerY = player.y + player.height / 2;

  ctx.save();
  ctx.translate(centerX, centerY);

  const gradient = ctx.createLinearGradient(0, player.height / 2, 0, -player.height / 2);
  gradient.addColorStop(0, PLAYER_BODY_BOTTOM);
  gradient.addColorStop(1, PLAYER_BODY_TOP);

  drawHeartPath(ctx, player.width, player.height);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.fillStyle = PLAYER_HIGHLIGHT;
  ctx.beginPath();
  ctx.ellipse(-player.width * 0.18, -player.height * 0.2, player.width * 0.12, player.height * 0.16, -0.45, 0, Math.PI * 2);
  ctx.fill();

  const turretWidth = Math.max(6, player.width * 0.2);
  const turretHeight = Math.max(8, player.height * 0.35);
  const turretY = -player.height * 0.5 - turretHeight * 0.25;

  ctx.fillStyle = TURRET_COLOR;
  ctx.fillRect(-turretWidth / 2, turretY, turretWidth, turretHeight);

  const trackWidth = player.width * 0.26;
  const trackHeight = Math.max(4, player.height * 0.15);
  const trackY = player.height * 0.44;

  ctx.fillStyle = TRACK_COLOR;
  ctx.fillRect(-player.width * 0.36, trackY, trackWidth, trackHeight);
  ctx.fillRect(player.width * 0.1, trackY, trackWidth, trackHeight);

  ctx.restore();
}
