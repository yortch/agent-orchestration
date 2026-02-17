# Game Specification: Love Invaders

## 1. Overview
A browser-based arcade shooter where the player controls Cupid to shoot arrows at a descending grid of hearts. The game is built using standard HTML5 Canvas and JavaScript.

## 2. Controls

| Action | Keyboard Input | Description |
| :--- | :--- | :--- |
| **Move Left** | Arrow Left / `A` | Moves the player horizontally to the left. Stops at screen edge. |
| **Move Right** | Arrow Right / `D` | Moves the player horizontally to the right. Stops at screen edge. |
| **Shoot** | Spacebar / `W` / Up | Fires a single Love Arrow upward. Limit to 1 projectile on screen at a time (or short cooldown). |
| **Pause** | `P` | Toggles game pause state. |
| **Restart** | `Enter` | Restricted to Game Over / Win screens. |

## 3. Core Mechanics

### 3.1 Player Movement
*   Smooth movement on the X-axis at the bottom of the canvas.
*   Player has a collision box approx 40x40px.

### 3.2 Enemy Grid (The Hearts)
*   **Formation:** 5 rows of 11 hearts.
*   **Movement:** Grid moves horizontally as a group. When an edge is effectively hit, the entire grid shifts down (Y-axis) by 20px and reverses direction.
*   **Cadence:** Movement speed increases as fewer hearts remain (simulating the "heart rate" going up).

### 3.3 Combat
*   **Player Shooting:** Projectiles travel upward at high speed. Collision with a Heart removes the heart and scores points. Collision with a Shield damages the shield.
*   **Enemy Fire:** Hearts randomly drop projectiles downward. If a projectile hits the player, 1 Life is lost. If it hits a Shield, the shield takes damage.

### 3.4 Shields (Love Letters)
*   4 shields positioned between the player and the enemy grid.
*   Shields have health (e.g., 10 hits). Visual degradation (cracks or tears) occurs at 30%, 60%, and 90% damage.
*   Shields are destructible by both player arrows and enemy kisses.

## 4. Win & Lose Conditions

### Win Condition
*   Primary: All hearts in the grid are destroyed.
*   **Result:** Pause briefly, fancy "Level Clear" animation, then load next level (reset grid, increase difficulty).

### Lose Condition
*   Condition A: Player loses all 3 lives.
*   Condition B: Any heart reaches the Y-position of the player (The "Invasion" succeeds).
*   **Result:** "Game Over" screen with Final Score and "Try Again" button.

## 5. Scoring System

| Target | Points | Nuance |
| :--- | :--- | :--- |
| **Bottom Row (Red)** | 10 | Easy to hit. |
| **Middle Rows (Pink)** | 20 | Medium difficulty. |
| **Top Rows (Purple)** | 30 | Hardest to reach. |
| **Flying Bonus (OFO)** | 100-300 | Random value (100, 150, 200, 250, or 300) in steps of 50. Moves L-to-R or R-to-L at top of screen. |

**Implemented Details:**
- Point values defined in `ENEMY_CONFIG.POINTS` in config.js
- Bonus values range from `SCORING_CONFIG.BONUS_MIN` (100) to `BONUS_CONFIG.BONUS_MAX` (300)
- High scores are persisted in browser localStorage under key `loveInvaders_highScore`
- Score updates in real-time and displays on HUD

## 6. Level Progression

Upon clearing a level:
1.  **Speed Increase:** Enemy horizontal movement speed increases by 15% (multiplicative).
2.  **Fire Rate:** Probability of enemy shooting per frame increases by 0.0003 (additive).
3.  **Grid Drop:** Grid starts 1 row lower (optional - currently disabled, set to 0 in config).
4.  **Dynamic Speed Scaling:** As enemies are destroyed, the remaining enemies move faster (simulates heartbeat acceleration). Speed multiplies up to 3x when 20% or fewer enemies remain.

**Implemented Details:**
- Level progression managed in `levels.js`
- Constants defined in `LEVEL_CONFIG` in config.js
- `SPEED_INCREASE`: 0.15 (15% per level)
- `FIRE_RATE_INCREASE`: 0.0003 per level
- `START_Y_DROP_PER_LEVEL`: 0 (disabled by default)
- `CLEAR_DURATION`: 3.0 seconds to display "Level Clear" message

## 7. Screens & UI

1.  **Start Screen**
    *   Title: "LOVE INVADERS" (pulsing text).
    *   Instruction: "Press Space to Start".
    *   High Score display.

2.  **HUD (Heads Up Display)**
    *   Top Left: Score.
    *   Top Right: High Score.
    *   Bottom Left: Lives (represented by heart icons).

3.  **Game Over Screen**
    *   Text: "HEARTBORKEN!" or "GAME OVER".
    *   Final Score.
    *   Restart prompt.

## 8. Audio Strategy (Web Audio API)

**Implemented:** All sounds are synthesized in real-time using the Web Audio API (no audio files required).

*   *Design Note: Keep sounds synthesized and '8-bit' but soft, not harsh square waves.*
*   **Shoot:** High pitched "Pew" (Triangle wave with rapid pitch drop).
*   **Enemy Hit:** Pleasant "Ding" or "Pop" (Sine wave with envelope).
*   **Player Hit:** Dissonant low "Buzz" or "Crash" (Sawtooth wave).
*   **Movement:** Low rhythmic thrum (simulating a heartbeat) on every enemy step.
*   **Bonus Spawn:** Rising tone sequence when bonus enemy appears.
*   **Bonus Hit:** Triumphant chime when bonus enemy is destroyed.

**Implementation Details:**
- Audio system in `src/audio/audio.js`
- Uses singleton AudioContext with master gain control
- Requires user gesture to enable (browser security policy)
- Master volume set to 0.3 (30%) to prevent harshness
- All sound functions return immediately if AudioContext unavailable

## 9. Polish Features

**Implemented:**
*   **Particles:** When a heart is hit, spawn 8-15 particles (hearts and sparkles) that burst outward and fade. Shield hits spawn 4-8 confetti pieces. Player hits spawn 15-25 explosion particles. All particles have physics with gravity, friction, and lifetime management.
*   **Pulse Animation:** Hearts pulse in scale (0.85-1.15) synced with grid movement for a "heartbeat" effect.
*   **Smooth Movement:** All movement uses deltaTime-based calculations for frame-rate independent physics.
*   **Visual Degradation:** Shields show progressive damage as they take hits.
*   **Score Popups:** Bonus scores briefly display at hit location (100-300 points text).

**Not Yet Implemented:**
*   **Background:** Subtle twinkling stars to give depth.
*   **Shake:** Tiny screen shake when player gets hit.

**Implementation Details:**
- Particle system in `src/game/particles.js`
- Maximum 200 particles enforced for performance
- Three particle presets: enemy hit, shield hit, player hit
- Particles support multiple types: 'heart', 'sparkle', 'confetti', 'debris', 'explosion'
- All rendered in `src/render/draw.js` with alpha fading

## 10. Implementation Status

### Fully Implemented Features
✅ Player movement and shooting (keyboard controls: arrows/WASD, space/W/up to shoot)  
✅ Enemy grid formation and movement (5 rows × 11 columns)  
✅ Enemy shooting with fire rate scaling  
✅ Collision detection (player, enemies, projectiles, shields)  
✅ Destructible shields with visual degradation  
✅ Scoring system with point values per enemy type  
✅ Bonus enemies (ring, chocolate, letter) with random point values  
✅ Particle effects for hits and destruction  
✅ Level progression with difficulty scaling  
✅ High score persistence (localStorage)  
✅ Game state machine (start, playing, paused, game over, level clear)  
✅ Responsive canvas with automatic resizing  
✅ Web Audio API synthesized sound effects  
✅ Procedural rendering (no sprite assets required)  

### Configuration

All gameplay constants are centralized in `src/game/config.js` for easy tuning:

- **PLAYER_CONFIG** - Movement speed, shoot cooldown, starting lives, size
- **ENEMY_CONFIG** - Grid layout, movement speed, fire rate, points per type
- **PROJECTILE_CONFIG** - Sizes, speeds, colors for player and enemy projectiles
- **SHIELD_CONFIG** - Count, size, health, position
- **LEVEL_CONFIG** - Speed increases, fire rate scaling, level clear duration
- **SCORING_CONFIG** - Bonus point ranges, high score storage key
- **COLLISION_CONFIG** - Hitbox scaling factors
- **GAME_CONFIG** - Invasion threshold, cleanup margins
- **DEBUG** - Toggle hitbox display, invincibility, collision logging

### Module Organization

The codebase is organized into clean, single-responsibility modules:

- **game/** - Core game logic and systems
- **render/** - All drawing and visual rendering
- **canvas/** - Canvas setup and resize handling
- **audio/** - Web Audio API sound synthesis

This structure supports easy modification and extension of game features.
