# Level Progression Implementation

## Overview
This document describes the win/lose flow and level progression system implemented in Step 7.

## Win Condition
- **Trigger**: All enemies are destroyed (aliveEnemies.length === 0)
- **Detection**: `checkLevelClearCondition()` in main.js (called every frame during 'playing' state)
- **Action**: Transitions to 'levelclear' state

## Level Clear Flow
1. All enemies destroyed → state changes to 'levelclear'
2. Level clear overlay displays for 3 seconds (LEVEL_CLEAR_DURATION)
3. Game entities remain visible with pulsing "LEVEL X CLEARED!" message
4. After timer expires:
   - Advance to next level: `nextLevel()` increments level counter
   - Clear projectiles and particles: `resetEntitiesForLevel()`
   - Recreate enemies with increased difficulty
   - Reset shields to full health
   - Reset player position (but preserve lives and score)
   - Re-initialize enemy formation with new difficulty
   - Return to 'playing' state

## Difficulty Scaling (Per Level)
Difficulty increases are automatically applied through the levels.js module:

### Speed Increase
- **Formula**: speedMultiplier = (1.15)^(level-1)
- **Implementation**: `getEnemySpeedMultiplier()` in levels.js
- **Usage**: Applied in enemies.js updateEnemies() function
- **Example**: 
  - Level 1: 1.0x speed
  - Level 2: 1.15x speed (+15%)
  - Level 3: 1.32x speed (+32%)

### Fire Rate Increase
- **Formula**: fireRate = BASE_FIRE_RATE + (FIRE_RATE_INCREASE * (level-1))
- **Implementation**: `getEnemyFireRate()` in levels.js
- **Usage**: Applied in enemyFire.js updateEnemyFire() function

### Grid Starting Position
- **Formula**: startY = BASE_START_Y + (START_Y_DROP * (level-1))
- **Implementation**: `getEnemyStartY()` in levels.js
- **Usage**: Applied in entities.js createEnemyGrid() function

## Key Functions

### player.js
- `resetPlayerPosition(player)` - NEW: Resets position only, preserves lives
- `resetPlayer(player)` - EXISTING: Full reset including lives (for new game)

### entities.js
- `resetEntitiesForLevel()` - NEW: Resets entities for next level
  - Clears projectiles and particles
  - Recreates enemy grid with current level difficulty
  - Resets shields to full health
  - Preserves player entity (lives, score)

### main.js
- `checkLevelClearCondition()` - EXISTING: Detects when all enemies are dead
- Level clear logic in update() - MODIFIED: Uses new functions to properly preserve lives

## Persistence Across Levels
- ✅ **Score**: Maintained (never reset between levels)
- ✅ **Lives**: Preserved (only reset on new game)
- ✅ **Level number**: Incremented
- ❌ **Shields**: Reset to full health (classic Space Invaders behavior)
- ❌ **Projectiles**: Cleared
- ❌ **Particles**: Cleared

## Lose Conditions
Two ways to lose (implemented in collisions.js):

1. **Lives Depleted**: Player loses all lives (lives <= 0)
   - Triggers immediate game over
   - Shows final score

2. **Enemy Invasion**: Any enemy reaches player's Y position
   - Instant game over
   - Classic Space Invaders behavior

## Testing Checklist
- [ ] Clear level 1 → advance to level 2 with lives preserved
- [ ] Verify enemies move faster on level 2
- [ ] Verify enemies shoot more frequently on level 2
- [ ] Verify shields reset to full health
- [ ] Verify score persists across levels
- [ ] Verify lives persist across levels
- [ ] Verify level number displays correctly in HUD
- [ ] Verify level clear overlay shows correct level
- [ ] Verify player position resets to center bottom
- [ ] Verify all projectiles are cleared between levels
