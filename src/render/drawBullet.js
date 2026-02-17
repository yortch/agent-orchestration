const PLAYER_SHAFT = "#FFD700";
const PLAYER_TIP = "#FF69B4";
const ENEMY_DROP = "#E0FFFF";

function drawTinyHeart(ctx, x, y, size) {
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.15);
  ctx.bezierCurveTo(x + size * 0.35, y - size * 0.6, x + size * 0.75, y - size * 0.1, x, y + size * 0.65);
  ctx.bezierCurveTo(x - size * 0.75, y - size * 0.1, x - size * 0.35, y - size * 0.6, x, y - size * 0.15);
  ctx.closePath();
}

function drawPlayerArrow(ctx, bullet) {
  const centerX = bullet.x + bullet.width / 2;
  const top = bullet.y;
  const bottom = bullet.y + bullet.height;

  ctx.strokeStyle = PLAYER_SHAFT;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(centerX, bottom);
  ctx.lineTo(centerX, top + 4);
  ctx.stroke();

  ctx.fillStyle = PLAYER_TIP;
  drawTinyHeart(ctx, centerX, top + 2.5, 4.8);
  ctx.fill();

  ctx.strokeStyle = PLAYER_TIP;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(centerX, bottom);
  ctx.lineTo(centerX - 2.7, bottom + 3.2);
  ctx.moveTo(centerX, bottom);
  ctx.lineTo(centerX + 2.7, bottom + 3.2);
  ctx.stroke();
}

function drawEnemyDrop(ctx, bullet) {
  const centerX = bullet.x + bullet.width / 2;
  const topY = bullet.y;
  const widestY = bullet.y + bullet.height * 0.43;
  const bottomY = bullet.y + bullet.height;
  const radius = Math.max(2.2, bullet.width * 0.7);

  ctx.fillStyle = ENEMY_DROP;
  ctx.beginPath();
  ctx.moveTo(centerX, topY);
  ctx.bezierCurveTo(centerX + radius, topY + 2.4, centerX + radius * 1.1, widestY, centerX, bottomY);
  ctx.bezierCurveTo(centerX - radius * 1.1, widestY, centerX - radius, topY + 2.4, centerX, topY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.beginPath();
  ctx.ellipse(centerX - radius * 0.3, widestY, radius * 0.35, radius * 0.55, -0.45, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBullet(ctx, bullet) {
  if (!bullet || !bullet.active) {
    return;
  }

  if (bullet.owner === "player") {
    drawPlayerArrow(ctx, bullet);
    return;
  }

  drawEnemyDrop(ctx, bullet);
}
