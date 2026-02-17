const PANEL_FILL = "rgba(44, 0, 30, 0.72)";
const PANEL_STROKE = "rgba(255, 105, 180, 0.65)";
const TITLE = "#ffd9ec";
const SUBTITLE = "#ffe9f4";
const ACCENT = "#ffd700";
const HEART = "#ff69b4";

function drawHeart(ctx, x, y, size) {
  const half = size / 2;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + half * 0.4);
  ctx.bezierCurveTo(x, y - half * 0.9, x - size, y - half * 0.2, x, y + size);
  ctx.bezierCurveTo(x + size, y - half * 0.2, x, y - half * 0.9, x, y + half * 0.4);
  ctx.closePath();
  ctx.fillStyle = HEART;
  ctx.fill();
  ctx.restore();
}

function drawArrow(ctx, x, y, length, angle) {
  const headSize = 8;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();

  ctx.fillStyle = ACCENT;
  ctx.beginPath();
  ctx.moveTo(length, 0);
  ctx.lineTo(length - headSize, -headSize / 2);
  ctx.lineTo(length - headSize, headSize / 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPanel(ctx, width, height) {
  const panelWidth = Math.min(680, width - 90);
  const panelHeight = Math.min(460, height - 90);
  const x = (width - panelWidth) / 2;
  const y = (height - panelHeight) / 2;

  ctx.save();
  ctx.fillStyle = PANEL_FILL;
  ctx.strokeStyle = PANEL_STROKE;
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, panelWidth, panelHeight);
  ctx.strokeRect(x, y, panelWidth, panelHeight);

  drawHeart(ctx, x + 28, y + 22, 9);
  drawHeart(ctx, x + panelWidth - 28, y + 22, 9);
  drawHeart(ctx, x + 28, y + panelHeight - 34, 9);
  drawHeart(ctx, x + panelWidth - 28, y + panelHeight - 34, 9);

  drawArrow(ctx, x + 48, y + 52, 40, 0.35);
  drawArrow(ctx, x + panelWidth - 88, y + panelHeight - 56, 40, -2.7);
  ctx.restore();

  return {
    x,
    y,
    panelWidth,
    panelHeight,
  };
}

export function drawStartScreen(context, { width, height }) {
  const panel = drawPanel(context, width, height);
  const centerX = width / 2;

  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillStyle = TITLE;
  context.font = 'bold 44px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Valentine Space Invaders", centerX, panel.y + 92);

  context.fillStyle = SUBTITLE;
  context.font = '20px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Defend love from the Heartbreakers", centerX, panel.y + 138);

  context.font = '19px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Controls", centerX, panel.y + 206);

  context.font = '18px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("← / → Move", centerX, panel.y + 242);
  context.fillText("SPACE to Shoot", centerX, panel.y + 272);

  context.fillStyle = ACCENT;
  context.font = 'bold 28px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Press SPACE or ENTER to Start", centerX, panel.y + panel.panelHeight - 58);

  context.restore();
}

export function drawGameOverScreen(context, { width, height, score, highScore }) {
  const panel = drawPanel(context, width, height);
  const centerX = width / 2;

  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.fillStyle = TITLE;
  context.font = 'bold 60px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Game Over", centerX, panel.y + 108);

  context.fillStyle = SUBTITLE;
  context.font = '24px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText(`Final Score: ${score}`, centerX, panel.y + 186);
  context.fillText(`High Score: ${highScore}`, centerX, panel.y + 224);

  context.fillStyle = ACCENT;
  context.font = 'bold 28px "Segoe UI", "Trebuchet MS", sans-serif';
  context.fillText("Press SPACE or ENTER to Restart", centerX, panel.y + panel.panelHeight - 62);

  context.restore();
}
