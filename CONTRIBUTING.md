# Contributing to Love Invaders

Thank you for your interest in contributing to Love Invaders! This guide will help you get started with extending and improving the game.

## 🎯 Project Philosophy

Love Invaders is built with these core principles:
- **Simplicity** - Vanilla JavaScript, no frameworks
- **Clarity** - Well-commented, readable code
- **Educational** - Code designed to be learned from
- **Modular** - Each file has one clear responsibility
- **No Dependencies** - Everything runs in the browser

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Basic HTTP server (Python, Node.js, or VS Code Live Server)
- Text editor (VS Code recommended)
- Basic understanding of:
  - JavaScript ES6+
  - HTML5 Canvas
  - Game development concepts

### Setup
```bash
# 1. Clone the repository
git clone <repository-url>
cd agent-orchestration

# 2. Start a local server
python -m http.server 8000
# OR
npx http-server -p 8000

# 3. Open in browser
# http://localhost:8000
```

### Project Structure
```
src/
├── main.js              # Game orchestration
├── audio/               # Sound system
├── canvas/              # Display management
├── game/               # All game logic
│   ├── config.js       # ⭐ Edit this first!
│   ├── state.js        # State machine
│   ├── loop.js         # Game loop
│   ├── entities.js     # Entity management
│   └── ...             # Other systems
└── render/             # Drawing functions
```

## 📝 Development Workflow

### Before You Start
1. **Read the documentation**
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Understand the system
   - [spec.md](docs/spec.md) - Know the game rules
   - Relevant module files - Study existing code

2. **Run the game**
   - Play through several levels
   - Understand current behavior
   - Identify what you want to change

3. **Plan your changes**
   - What files need modification?
   - What new files are needed?
   - How will it integrate with existing code?

### Making Changes

#### Step 1: Configuration First
For gameplay changes, try `src/game/config.js` first:

```javascript
// Example: Make the game easier
export const PLAYER_CONFIG = {
    SPEED: 300,              // Faster movement (was 250)
    STARTING_LIVES: 5        // More lives (was 3)
};

export const ENEMY_CONFIG = {
    BASE_SPEED: 20,          // Slower enemies (was 30)
    BASE_FIRE_RATE: 0.001    // Less shooting (was 0.002)
};
```

#### Step 2: Test Your Changes
```bash
# 1. Save your changes
# 2. Refresh browser (Ctrl/Cmd + R)
# 3. Test thoroughly
#    - Play multiple levels
#    - Try to break it
#    - Check edge cases
```

#### Step 3: Code Style
Follow existing patterns:

```javascript
// ✅ Good: Clear naming, comments, consistent style
/**
 * Update player position based on input
 * @param {Object} player - Player entity
 * @param {Object} input - Input state
 * @param {number} deltaTime - Time since last frame
 */
export function updatePlayer(player, input, deltaTime) {
    // Horizontal movement
    if (input.left) {
        player.x -= PLAYER_CONFIG.SPEED * deltaTime;
    }
    if (input.right) {
        player.x += PLAYER_CONFIG.SPEED * deltaTime;
    }
    
    // Clamp to screen bounds
    player.x = Math.max(0, Math.min(maxX, player.x));
}

// ❌ Bad: Unclear, no comments, inconsistent
function upd(p,i,dt){p.x+=i.l?-250*dt:i.r?250*dt:0;p.x=Math.max(0,Math.min(800,p.x));}
```

### Common Tasks

#### Adding a New Enemy Type

**Files to modify:**
1. `src/game/config.js` - Add configuration
2. `src/render/sprites.js` - Add sprite function
3. `src/render/draw.js` - Add drawing logic
4. `src/game/enemies.js` - Add spawn logic (if needed)

**Example:**
```javascript
// 1. config.js
export const ENEMY_CONFIG = {
    POINTS: {
        red: 10,
        pink: 20,
        purple: 30,
        gold: 50      // NEW: Gold enemies
    }
};

// 2. sprites.js
export function goldStarShape(ctx, scale = 1.0) {
    // Draw a star shape
    // ... bezier curves ...
}

// 3. draw.js
export function drawEnemy(ctx, enemy, pulse) {
    if (enemy.rowType === 'gold') {
        ctx.fillStyle = '#FFD700';
        goldStarShape(ctx, pulse);
        ctx.fill();
    }
    // ... existing code ...
}

// 4. enemies.js (if changing formation)
// Modify initEnemies() to include gold row
```

#### Adding a Power-Up

**Files to modify:**
1. `src/game/entities.js` - Add entity type
2. `src/game/collisions.js` - Add collision detection
3. `src/render/draw.js` - Add visual
4. `src/game/player.js` - Add effect logic

**Example:**
```javascript
// 1. entities.js
export function createPowerUp(x, y, type) {
    return {
        type: 'powerup',
        powerType: type, // 'speed', 'shield', 'multishot'
        x, y,
        width: 30,
        height: 30,
        alive: true
    };
}

// 2. collisions.js
// In resolveCollisions()
for (const powerup of entities.powerups) {
    if (checkCollision(player, powerup)) {
        applyPowerUp(player, powerup.powerType);
        powerup.alive = false;
    }
}

// 3. player.js
export function applyPowerUp(player, type) {
    switch(type) {
        case 'speed':
            player.speedBoost = 2.0;
            player.boostTimer = 5000; // 5 seconds
            break;
        // ... other power-ups ...
    }
}
```

#### Adding a New Sound Effect

**File to modify:** `src/audio/audio.js`

**Example:**
```javascript
/**
 * Play power-up collection sound
 */
export function playSfxPowerUp() {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    // Create oscillator
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Ascending arpeggio
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.setValueAtTime(800, now + 0.05);
    osc.frequency.setValueAtTime(1200, now + 0.10);
    
    // Envelope
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    // Connect and play
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
}
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Game starts without errors
- [ ] Player moves smoothly
- [ ] Shooting works correctly
- [ ] Enemies move and shoot properly
- [ ] Collisions detect accurately
- [ ] Level transitions work
- [ ] Game over displays correctly
- [ ] High score persists
- [ ] Audio plays (after first interaction)
- [ ] Canvas resizes properly
- [ ] No console errors
- [ ] Performance is smooth (60 FPS)

### Edge Cases to Test
- Rapid key pressing
- Holding multiple keys simultaneously
- Resizing browser window during gameplay
- Tab switching (game should pause/resume correctly)
- Very long play sessions (memory leaks?)
- Multiple quick deaths
- Hitting pause repeatedly
- Shooting at maximum fire rate

### Browser Testing
Test in at least:
- ✅ Chrome/Edge (primary)
- ✅ Firefox
- ✅ Safari (if on macOS)

## 📚 Documentation Standards

### Code Comments
Use JSDoc format for functions:

```javascript
/**
 * Brief description of what the function does
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
export function myFunction(paramName) {
    // Implementation
}
```

### Inline Comments
Explain **why**, not **what**:

```javascript
// ✅ Good: Explains reasoning
// Clamp to max delta to prevent physics explosion when tab is backgrounded
deltaTime = Math.min(deltaTime, MAX_DELTA_TIME);

// ❌ Bad: Just repeats the code
// Set deltaTime to minimum of deltaTime and MAX_DELTA_TIME
deltaTime = Math.min(deltaTime, MAX_DELTA_TIME);
```

### Update Documentation
If you change behavior, update:
- `README.md` - User-facing changes
- `docs/ARCHITECTURE.md` - Technical changes
- `docs/spec.md` - Game rule changes
- Inline code comments

## 🎨 Code Style Guide

### Naming Conventions
```javascript
// Variables and functions: camelCase
const playerSpeed = 250;
function updatePlayer() {}

// Constants: UPPER_SNAKE_CASE
const MAX_ENEMIES = 55;
const SHOOT_COOLDOWN = 500;

// Classes (if used): PascalCase
class EntityManager {}
```

### File Organization
```javascript
// 1. Imports
import { something } from './module.js';

// 2. Constants
const LOCAL_CONSTANT = 10;

// 3. Module state (if needed)
let moduleState = null;

// 4. Public functions
export function publicFunction() {}

// 5. Private helper functions
function privateHelper() {}
```

### Formatting
- **Indentation:** 4 spaces (not tabs)
- **Line length:** Keep under 100 characters when possible
- **Semicolons:** Optional but be consistent
- **Quotes:** Single quotes preferred, but be consistent
- **Spacing:** Space after keywords, around operators

## 🐛 Debugging Tips

### Console Logging
Use descriptive logs with emojis:

```javascript
console.log('🎮 Game state:', currentState);
console.log('💥 Collision detected:', entity1, entity2);
console.log('🏆 New high score:', score);
console.error('❌ Error in system:', error);
console.warn('⚠️ Strange behavior detected:', data);
```

### Common Issues

**Problem:** Changes don't appear
- **Solution:** Hard refresh (Ctrl+Shift+R) to bypass cache

**Problem:** "Cannot use import statement"
- **Solution:** Must use HTTP server, not file:// protocol

**Problem:** Audio doesn't play
- **Solution:** Browser requires user interaction first

**Problem:** Game runs slow
- **Solution:** Check for infinite loops, excessive logging, or memory leaks

### DevTools
- **Console:** View errors and logs
- **Sources:** Set breakpoints in code
- **Performance:** Profile FPS and bottlenecks
- **Network:** Check if files load correctly

## 🎯 Feature Ideas

### Easy Additions
- New enemy formations
- Additional bonus items
- More sound effects
- Different difficulty modes
- Customizable controls
- Color themes

### Medium Difficulty
- Mobile touch controls
- Gamepad support
- Achievements system
- Local multiplayer (split keyboard)
- Boss enemies
- Special weapons

### Advanced Features
- Level editor
- Replay system
- Online leaderboards
- Procedural level generation
- Particle system improvements
- Advanced audio (background music)

## 📋 Pull Request Guidelines

### Before Submitting
1. **Test thoroughly** - Play the game, check all features
2. **No console errors** - Clean console log
3. **Documentation updated** - Relevant docs reflect changes
4. **Code commented** - Explain complex sections
5. **Follows style guide** - Consistent with existing code

### PR Description Template
```markdown
## Description
Brief description of what changed and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Enhancement
- [ ] Documentation

## Testing Performed
- [ ] Manual gameplay testing
- [ ] Edge case testing
- [ ] Cross-browser testing

## Screenshots/Videos
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested in multiple browsers
```

## 🤝 Community Guidelines

### Be Respectful
- Constructive feedback only
- Assume good intentions
- Help others learn

### Be Educational
- Explain your reasoning
- Share knowledge freely
- Point to resources

### Be Collaborative
- Discuss before major changes
- Consider backward compatibility
- Think about other users

## 📞 Getting Help

### Resources
1. **Documentation**
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical details
   - [spec.md](docs/spec.md) - Game rules
   - [docs/README.md](docs/README.md) - Documentation index

2. **Code Examples**
   - Look at existing similar features
   - Study well-commented modules
   - Check git history for context

3. **External Resources**
   - [MDN Web Docs](https://developer.mozilla.org/) - Web APIs
   - [JavaScript.info](https://javascript.info/) - JS tutorials
   - [Game Programming Patterns](https://gameprogrammingpatterns.com/) - Design patterns

### Questions?
- Check existing documentation first
- Search code for similar patterns
- Ask in issues/discussions
- Be specific about what you've tried

## 🎉 Recognition

Contributors are recognized in:
- Git commit history
- [CREDITS.md](docs/CREDITS.md)
- Release notes

Thank you for contributing to Love Invaders! 💕🎮

---

**Remember:** The best code is code that others can understand and learn from. Write for humans first, computers second!
