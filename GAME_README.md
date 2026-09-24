# 💘 Valentine's Space Invaders 💘

A Valentine's Day themed version of the classic Space Invaders arcade game, implemented from scratch using vanilla HTML5, CSS3, and JavaScript.

## 🎮 How to Play

1. Open `index.html` in a modern web browser
2. Click "Start Game" to begin
3. Use **Arrow Keys** (← →) to move your heart-shaped spaceship
4. Press **Spacebar** to shoot hearts at the invading cupids
5. Press **P** to pause/unpause the game

## 🎯 Game Features

### Core Gameplay
- **Heart-Shaped Player**: Control a heart that shoots love projectiles
- **Cupid Enemies**: Face waves of winged love bugs in formation
- **Shooting Mechanics**: Fire hearts upward while enemies shoot arrows downward
- **Collision Detection**: Precise hit detection for all game entities
- **Scoring System**: Earn points based on enemy row position
- **Lives System**: Start with 3 lives, lose one when hit by enemy projectiles
- **Level Progression**: Enemies get faster and shoot more frequently as you advance

### Valentine's Theme
- **Color Palette**: Pink, purple, and magenta gradient backgrounds
- **Custom Graphics**: Hand-drawn hearts, cupids with wings, and particle effects
- **Romantic Atmosphere**: Starry night sky backdrop with glowing effects

### Game States
- **Start Screen**: Welcome screen with instructions
- **Playing**: Active gameplay
- **Paused**: Freeze game with P key
- **Game Over**: Display final score with replay option

### Visual Effects
- **Particle System**: Explosion effects when enemies are destroyed or player is hit
- **Smooth Animations**: 60 FPS game loop using requestAnimationFrame
- **Gradient Backgrounds**: Beautiful pink-to-purple gradients
- **Glowing Effects**: CSS shadows and backdrop filters

## 🛠️ Technical Implementation

### Architecture
- **Single Page Application**: No dependencies, pure vanilla JavaScript
- **Object-Oriented Design**: Player, Enemy, Projectile, and Particle classes
- **Canvas-Based Rendering**: HTML5 Canvas API for all graphics
- **Configuration System**: Centralized CONFIG object for easy tweaking

### File Structure
```
├── index.html    # Main HTML structure
├── style.css     # Valentine's themed styling
├── game.js       # Complete game logic
└── GAME_README.md # This file
```

### Key Components

#### Player Class
- Heart-shaped spaceship with bezier curve drawing
- Keyboard-controlled movement
- Shooting with cooldown system

#### Enemy Class
- Cupid/love bug design with wings
- Formation movement (left-right with downward steps)
- Random shooting behavior

#### Projectile Class
- Player fires hearts upward
- Enemies fire arrows/broken hearts downward
- Automatic cleanup when off-screen

#### Particle Class
- Explosion effects on collisions
- Fade-out animation
- Random velocity spread

## 🎨 Design Choices

1. **Heart Shapes**: Player and projectiles use mathematical bezier curves to create smooth heart shapes
2. **Cupid Design**: Enemies feature a small heart body with elliptical wings
3. **Color Scheme**: Pink (#ff1493), light pink (#ff69b4), purple (#8b008b) for romantic Valentine's feel
4. **Starry Background**: Procedurally generated stars for depth
5. **Particle Effects**: Visual feedback for all collision events

## 🚀 Performance

- **60 FPS**: Smooth gameplay using requestAnimationFrame
- **Efficient Rendering**: Only draws visible entities
- **Memory Management**: Automatic cleanup of off-screen projectiles and dead particles
- **No Dependencies**: Lightweight with no external libraries

## 🎯 Game Balance

- **Starting Difficulty**: Moderate pace with 4 rows of 8 enemies
- **Progression**: Each level increases enemy speed by 0.3 and shoot chance
- **Scoring**: Front row enemies worth 10 points, scaling up by row
- **Player Cooldown**: 300ms between shots to prevent spam

## 📝 Code Highlights

- **Clean Architecture**: Separation of concerns with distinct classes
- **Configurable**: All game parameters in CONFIG object
- **Maintainable**: Clear variable names and logical structure
- **Extensible**: Easy to add new enemy types, power-ups, or features

## 🎮 Controls Summary

| Key | Action |
|-----|--------|
| ← → | Move left/right |
| Space | Shoot |
| P | Pause/Resume |

## 🏆 Winning

Clear all enemies to advance to the next level. The game continues indefinitely with increasing difficulty until you run out of lives.

## ❤️ Enjoy!

Have fun defending Earth from the cupid invasion in this Valentine's Day twist on a classic arcade game!
