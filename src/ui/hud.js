const HUD_TEXT = "#ffe9f4";
const HUD_ACCENT = "#ffd700";
const HEART_FILL = "#ff69b4";
const HEART_STROKE = "#ff004d";

function drawHeart(ctx, x, y, size) {
  const half = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + half * 0.4);
  ctx.bezierCurveTo(x, y - half * 0.9, x - size, y - half * 0.2, x, y + size);
  ctx.bezierCurveTo(x + size, y - half * 0.2, x, y - half * 0.9, x, y + half * 0.4);
  ctx.closePath();
  ctx.fillStyle = HEART_FILL;
  ctx.strokeStyle = HEART_STROKE;
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawHud(context, { width, score, lives, wave }) {
  context.save();
  context.font = '18px "Segoe UI", "Trebuchet MS", sans-serif';
  context.textBaseline = "top";
  context.fillStyle = HUD_TEXT;

  context.fillText(`Score: ${score}`, 16, 14);

  context.fillStyle = HUD_ACCENT;
  context.fillText(`Wave: ${wave}`, width / 2 - 38, 14);

  context.fillStyle = HUD_TEXT;
  context.fillText("Lives:", width - 180, 14);

  const heartY = 22;
  const spacing = 18;
  for (let i = 0; i < lives; i += 1) {
    drawHeart(context, width - 120 + i * spacing, heartY, 7);
  }

  context.restore();
}
