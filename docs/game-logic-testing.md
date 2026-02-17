# Game Logic Testing Guide

## Overview
This document provides a comprehensive testing checklist for the Valentine's Space Invaders game logic system.

## Core Game Flow

### Start Screen → Playing
- [ ] **Test 1.1**: Game starts in 'start' state with title screen visible
- [ ] **Test 1.2**: Pressing SPACE transitions to 'playing' state
- [ ] **Test 1.3**: HUD appears showing Score: 000000, Level 1, High Score
- [ ] **Test 1.4**: Player (Cupid) appears at bottom center
- [ ] **Test 1.5**: Enemies (55 hearts in 5x11 grid) appear
- [ ] **Test 1.6**: 4 shields appear between player and enemies

### Basic Gameplay
- [ ] **Test 2.1**: Arrow keys / A-D move player left and right
- [ ] **Test 2.2**: Player stops at screen edges
- [ ] **Test 2.3**: SPACE fires love arrow upward
- [ ] **Test 2.4**: Only 1 player projectile allowed on screen at once
- [ ] **Test 2.5**: Enemies move horizontally as a group
- [ ] **Test 2.6**: Enemies reverse direction and drop when hitting edge
- [ ] **Test 2.7**: Enemies fire projectiles downward
- [ ] **Test 2.8**: Enemy fire rate is limited (not too many projectiles)

### Collision Detection
- [ ] **Test 3.1**: Player projectile destroys enemy on hit
- [ ] **Test 3.2**: Score increases when enemy destroyed (10/20/30 points)
- [ ] **Test 3.3**: Particle effect appears when enemy hit
- [ ] **Test 3.4**: Player projectile damages shields
- [ ] **Test 3.5**: Enemy projectile damages shields
- [ ] **Test 3.6**: Shields show visual degradation
- [ ] **Test 3.7**: Enemy projectile hitting player reduces lives by 1
- [ ] **Test 3.8**: Player becomes invincible briefly after being hit
- [ ] **Test 3.9**: Lives display updates correctly

## Win Condition Tests

### Level Clear
- [ ] **Test 4.1**: Destroying all enemies triggers 'levelclear' state
- [ ] **Test 4.2**: "LEVEL CLEARED!" overlay appears
- [ ] **Test 4.3**: Current score and level shown on overlay
- [ ] **Test 4.4**: Overlay displays for 3 seconds
- [ ] **Test 4.5**: After overlay, game advances to next level
- [ ] **Test 4.6**: Level number increments (Level 1 → Level 2)
- [ ] **Test 4.7**: Score is preserved across levels
- [ ] **Test 4.8**: Lives are preserved across levels
- [ ] **Test 4.9**: New enemy formation spawns
- [ ] **Test 4.10**: Shields reset to full health
- [ ] **Test 4.11**: All projectiles and particles cleared

### Level Progression & Difficulty
- [ ] **Test 5.1**: Level 2 enemies move faster than Level 1
- [ ] **Test 5.2**: Level 2 enemies shoot more frequently
- [ ] **Test 5.3**: Difficulty continues to increase with each level
- [ ] **Test 5.4**: Enemy speed increases when fewer enemies remain (heartbeat effect)
- [ ] **Test 5.5**: Can complete multiple levels in succession

## Lose Condition Tests

### Lose by Lives Depleted
- [ ] **Test 6.1**: Player starts with 3 lives (❤️❤️❤️ displayed)
- [ ] **Test 6.2**: Getting hit reduces lives to 2
- [ ] **Test 6.3**: Getting hit again reduces lives to 1
- [ ] **Test 6.4**: Getting hit with 1 life triggers 'gameover' state
- [ ] **Test 6.5**: Game over screen shows "Cupid's arrows have run out..."
- [ ] **Test 6.6**: Final score displayed correctly
- [ ] **Test 6.7**: Level reached displayed correctly

### Lose by Enemy Invasion
- [ ] **Test 7.1**: Enemies drop down when reversing at edges
- [ ] **Test 7.2**: If enemy reaches ~85% of screen height, game over triggers
- [ ] **Test 7.3**: Game over screen shows "The hearts reached you!"
- [ ] **Test 7.4**: Game instantly ends when invasion occurs
- [ ] **Test 7.5**: Player marked as not alive

## Game Over & Restart

### Game Over Screen
- [ ] **Test 8.1**: Game over screen shows final score
- [ ] **Test 8.2**: Level reached is displayed
- [ ] **Test 8.3**: High score is displayed
- [ ] **Test 8.4**: If new high score, "NEW HIGH SCORE!" message appears
- [ ] **Test 8.5**: High score is saved to localStorage
- [ ] **Test 8.6**: "Press ENTER to Try Again" message displayed

### Restart Functionality
- [ ] **Test 9.1**: Pressing ENTER on game over transitions to 'start' state
- [ ] **Test 9.2**: Start screen shows updated high score
- [ ] **Test 9.3**: Pressing SPACE from start screen begins new game
- [ ] **Test 9.4**: New game starts with:
  - Score: 0
  - Level: 1
  - Lives: 3
  - Fresh enemy formation
  - Fresh shields
  - Player at center bottom
- [ ] **Test 9.5**: Multiple game loops work correctly (play → lose → restart → play)

## HUD & UI Tests

### Heads-Up Display
- [ ] **Test 10.1**: Score displays in top-left with "SCORE" label
- [ ] **Test 10.2**: Score formatted with leading zeros (000000 format)
- [ ] **Test 10.3**: Level displays in center with "💕 LEVEL X 💕" format
- [ ] **Test 10.4**: High score displays in top-right with "HIGH SCORE" label
- [ ] **Test 10.5**: Lives display in bottom-left with ❤️ icons
- [ ] **Test 10.6**: Lives count matches actual player lives
- [ ] **Test 10.7**: All HUD elements scale properly with window size

## Pause Functionality

### Pause System
- [ ] **Test 11.1**: Pressing P during gameplay pauses the game
- [ ] **Test 11.2**: Pause overlay appears with "⏸ PAUSED ⏸"
- [ ] **Test 11.3**: Game entities freeze (no movement)
- [ ] **Test 11.4**: Pressing P again resumes gameplay
- [ ] **Test 11.5**: Pause instruction visible: "Press P to Resume"

## Edge Cases & Robustness

### Edge Case Testing
- [ ] **Test 12.1**: Window resize doesn't break game state
- [ ] **Test 12.2**: Switching browser tabs and back maintains game state
- [ ] **Test 12.3**: Rapid key presses don't cause issues
- [ ] **Test 12.4**: Clearing level with last enemy maintains proper flow
- [ ] **Test 12.5**: Getting hit during invincibility period doesn't reduce extra lives
- [ ] **Test 12.6**: Projectiles properly cleanup off-screen
- [ ] **Test 12.7**: Shield destruction works correctly when completely destroyed
- [ ] **Test 12.8**: Multiple state transitions in quick succession work properly

## Performance Tests

### Performance Validation
- [ ] **Test 13.1**: Game runs at smooth 60 FPS on modern hardware
- [ ] **Test 13.2**: No memory leaks after extended play
- [ ] **Test 13.3**: Entity cleanup prevents array growth
- [ ] **Test 13.4**: Particle system performs well with many particles

## Success Criteria

All tests should pass for the game to be considered complete. Priority areas:
1. **Critical**: Win/lose conditions work correctly
2. **Critical**: Level progression and difficulty scaling work
3. **Critical**: Game restart functionality works
4. **High**: HUD displays accurate information
5. **High**: Collision detection works reliably
6. **Medium**: Visual polish and animations
7. **Low**: Edge cases and robustness

## Testing Notes

### How to Test
1. Open the game in a browser
2. Open browser console (F12) to see debug logs
3. Follow each test in order
4. Mark tests as passing ✓ or failing ✗
5. Document any issues found

### Debug Tools Available
- **Console Logs**: Game state transitions, collisions, scoring events
- **Browser DevTools**: Performance monitoring, localStorage inspection
- **Config.js DEBUG flags**: Can enable hitbox visualization, invincibility

### Known Limitations
- Audio system implementation is basic (uses placeholder WebAudio unlock)
- No UFO/OFO bonus enemy implemented yet (optional feature)
- Shield visual degradation could be more sophisticated

## Bug Reporting Template

```
**Bug ID**: 
**Severity**: [Critical/High/Medium/Low]
**Test Failed**: [Test number and name]
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: 
**Actual Behavior**: 
**Console Errors**: 
**Additional Notes**: 
```

## Report Generated
Date: [Fill in when testing]
Tester: [Fill in]
Browser: [Fill in]
Pass Rate: [X/Y tests passed]
