// Game configuration
const CONFIG = {
    canvas: {
        width: 800,
        height: 600
    },
    player: {
        width: 40,
        height: 40,
        speed: 5,
        shootCooldown: 300
    },
    enemy: {
        width: 35,
        height: 35,
        rows: 4,
        cols: 8,
        spacing: 60,
        moveSpeed: 1,
        moveDownAmount: 20,
        shootChance: 0.0005
    },
    projectile: {
        width: 8,
        height: 15,
        speed: 7
    },
    colors: {
        background: '#1a0033',
        player: '#ff1493',
        playerSecondary: '#ff69b4',
        enemy: '#ff6b9d',
        enemySecondary: '#c06c84',
        projectile: '#ff1493',
        enemyProjectile: '#8b008b',
        particle: '#ff69b4'
    }
};

// Game state
const gameState = {
    score: 0,
    lives: 3,
    level: 1,
    isPlaying: false,
    isPaused: false,
    keys: {},
    lastShootTime: 0
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game entities
let player;
let enemies = [];
let playerProjectiles = [];
let enemyProjectiles = [];
let particles = [];

// Player class
class Player {
    constructor() {
        this.x = CONFIG.canvas.width / 2 - CONFIG.player.width / 2;
        this.y = CONFIG.canvas.height - CONFIG.player.height - 20;
        this.width = CONFIG.player.width;
        this.height = CONFIG.player.height;
        this.speed = CONFIG.player.speed;
    }

    draw() {
        // Draw a heart-shaped player
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Heart shape
        ctx.fillStyle = CONFIG.colors.player;
        ctx.beginPath();
        const topCurveHeight = this.height * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // Left half
        ctx.bezierCurveTo(
            -this.width / 2, -topCurveHeight,
            -this.width / 2, topCurveHeight,
            0, this.height / 2
        );
        // Right half
        ctx.bezierCurveTo(
            this.width / 2, topCurveHeight,
            this.width / 2, -topCurveHeight,
            0, topCurveHeight
        );
        ctx.fill();

        // Add shine effect
        ctx.fillStyle = CONFIG.colors.playerSecondary;
        ctx.beginPath();
        ctx.arc(-this.width / 6, -topCurveHeight / 2, this.width / 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update() {
        if (gameState.keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (gameState.keys['ArrowRight'] && this.x < CONFIG.canvas.width - this.width) {
            this.x += this.speed;
        }
    }

    shoot() {
        const now = Date.now();
        if (now - gameState.lastShootTime > CONFIG.player.shootCooldown) {
            playerProjectiles.push(new Projectile(
                this.x + this.width / 2 - CONFIG.projectile.width / 2,
                this.y,
                true
            ));
            gameState.lastShootTime = now;
        }
    }
}

// Enemy class (Cupid/Love Bug)
class Enemy {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.enemy.width;
        this.height = CONFIG.enemy.height;
        this.row = row;
        this.alive = true;
    }

    draw() {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Draw cupid/love bug
        // Body (small heart)
        ctx.fillStyle = CONFIG.colors.enemy;
        ctx.beginPath();
        const topCurveHeight = this.height * 0.25;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(
            -this.width / 3, -topCurveHeight,
            -this.width / 3, topCurveHeight,
            0, this.height / 2.5
        );
        ctx.bezierCurveTo(
            this.width / 3, topCurveHeight,
            this.width / 3, -topCurveHeight,
            0, topCurveHeight
        );
        ctx.fill();

        // Wings
        ctx.fillStyle = CONFIG.colors.enemySecondary;
        // Left wing
        ctx.beginPath();
        ctx.ellipse(-this.width / 2, 0, this.width / 3, this.height / 4, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.ellipse(this.width / 2, 0, this.width / 3, this.height / 4, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-this.width / 8, 0, 2, 0, Math.PI * 2);
        ctx.arc(this.width / 8, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update(moveDirection, shouldMoveDown) {
        if (!this.alive) return;

        if (shouldMoveDown) {
            this.y += CONFIG.enemy.moveDownAmount;
        } else {
            this.x += moveDirection * CONFIG.enemy.moveSpeed;
        }

        // Random shooting
        if (Math.random() < CONFIG.enemy.shootChance) {
            this.shoot();
        }
    }

    shoot() {
        enemyProjectiles.push(new Projectile(
            this.x + this.width / 2 - CONFIG.projectile.width / 2,
            this.y + this.height,
            false
        ));
    }
}

// Projectile class (Hearts and Arrows)
class Projectile {
    constructor(x, y, isPlayerProjectile) {
        this.x = x;
        this.y = y;
        this.width = CONFIG.projectile.width;
        this.height = CONFIG.projectile.height;
        this.speed = CONFIG.projectile.speed;
        this.isPlayerProjectile = isPlayerProjectile;
    }

    draw() {
        if (this.isPlayerProjectile) {
            // Player shoots hearts
            ctx.fillStyle = CONFIG.colors.projectile;
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(0.4, 0.4);

            ctx.beginPath();
            const h = 15;
            ctx.moveTo(0, h);
            ctx.bezierCurveTo(-12, -h / 2, -12, h / 2, 0, h * 1.5);
            ctx.bezierCurveTo(12, h / 2, 12, -h / 2, 0, h);
            ctx.fill();

            ctx.restore();
        } else {
            // Enemies shoot broken hearts/arrows
            ctx.fillStyle = CONFIG.colors.enemyProjectile;
            ctx.fillRect(this.x, this.y, this.width, this.height);

            // Arrow tip
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height);
            ctx.lineTo(this.x, this.y + this.height - 5);
            ctx.lineTo(this.x + this.width, this.y + this.height - 5);
            ctx.closePath();
            ctx.fill();
        }
    }

    update() {
        if (this.isPlayerProjectile) {
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }
    }

    isOffScreen() {
        return this.y < -this.height || this.y > CONFIG.canvas.height;
    }
}

// Particle class for effects
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = Math.random() * 4 + 2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.color = color || CONFIG.colors.particle;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }

    isDead() {
        return this.life <= 0;
    }
}

// Initialize game
function init() {
    player = new Player();
    createEnemies();
    playerProjectiles = [];
    enemyProjectiles = [];
    particles = [];
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    updateUI();
}

// Create enemy grid
function createEnemies() {
    enemies = [];
    const startX = 100;
    const startY = 80;

    for (let row = 0; row < CONFIG.enemy.rows; row++) {
        for (let col = 0; col < CONFIG.enemy.cols; col++) {
            enemies.push(new Enemy(
                startX + col * CONFIG.enemy.spacing,
                startY + row * CONFIG.enemy.spacing,
                row
            ));
        }
    }
}

// Enemy movement logic
let enemyMoveDirection = 1;
let enemyMoveCounter = 0;
const enemyMoveInterval = 30;

function updateEnemies() {
    enemyMoveCounter++;

    if (enemyMoveCounter >= enemyMoveInterval) {
        enemyMoveCounter = 0;

        // Check if enemies hit the edge
        let shouldMoveDown = false;
        for (let enemy of enemies) {
            if (!enemy.alive) continue;

            if ((enemy.x <= 0 && enemyMoveDirection === -1) ||
                (enemy.x + enemy.width >= CONFIG.canvas.width && enemyMoveDirection === 1)) {
                shouldMoveDown = true;
                enemyMoveDirection *= -1;
                break;
            }
        }

        // Update all enemies
        for (let enemy of enemies) {
            enemy.update(enemyMoveDirection, shouldMoveDown);
        }
    }
}

// Collision detection
function checkCollisions() {
    // Player projectiles vs enemies
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        const projectile = playerProjectiles[i];

        for (let enemy of enemies) {
            if (!enemy.alive) continue;

            if (projectile.x < enemy.x + enemy.width &&
                projectile.x + projectile.width > enemy.x &&
                projectile.y < enemy.y + enemy.height &&
                projectile.y + projectile.height > enemy.y) {

                // Hit!
                enemy.alive = false;
                playerProjectiles.splice(i, 1);
                gameState.score += (enemy.row + 1) * 10;
                updateUI();

                // Create particles
                for (let j = 0; j < 10; j++) {
                    particles.push(new Particle(
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2,
                        CONFIG.colors.enemy
                    ));
                }
                break;
            }
        }
    }

    // Enemy projectiles vs player
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        const projectile = enemyProjectiles[i];

        if (projectile.x < player.x + player.width &&
            projectile.x + projectile.width > player.x &&
            projectile.y < player.y + player.height &&
            projectile.y + projectile.height > player.y) {

            // Player hit!
            enemyProjectiles.splice(i, 1);
            gameState.lives--;
            updateUI();

            // Create particles
            for (let j = 0; j < 20; j++) {
                particles.push(new Particle(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    CONFIG.colors.player
                ));
            }

            if (gameState.lives <= 0) {
                gameOver();
            }
        }
    }

    // Check if enemies reached the player
    for (let enemy of enemies) {
        if (enemy.alive && enemy.y + enemy.height >= player.y) {
            gameOver();
            break;
        }
    }
}

// Check win condition
function checkWinCondition() {
    const aliveEnemies = enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) {
        nextLevel();
    }
}

// Next level
function nextLevel() {
    gameState.level++;
    updateUI();
    createEnemies();
    playerProjectiles = [];
    enemyProjectiles = [];

    // Increase difficulty
    CONFIG.enemy.moveSpeed += 0.3;
    CONFIG.enemy.shootChance += 0.0001;
}

// Game over
function gameOver() {
    gameState.isPlaying = false;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
}

// Game loop
function gameLoop() {
    if (!gameState.isPlaying || gameState.isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }

    // Clear canvas
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

    // Draw starry background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    for (let i = 0; i < 50; i++) {
        const x = (i * 123) % CONFIG.canvas.width;
        const y = (i * 456) % CONFIG.canvas.height;
        ctx.fillRect(x, y, 1, 1);
    }

    // Update and draw player
    player.update();
    player.draw();

    // Update and draw enemies
    updateEnemies();
    for (let enemy of enemies) {
        enemy.draw();
    }

    // Update and draw projectiles
    for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        playerProjectiles[i].update();
        playerProjectiles[i].draw();

        if (playerProjectiles[i].isOffScreen()) {
            playerProjectiles.splice(i, 1);
        }
    }

    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        enemyProjectiles[i].update();
        enemyProjectiles[i].draw();

        if (enemyProjectiles[i].isOffScreen()) {
            enemyProjectiles.splice(i, 1);
        }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    // Check collisions
    checkCollisions();

    // Check win condition
    checkWinCondition();

    requestAnimationFrame(gameLoop);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key] = true;

    if (e.key === ' ' && gameState.isPlaying && !gameState.isPaused) {
        e.preventDefault();
        player.shoot();
    }

    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key] = false;
});

function togglePause() {
    if (!gameState.isPlaying) return;

    gameState.isPaused = !gameState.isPaused;
    const pauseScreen = document.getElementById('pauseScreen');

    if (gameState.isPaused) {
        pauseScreen.classList.remove('hidden');
    } else {
        pauseScreen.classList.add('hidden');
    }
}

// Start button
document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startScreen').classList.add('hidden');
    init();
    gameState.isPlaying = true;
    gameLoop();
});

// Restart button
document.getElementById('restartButton').addEventListener('click', () => {
    document.getElementById('gameOverScreen').classList.add('hidden');

    // Reset difficulty
    CONFIG.enemy.moveSpeed = 1;
    CONFIG.enemy.shootChance = 0.0005;

    init();
    gameState.isPlaying = true;
    gameLoop();
});

// Start the game loop (will wait for start button)
gameLoop();
