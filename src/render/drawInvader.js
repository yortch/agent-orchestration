const CUPID_BODY = "#E6E6FA";
const CUPID_WINGS = "#87CEEB";
const BROKEN_HEART = "#708090";
const CRACK_COLOR = "#2C001E";
const BADGE_COLOR = "#B22222";
const BADGE_CENTER = "#2f1b26";
const BADGE_HEART = "#7a2f46";

function getInvaderVariant(row, totalRows) {
  const topRows = Math.max(1, Math.floor(totalRows / 3));
  const middleRows = Math.max(1, Math.floor(totalRows / 3));
  const middleStart = topRows;
  const bottomStart = Math.min(totalRows - 1, topRows + middleRows);

  if (row < topRows) {
    return "cupid";
  }

  if (row < bottomStart) {
    return "broken-heart";
  }

  return "anti-love";
}

function drawHeartPath(ctx, width, height) {
  const top = -height / 2;
  const bottom = top + height;
  const lobeY = top + height * 0.28;
  const indentationY = top + height * 0.08;

  ctx.beginPath();
  ctx.moveTo(0, indentationY);
  ctx.bezierCurveTo(width * 0.28, top - height * 0.08, width * 0.58, lobeY, 0, bottom);
  ctx.bezierCurveTo(-width * 0.58, lobeY, -width * 0.28, top - height * 0.08, 0, indentationY);
  ctx.closePath();
}

function drawCupid(ctx, width, height) {
  const faceRadius = Math.min(width, height) * 0.23;

  ctx.fillStyle = CUPID_WINGS;
  for (let i = 0; i < 3; i += 1) {
    const wingOffsetY = -height * 0.1 + i * faceRadius * 0.38;
    const wingOffsetX = width * 0.32 + i * 2.5;

    ctx.beginPath();
    ctx.arc(-wingOffsetX, wingOffsetY, faceRadius * 0.52, 0, Math.PI * 2);
    ctx.arc(wingOffsetX, wingOffsetY, faceRadius * 0.52, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = CUPID_BODY;
  ctx.beginPath();
  ctx.arc(0, -height * 0.02, faceRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3d4a5a";
  ctx.beginPath();
  ctx.arc(-faceRadius * 0.32, -height * 0.04, 1.6, 0, Math.PI * 2);
  ctx.arc(faceRadius * 0.32, -height * 0.04, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#3d4a5a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, faceRadius * 0.05, faceRadius * 0.42, 0.18 * Math.PI, 0.82 * Math.PI, true);
  ctx.stroke();
}

function drawBrokenHeart(ctx, width, height) {
  drawHeartPath(ctx, width * 0.9, height * 0.9);
  ctx.fillStyle = BROKEN_HEART;
  ctx.fill();

  ctx.strokeStyle = CRACK_COLOR;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-width * 0.03, -height * 0.34);
  ctx.lineTo(width * 0.08, -height * 0.18);
  ctx.lineTo(-width * 0.03, -height * 0.04);
  ctx.lineTo(width * 0.1, height * 0.12);
  ctx.lineTo(-width * 0.04, height * 0.32);
  ctx.stroke();
}

function drawAntiLove(ctx, width, height) {
  const radius = Math.min(width, height) * 0.4;

  ctx.fillStyle = BADGE_CENTER;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
  ctx.fill();

  drawHeartPath(ctx, radius * 0.95, radius * 0.9);
  ctx.fillStyle = BADGE_HEART;
  ctx.fill();

  ctx.strokeStyle = BADGE_COLOR;
  ctx.lineWidth = Math.max(3, radius * 0.36);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-radius * 0.75, -radius * 0.75);
  ctx.lineTo(radius * 0.75, radius * 0.75);
  ctx.stroke();
}

export function drawInvader(ctx, invader, { totalRows = 5 } = {}) {
  if (!invader || !invader.active) {
    return;
  }

  const centerX = invader.x + invader.width / 2;
  const centerY = invader.y + invader.height / 2;

  ctx.save();
  ctx.translate(centerX, centerY);

  const variant = getInvaderVariant(invader.row, totalRows);

  if (variant === "cupid") {
    drawCupid(ctx, invader.width, invader.height);
  } else if (variant === "broken-heart") {
    drawBrokenHeart(ctx, invader.width, invader.height);
  } else {
    drawAntiLove(ctx, invader.width, invader.height);
  }

  ctx.restore();
}
