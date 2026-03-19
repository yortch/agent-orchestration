const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");
const ui = {
  score: document.getElementById("score"),
  highScore: document.getElementById("high-score"),
  lives: document.getElementById("lives"),
  level: document.getElementById("level"),
};

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const player = {
  x: WIDTH / 2,
  y: HEIGHT - 80,
  w: 46,
  h: 38,
  speed: 360,
  cooldown: 0,
  invulnerable: 0,
};

const state = {
  mode: "start",
  score: 0,
  highScore: loadHighScore(),
  lives: 3,
  level: 1,
  lastTime: performance.now(),
  enemyStepTimer: 0,
  enemyMoveInterval: 0.9,
  enemyDir: 1,
  enemyShotTimer: 1.4,
  bonusTimer: 9,
  hitFreeze: 0,
};

let enemies = [];
let shields = [];
let playerBullets = [];
let enemyBullets = [];
let particles = [];
let backgroundHearts = [];
let bonusShip = null;
let pressed = new Set();
let startEnemiesCount = 0;
let audioContext;

function loadHighScore() {
  try {
    const stored = localStorage.getItem("valentine-invaders-hs");
    return stored ? Number(stored) : 0;
  } catch (_) {
    return 0;
  }
}

function saveHighScore() {
  try {
    localStorage.setItem("valentine-invaders-hs", String(state.highScore));
  } catch (_) {
    /* noop */
  }
}

function init() {
  initBackdrop();
  resetWave(true);
  updateUI();
  overlay.classList.add("overlay--visible");
  overlayTitle.textContent = "Defend the last bouquet";
  overlayText.textContent = "Hold the line against candy-colored invaders. Clear each wave, protect your heart shields, and keep the bouquet safe.";
  requestAnimationFrame(loop);
}

function initBackdrop() {
  backgroundHearts = Array.from({ length: 28 }, () => ({
    x: Math.random() * WIDTH,
    y: Math.random() * HEIGHT,
    size: 6 + Math.random() * 12,
    speed: 14 + Math.random() * 32,
    alpha: 0.15 + Math.random() * 0.14,
  }));
}

function resetWave(fullReset = false) {
  player.x = WIDTH / 2;
  player.y = HEIGHT - 80;
  player.cooldown = 0;
  player.invulnerable = fullReset ? 0 : 1.8;
  playerBullets = [];
  enemyBullets = [];
  particles = [];
  buildEnemies();
  buildShields();
  bonusShip = null;
  state.enemyDir = 1;
  state.enemyStepTimer = 0;
  state.enemyShotTimer = 1.4;
  state.bonusTimer = 9 + Math.random() * 6;
  startEnemiesCount = enemies.length;
}

function buildEnemies() {
  enemies = [];
  const rows = 5;
  const cols = 10;
  const spacingX = 60;
  const spacingY = 46;
  const offsetX = 90;
  const offsetY = 70;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      enemies.push({
        x: offsetX + c * spacingX,
        y: offsetY + r * spacingY,
        w: 34,
        h: 30,
        alive: true,
        col: c,
        row: r,
        value: 50 + (rows - r) * 10,
      });
    }
  }
}

function buildShields() {
  shields = [];
  const template = ["0110", "1111", "1111", "0110"];
  const shieldCount = 3;
  const spacing = WIDTH / (shieldCount + 1);
  const baseY = HEIGHT - 190;

  for (let i = 0; i < shieldCount; i += 1) {
    const startX = spacing * (i + 1) - 44;
    template.forEach((row, r) => {
      row.split("").forEach((cell, c) => {
        if (cell === "1") {
          shields.push({
            x: startX + c * 22 + 9,
            y: baseY + r * 18 + 7,
            w: 18,
            h: 14,
            hp: 3,
          });
        }
      });
    });
  }
}

function loop(timestamp) {
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.032);
  state.lastTime = timestamp;

  if (state.mode === "playing") {
    step(dt);
  }

  render(dt);
  requestAnimationFrame(loop);
}

function step(dt) {
  player.cooldown = Math.max(0, player.cooldown - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  state.hitFreeze = Math.max(0, state.hitFreeze - dt);
  state.enemyShotTimer -= dt;
  state.bonusTimer -= dt;

  handleInput(dt);
  moveEnemies(dt);
  moveBullets(dt);
  moveBonus(dt);
  updateParticles(dt);

  if (state.enemyShotTimer <= 0) {
    spawnEnemyShot();
  }

  if (state.bonusTimer <= 0 && !bonusShip) {
    spawnBonusShip();
  }

  checkLevelClear();
}

function handleInput(dt) {
  if (pressed.has("ArrowLeft") || pressed.has("KeyA")) {
    player.x -= player.speed * dt;
  }
  if (pressed.has("ArrowRight") || pressed.has("KeyD")) {
    player.x += player.speed * dt;
  }
  player.x = Math.max(32, Math.min(WIDTH - 32, player.x));
}

function moveEnemies(dt) {
  state.enemyStepTimer += dt;
  const living = enemies.filter((e) => e.alive);
  if (!living.length) return;

  const speedScale = 0.85 - Math.min(0.55, (startEnemiesCount - living.length) * 0.01) - Math.min(0.2, (state.level - 1) * 0.03);
  state.enemyMoveInterval = Math.max(0.16, 0.95 * speedScale);

  if (state.enemyStepTimer >= state.enemyMoveInterval) {
    state.enemyStepTimer = 0;
    let edgeHit = false;
    living.forEach((enemy) => {
      enemy.x += 12 * state.enemyDir;
      if (enemy.x < 32 || enemy.x > WIDTH - 32) {
        edgeHit = true;
      }
    });
    if (edgeHit) {
      state.enemyDir *= -1;
      living.forEach((enemy) => {
        enemy.y += 18;
      });
    }
  }

  if (living.some((e) => e.y + e.h / 2 >= player.y - 12)) {
    gameOver("The invaders reached the bouquet.");
  }
}

function moveBullets(dt) {
  playerBullets.forEach((b) => {
    b.y -= b.speed * dt;
  });
  enemyBullets.forEach((b) => {
    b.y += b.speed * dt;
  });

  playerBullets = playerBullets.filter((b) => b.y > -20);
  enemyBullets = enemyBullets.filter((b) => b.y < HEIGHT + 20);

  handleCollisions();
}

function moveBonus(dt) {
  if (!bonusShip) return;
  bonusShip.x += bonusShip.speed * dt * bonusShip.dir;
  bonusShip.wave += dt * 4;
  if (bonusShip.x < -80 || bonusShip.x > WIDTH + 80) {
    bonusShip = null;
    state.bonusTimer = 10 + Math.random() * 8;
  }
}

function spawnEnemyShot() {
  const living = enemies.filter((e) => e.alive);
  if (!living.length) return;
  const columns = [...new Set(living.map((e) => e.col))];
  const chosenCol = columns[Math.floor(Math.random() * columns.length)];
  const shooters = living.filter((e) => e.col === chosenCol);
  const shooter = shooters.reduce((a, b) => (a.y > b.y ? a : b));

  enemyBullets.push({
    x: shooter.x,
    y: shooter.y + shooter.h / 2,
    w: 8,
    h: 14,
    speed: 210 + state.level * 12,
  });

  state.enemyShotTimer = Math.max(0.5, 1.45 - state.level * 0.08 + Math.random() * 0.35);
}

function spawnBonusShip() {
  bonusShip = {
    x: state.enemyDir > 0 ? -40 : WIDTH + 40,
    y: 68,
    w: 40,
    h: 26,
    dir: state.enemyDir > 0 ? 1 : -1,
    speed: 160 + Math.random() * 40,
    wave: 0,
    value: 150 + Math.floor(Math.random() * 80),
  };
}

function handleCollisions() {
  enemies.forEach((enemy) => {
    if (!enemy.alive) return;
    for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
      const bullet = playerBullets[i];
      if (boxCollide(enemy, bullet)) {
        enemy.alive = false;
        playerBullets.splice(i, 1);
        addScore(enemy.value);
        makeBurst(enemy.x, enemy.y, "#ff7fb3");
        playTone(620, 0.08);
        break;
      }
    }
  });

  if (bonusShip) {
    for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
      if (boxCollide(bonusShip, playerBullets[i])) {
        addScore(bonusShip.value);
        makeBurst(bonusShip.x, bonusShip.y, "#ffd166");
        playTone(840, 0.1);
        playerBullets.splice(i, 1);
        bonusShip = null;
        state.bonusTimer = 12 + Math.random() * 8;
        break;
      }
    }
  }

  for (let s = shields.length - 1; s >= 0; s -= 1) {
    const shield = shields[s];
    for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
      if (boxCollide(shield, playerBullets[i])) {
        playerBullets.splice(i, 1);
        shield.hp -= 1;
        playTone(440, 0.05);
      }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
      if (boxCollide(shield, enemyBullets[i])) {
        enemyBullets.splice(i, 1);
        shield.hp -= 1;
      }
    }
    if (shield.hp <= 0) {
      shields.splice(s, 1);
    }
  }

  for (let i = playerBullets.length - 1; i >= 0; i -= 1) {
    const bullet = playerBullets[i];
    for (let j = enemyBullets.length - 1; j >= 0; j -= 1) {
      if (boxCollide(bullet, enemyBullets[j])) {
        makeBurst(bullet.x, bullet.y, "#ffb3d9");
        playerBullets.splice(i, 1);
        enemyBullets.splice(j, 1);
        break;
      }
    }
  }

  if (state.hitFreeze > 0 || player.invulnerable > 0 || state.mode !== "playing") return;

  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    if (boxCollide(player, enemyBullets[i])) {
      enemyBullets.splice(i, 1);
      playerHit();
      return;
    }
  }

  if (enemies.some((e) => e.alive && boxCollide(player, e))) {
    playerHit();
  }
}

function checkLevelClear() {
  if (enemies.every((e) => !e.alive)) {
    state.level += 1;
    resetWave(false);
    updateUI();
  }
}

function playerHit() {
  state.lives -= 1;
  updateUI();
  makeBurst(player.x, player.y, "#ffd2e6");
  playTone(180, 0.12);
  if (state.lives <= 0) {
    gameOver("Your hearts were overrun.");
    return;
  }
  state.hitFreeze = 0.8;
  player.invulnerable = 2.5;
  playerBullets = [];
  enemyBullets = [];
}

function addScore(value) {
  state.score += value;
  if (state.score > state.highScore) {
    state.highScore = state.score;
    saveHighScore();
  }
  updateUI();
}

function updateUI() {
  ui.score.textContent = state.score;
  ui.highScore.textContent = state.highScore;
  ui.lives.textContent = state.lives;
  ui.level.textContent = state.level;
}

function gameOver(message) {
  state.mode = "gameover";
  overlayTitle.textContent = "Game Over";
  overlayText.textContent = message;
  startBtn.textContent = "Play Again";
  overlay.classList.add("overlay--visible");
}

function startGame() {
  state.mode = "playing";
  state.score = 0;
  state.lives = 3;
  state.level = 1;
  resetWave(true);
  updateUI();
  overlay.classList.remove("overlay--visible");
  startBtn.textContent = "Resume";
  state.lastTime = performance.now();
}

function togglePause() {
  if (state.mode === "playing") {
    state.mode = "paused";
    overlayTitle.textContent = "Paused";
    overlayText.textContent = "Catch your breath. Your bouquet will wait.";
    startBtn.textContent = "Resume";
    overlay.classList.add("overlay--visible");
  } else if (state.mode === "paused") {
    state.mode = "playing";
    overlay.classList.remove("overlay--visible");
    state.lastTime = performance.now();
  }
}

function render(dt) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackdrop(dt);
  drawShields();
  drawEnemies();
  drawBonus();
  drawBullets();
  drawPlayer();
  drawParticles();
  drawGround();
}

function drawBackdrop(dt) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#1a0720");
  gradient.addColorStop(1, "#100514");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  backgroundHearts.forEach((h) => {
    h.y += h.speed * dt;
    if (h.y > HEIGHT + 20) {
      h.y = -20;
      h.x = Math.random() * WIDTH;
    }
    ctx.save();
    ctx.globalAlpha = h.alpha;
    drawHeart(h.x, h.y, h.size, "#ff7fb3");
    ctx.restore();
  });
}

function drawPlayer() {
  const tint = player.invulnerable > 0 ? "#b6fff7" : "#ff6f9c";
  drawHeart(player.x, player.y, 22, tint, "#fecee3");
  ctx.save();
  ctx.fillStyle = "#ffe9f4";
  ctx.fillRect(player.x - 10, player.y + 14, 20, 6);
  ctx.restore();
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    if (!enemy.alive) return;
    const hue = 300 + enemy.row * 12;
    const color = `hsl(${hue}, 72%, 62%)`;
    drawHeart(enemy.x, enemy.y, 18, color, "rgba(255,255,255,0.12)");
  });
}

function drawBonus() {
  if (!bonusShip) return;
  ctx.save();
  ctx.translate(bonusShip.x, bonusShip.y + Math.sin(bonusShip.wave) * 6);
  drawHeart(0, 0, 16, "#ffd166", "#ffe7a3");
  ctx.fillStyle = "#ff9a8b";
  ctx.fillRect(-18, -4, 36, 8);
  ctx.fillStyle = "#ffe6f2";
  ctx.fillRect(-12, -2, 24, 4);
  ctx.restore();
}

function drawShields() {
  shields.forEach((shield) => {
    const palette = ["#ffd8eb", "#ffb7d5", "#ff8bbb"];
    const color = palette[Math.max(0, Math.min(2, shield.hp - 1))];
    ctx.fillStyle = color;
    ctx.fillRect(shield.x - shield.w / 2, shield.y - shield.h / 2, shield.w, shield.h);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.strokeRect(shield.x - shield.w / 2, shield.y - shield.h / 2, shield.w, shield.h);
  });
}

function drawBullets() {
  ctx.save();
  playerBullets.forEach((b) => {
    drawHeart(b.x, b.y, 8, "#ffb6d8", "#ffe7f3");
  });
  ctx.fillStyle = "#ffefc1";
  enemyBullets.forEach((b) => {
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.w / 2, b.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    drawHeart(p.x, p.y, p.size, p.color);
    ctx.restore();
  });
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, HEIGHT - 70, 0, HEIGHT);
  gradient.addColorStop(0, "rgba(255, 111, 156, 0.04)");
  gradient.addColorStop(1, "rgba(255, 111, 156, 0.24)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, HEIGHT - 70, WIDTH, 70);
}

function drawHeart(x, y, size, fill, stroke) {
  const s = size;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.5, -s * 0.9, s * 1.2, -s * 0.1, 0, s);
  ctx.bezierCurveTo(-s * 1.2, -s * 0.1, -s * 0.5, -s * 0.9, 0, -s * 0.4);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, size * 0.16);
    ctx.stroke();
  }
  ctx.restore();
}

function boxCollide(a, b) {
  const aw = a.w || a.size || 0;
  const ah = a.h || a.size || 0;
  const bw = b.w || b.size || 0;
  const bh = b.h || b.size || 0;
  return (
    Math.abs(a.x - b.x) * 2 < aw + bw &&
    Math.abs(a.y - b.y) * 2 < ah + bh
  );
}

function shoot() {
  if (state.mode !== "playing" || player.cooldown > 0) return;
  playerBullets.push({
    x: player.x,
    y: player.y - player.h / 2,
    w: 8,
    h: 14,
    speed: 520,
  });
  player.cooldown = 0.26;
  playTone(760, 0.07);
}

function updateParticles(dt) {
  particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
  });
  particles = particles.filter((p) => p.life > 0);
}

function makeBurst(x, y, color) {
  for (let i = 0; i < 10; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 100;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      color,
      life: 0.7 + Math.random() * 0.3,
      maxLife: 1,
    });
  }
}

function playTone(freq, duration) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (_) {
    /* ignore audio errors */
  }
}

function resumeAudio() {
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

startBtn.addEventListener("click", () => {
  resumeAudio();
  if (state.mode === "start" || state.mode === "gameover") {
    startGame();
  } else {
    togglePause();
  }
});

document.addEventListener("keydown", (e) => {
  if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space"].includes(e.code)) {
    e.preventDefault();
  }
  if (e.code === "Space") {
    if (state.mode === "start" || state.mode === "gameover") {
      startGame();
    } else {
      shoot();
    }
  }
  if (e.code === "KeyP") {
    if (state.mode === "playing" || state.mode === "paused") {
      togglePause();
    }
  }
  if (e.code === "Enter" && (state.mode === "start" || state.mode === "gameover")) {
    startGame();
  }
  pressed.add(e.code);
});

document.addEventListener("keyup", (e) => {
  pressed.delete(e.code);
});

window.addEventListener("blur", () => {
  if (state.mode === "playing") {
    togglePause();
  }
});

init();
