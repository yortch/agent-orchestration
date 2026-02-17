# 📚 Documentation Index

Welcome to the Love Invaders documentation! This folder contains comprehensive guides for players, developers, and anyone interested in understanding how the game works.

## 🎯 Quick Navigation

### 🎮 For Players
Start here if you just want to play the game!

- **[Main README](../README.md)** - Game overview, how to run, controls, and features

### 👨‍💻 For Developers
Start here if you want to understand or extend the codebase!

- **[ARCHITECTURE.md](ARCHITECTURE.md)** 📐 - **START HERE!** Complete technical architecture
  - System overview and design principles
  - Module-by-module breakdown with code examples
  - Data flow diagrams
  - Game loop explanation
  - Rendering pipeline
  - Audio system architecture
  - Performance considerations
  - Extension points and how to add features

- **[CREDITS.md](CREDITS.md)** 🙏 - Credits, acknowledgments, and technology stack
  - Original Space Invaders inspiration
  - All technologies used with explanations
  - Asset credits (spoiler: all procedural!)
  - Development methodology
  - Open source information

### 📋 Design & Specification
Detailed game design documents:

- **[spec.md](spec.md)** - Complete game specification
  - Core mechanics
  - Controls mapping
  - Win/lose conditions
  - Scoring system
  - Level progression
  - Screen layouts

- **[theme.md](theme.md)** - Valentine's theme and visual design
  - Color palette
  - Visual style guide
  - Asset design philosophy

### 🛠️ Implementation Details
Deep dives into specific systems:

- **[game-logic-complete.md](game-logic-complete.md)** - Game logic verification
  - Win/lose condition implementation
  - Level progression details
  - Game state management
  - Testing performed

- **[level-progression-implementation.md](level-progression-implementation.md)** - Level system
  - Difficulty scaling formulas
  - Speed calculations
  - Fire rate progression

- **[coordinate-system.md](coordinate-system.md)** - Canvas coordinate system
  - Position calculations
  - Coordinate transformations
  - Boundary handling

- **[definition-of-done.md](definition-of-done.md)** - Quality criteria
  - Completion checklist
  - Testing standards

- **[quick-reference.md](quick-reference.md)** - Developer quick reference
  - Common patterns
  - Key functions
  - Debug tips

## 📖 Documentation Overview

### Architecture Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                    README.md                        │
│              (User-Facing Overview)                 │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  ARCHITECTURE.md │    │    CREDITS.md    │
│   (Technical)    │    │ (Acknowledgments)│
└────────┬─────────┘    └──────────────────┘
         │
         ├─── spec.md (Design)
         ├─── theme.md (Visual)
         ├─── coordinate-system.md
         ├─── game-logic-complete.md
         └─── level-progression-implementation.md
```

## 🚀 Recommended Reading Paths

### Path 1: "I want to understand the game technically"
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete system overview
2. **[spec.md](spec.md)** - Game rules and mechanics
3. Explore `../src/` - Read the well-commented code

### Path 2: "I want to modify gameplay"
1. **[spec.md](spec.md)** - Understand game rules
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Find the relevant module
3. **`../src/game/config.js`** - Adjust constants first
4. Relevant module files - Make targeted changes

### Path 3: "I want to add a new feature"
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the system
2. **Extension Points section** - See how to add features
3. Example: Adding a new enemy type:
   - `src/render/sprites.js` - Add sprite function
   - `src/game/config.js` - Add configuration
   - `src/render/draw.js` - Add drawing logic

### Path 4: "I'm studying game development"
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Learn patterns
2. **Specific systems** of interest:
   - Game Loop: `src/game/loop.js` + Architecture
   - State Machine: `src/game/state.js` + Architecture
   - Collision Detection: `src/game/collisions.js` + Architecture
   - Entity Management: `src/game/entities.js` + Architecture
3. **[CREDITS.md](CREDITS.md)** - See technologies and learn more

### Path 5: "I'm teaching/presenting this project"
1. **[README.md](../README.md)** - Demo the game first
2. **[spec.md](spec.md)** - Explain the rules
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Show the clean architecture
4. **[CREDITS.md](CREDITS.md)** - Discuss technologies and design decisions

## 💡 Key Takeaways from Documentation

### For Understanding the Game
- **It's Space Invaders** - Classic arcade gameplay with Valentine's twist
- **No Assets** - Everything is procedural (code-generated)
- **Pure Vanilla JS** - No frameworks, just clean ES6 modules
- **Educational** - Clean code designed to be learned from

### For Using the Code
- **Well-Structured** - Each module has single responsibility
- **Configurable** - `config.js` has all tunable parameters
- **Documented** - JSDoc comments throughout
- **Extensible** - Clear extension points in architecture

### For Learning Game Dev
- **Game Loop Pattern** - Delta time for frame-rate independence
- **State Machine** - Clean state transitions
- **Entity-Component** - Flexible entity management
- **Collision Detection** - AABB algorithm
- **Procedural Graphics** - Canvas API bezier curves
- **Audio Synthesis** - Web Audio API oscillators

## 🔍 Finding Specific Information

### "How does X work?"

| Topic | Look Here |
|-------|-----------|
| Game loop timing | [ARCHITECTURE.md](ARCHITECTURE.md) → Game Loop section |
| Player movement | [ARCHITECTURE.md](ARCHITECTURE.md) → Player System section |
| Enemy AI | [ARCHITECTURE.md](ARCHITECTURE.md) → Enemy System section |
| Collision detection | [ARCHITECTURE.md](ARCHITECTURE.md) → Collision Detection section |
| Audio system | [ARCHITECTURE.md](ARCHITECTURE.md) → Audio System section |
| Particle effects | [ARCHITECTURE.md](ARCHITECTURE.md) → Particle System section |
| Level difficulty | [level-progression-implementation.md](level-progression-implementation.md) |
| Scoring rules | [spec.md](spec.md) → Scoring System section |
| Color scheme | [theme.md](theme.md) + [CREDITS.md](CREDITS.md) |
| Canvas scaling | [ARCHITECTURE.md](ARCHITECTURE.md) → Canvas System section |

### "How do I change X?"

| What to Change | Where to Look |
|----------------|---------------|
| Game speed | `src/game/config.js` → `PLAYER_CONFIG.SPEED`, `ENEMY_CONFIG.BASE_SPEED` |
| Lives count | `src/game/config.js` → `PLAYER_CONFIG.STARTING_LIVES` |
| Point values | `src/game/config.js` → `ENEMY_CONFIG.POINTS` |
| Colors | `src/render/draw.js` → `COLORS` object |
| Difficulty curve | `src/game/config.js` → `LEVEL_CONFIG` |
| Sound effects | `src/audio/audio.js` → Individual `playSfx*()` functions |
| Enemy layout | `src/game/config.js` → `ENEMY_CONFIG.ROWS/COLS` |
| Shield health | `src/game/config.js` → `SHIELD_CONFIG` |

### "I want to add X feature"

| Feature | Guide |
|---------|-------|
| New enemy type | [ARCHITECTURE.md](ARCHITECTURE.md) → Extension Points |
| New bonus item | [ARCHITECTURE.md](ARCHITECTURE.md) → Extension Points |
| Power-ups | [ARCHITECTURE.md](ARCHITECTURE.md) → Extension Points |
| Difficulty modes | [ARCHITECTURE.md](ARCHITECTURE.md) → Extension Points |
| Mobile controls | Study `src/game/input.js` + add touch handlers |
| Gamepad support | Study `src/game/input.js` + add gamepad API |
| New sound effects | Study `src/audio/audio.js` + Web Audio API |

## 📊 Documentation Statistics

- **Total Documentation Files:** 10+
- **Total Lines:** ~5,000+ lines of documentation
- **Code Comments:** Extensive JSDoc throughout source
- **Diagrams:** Multiple data flow and architecture diagrams

## 🎓 External Learning Resources

### Web Technologies
- **[MDN - Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)** - Complete Canvas reference
- **[MDN - Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Audio synthesis guide
- **[JavaScript.info](https://javascript.info/)** - Modern JavaScript tutorial

### Game Development
- **[Game Programming Patterns](https://gameprogrammingpatterns.com/)** - Essential patterns (free online book)
- **[Red Blob Games](https://www.redblobgames.com/)** - Interactive game dev tutorials
- **[Eloquent JavaScript](https://eloquentjavascript.net/)** - Advanced JS concepts

### Space Invaders History
- **[Space Invaders Wikipedia](https://en.wikipedia.org/wiki/Space_Invaders)** - Game history
- **Classic Space Invaders Videos** - Study the original gameplay

## 📝 Documentation Maintenance

This documentation is kept up to date with the code. If you find any discrepancies:

1. Check the actual source code (it's the source of truth)
2. Update documentation to match
3. Add comments explaining complex sections
4. Keep examples realistic and tested

## 💬 Questions?

If something isn't clear in the documentation:

1. **Check ARCHITECTURE.md** - Most technical questions answered there
2. **Read the code** - It's well-commented and readable
3. **Search existing docs** - Use Ctrl+F across all files
4. **Open an issue** - Help us improve the docs!

---

**Happy learning and building! 💕🎮**

*Remember: The best way to learn is by doing. Clone the repo, run the game, make changes, and see what happens!*
