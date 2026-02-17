# Love Invaders - Quick Reference

## How to Play

### Controls
- **Arrow Keys** or **A/D**: Move Cupid left and right
- **SPACE**: Fire love arrow (only 1 on screen at a time)
- **P**: Pause/Resume game
- **ENTER**: Restart game (on Game Over screen)

### Objective
Shoot all the hearts before they reach you. Complete as many levels as you can!

### Scoring
- **Red Hearts** (bottom row): 10 points
- **Pink Hearts** (middle rows): 20 points
- **Purple Hearts** (top rows): 30 points

### Rules
- You have **3 lives** (❤️❤️❤️)
- Getting hit by an enemy projectile loses 1 life
- Brief invincibility after being hit
- Shields protect you but can be destroyed
- Enemies move faster as you destroy them
- Each level is harder than the last

## Win/Lose Conditions

### You Win When:
✅ All 55 hearts are destroyed  
→ "LEVEL CLEARED!" appears  
→ Wait 3 seconds  
→ Next level begins (harder!)

### You Lose When:
❌ **Lives reach 0**: "Cupid's arrows have run out..."  
❌ **Hearts reach you**: "The hearts reached you!"

## Level Progression

### What Changes Each Level:
- 🏃 Hearts move **15% faster**
- 💘 Hearts shoot **more frequently**
- 💪 Difficulty keeps increasing

### What Stays:
- ✔️ Your score
- ✔️ Your remaining lives
- ✔️ Your high score

### What Resets:
- 🔄 Full enemy formation (55 hearts)
- 🔄 Shields back to full health
- 🔄 All projectiles cleared

## HUD Elements

```
┌─────────────────────────────────────────────────┐
│ SCORE              💕 LEVEL 1 💕      HIGH SCORE │
│ 000000                                   000000  │
│                                                  │
│                  [Game Area]                     │
│                                                  │
│ LIVES                                            │
│ ❤️❤️❤️                                           │
└─────────────────────────────────────────────────┘
```

## Tips & Strategy

### Beginner Tips
1. **Prioritize top rows first** - They're worth more points (30 vs 10)
2. **Use shields wisely** - Duck behind them when enemy fire is heavy
3. **Stay mobile** - Don't stay in one spot too long
4. **Watch the edges** - Enemies drop down when they reverse
5. **Timing is key** - Only 1 shot on screen, make it count

### Advanced Strategy
1. **Clear columns** - Easier to dodge when enemies form narrow columns
2. **Speed management** - Fewer enemies = faster movement, plan accordingly
3. **Shield conservation** - Try to preserve shields for later levels
4. **Invincibility abuse** - Use your 2-second invincibility to reposition aggressively
5. **Pattern recognition** - Enemy fire patterns become predictable

### Common Mistakes
❌ Hiding under shields too much - They'll be destroyed  
❌ Shooting randomly - Only 1 shot at a time, aim carefully  
❌ Ignoring bottom rows - Clear them early before invasion  
❌ Standing still - Makes you an easy target  
❌ Panic shooting - Wait for your shot to connect first

## Difficulty Levels

| Level | Name | Speed | Fire Rate | Challenge |
|-------|------|-------|-----------|-----------|
| 1 | First Date | 1.0x | Low | Easy |
| 2 | Getting Serious | 1.15x | Medium | Moderate |
| 3 | Love Struck | 1.32x | Medium+ | Challenging |
| 4 | Head Over Heels | 1.52x | High | Hard |
| 5 | Soulmates | 1.75x | High+ | Very Hard |
| 6-9 | Eternal Love | 2.0x+ | Very High | Extreme |
| 10+ | Legendary Romance | 2.5x+ | Maximum | Insane |

## Debug Console Commands

Open browser console (F12) and type:

```javascript
// View current game state
getState()

// View current score
getScore()

// View current level
getLevel()

// View high score
getHighScore()

// Enable debug mode (in config.js)
DEBUG.SHOW_HITBOXES = true      // Show collision boxes
DEBUG.INVINCIBLE_PLAYER = true  // Cannot die
DEBUG.LOG_COLLISIONS = true     // Log all collisions
```

## Troubleshooting

### Game won't start
- Check browser console for errors
- Try refreshing the page (F5)
- Make sure JavaScript is enabled

### High score not saving
- Check if localStorage is enabled
- Some browsers block localStorage in private/incognito mode
- Clear browser cache and try again

### Game running slow
- Close other browser tabs
- Disable browser extensions
- Check if hardware acceleration is enabled

### Controls not working
- Click on the game window to focus it
- Check if keys aren't stuck (press all keys once)
- Try refreshing the page

### Audio not playing
- Audio unlocks on first user interaction (Space to start)
- Check browser volume settings
- Some browsers require user gesture for audio

## Scoring Strategies

### Maximize Your Score

**Early Game (Level 1-2)**:
- Clear purple hearts (top) first: 30 points each
- Total possible per level: 1100 points
- Focus on accuracy over speed

**Mid Game (Level 3-5)**:
- Balance speed and accuracy
- Preserve at least 1 life for safety
- Use shields strategically

**Late Game (Level 6+)**:
- Survival is priority #1
- Every level cleared is an achievement
- Play defensively

### Point Distribution Per Level
```
Row 1 (Purple): 11 hearts × 30 = 330 points
Row 2 (Purple): 11 hearts × 30 = 330 points
Row 3 (Pink):   11 hearts × 20 = 220 points
Row 4 (Pink):   11 hearts × 20 = 220 points
Row 5 (Red):    11 hearts × 10 = 110 points
─────────────────────────────────────────────
Total per level:                1,210 points
```

### High Score Milestones
- 1,000: Decent start
- 5,000: Cleared 4+ levels
- 10,000: Expert player
- 20,000: Master player
- 50,000: Legendary status

## Game States Reference

```
START
  ↓ (Press SPACE)
PLAYING ─→ PAUSED (Press P)
  ↓           ↓
  ↓      (Press P again)
  ↓           ↓
  ↓←──────────┘
  ↓
  ├─→ LEVEL CLEAR (All enemies dead)
  │     ↓ (Wait 3 seconds)
  │     └─→ Back to PLAYING (Next level)
  │
  └─→ GAME OVER (Lives = 0 or Invasion)
        ↓ (Press ENTER)
      START
```

## Quick Facts

- **Max Lives**: 3
- **Starting Level**: 1
- **Enemies per Level**: 55 (5×11 grid)
- **Shields**: 4
- **Player Projectile Limit**: 1 at a time
- **Enemy Projectile Limit**: 3 at a time
- **Invincibility Duration**: 2 seconds after hit
- **Level Clear Delay**: 3 seconds
- **Shot Cooldown**: 500ms

## Browser Support

✅ **Fully Supported**:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

⚠️ **Partial Support**:
- Older browsers may have performance issues
- Some mobile browsers may have control issues

❌ **Not Supported**:
- Internet Explorer (any version)
- Very old mobile browsers

## Performance Tips

### For Best Experience:
1. Use a modern browser (Chrome/Firefox/Edge)
2. Close unnecessary browser tabs
3. Disable heavy browser extensions
4. Use fullscreen mode if available
5. Ensure stable 60 FPS

### If Game is Laggy:
1. Reduce window size
2. Close other applications
3. Check CPU usage
4. Update graphics drivers
5. Try a different browser

## Credits & Info

**Game Type**: Arcade Shooter (Space Invaders clone)  
**Theme**: Valentine's Day / Cupid  
**Target Platform**: Web Browser (HTML5 Canvas)  
**Resolution**: Responsive (scales to window)  
**Frame Rate**: 60 FPS target  

**Inspired By**: Space Invaders (1978)  
**Art Style**: Emoji-based with Valentine theme  
**Sound**: Web Audio API (Basic implementation)  

## Support

Having issues? Check:
1. Browser console for error messages
2. Game logic testing guide: `docs/game-logic-testing.md`
3. Implementation details: `docs/game-logic-complete.md`

## Good Luck! 💘

Remember: Love conquers all! Can you reach level 10?

"Love never gives up!" 💕
