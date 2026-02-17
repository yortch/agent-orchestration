# Valentine's Space Invaders

## Quick Start (Read This First)

This game uses JavaScript ES modules, and modern browsers enforce CORS/security rules for module imports.

You need to run a local web server from the project folder, then open a localhost URL.

## Screenshot

![Valentine Space Invaders Game](screenshots/game-start-screen.png)

A polished, browser-based reimagining of classic Space Invaders with a Valentine's Day theme. The game blends arcade mechanics with a playful romantic aesthetic, featuring procedural Canvas graphics, wave-based difficulty scaling, and lightweight procedural sound design.

## Built with AI Agent Orchestration

This game was created using a multi-agent orchestration system with specialized AI agents:

| Agent | Model | Role |
|-------|-------|------|
| **Orchestrator** | Claude Sonnet 4.5 | Coordinates the project, breaks down tasks, delegates to specialist agents |
| **Planner** | GPT-5.2 | Creates comprehensive implementation plans, researches patterns, identifies edge cases |
| **Coder** | GPT-5.3-Codex | Implements all code following best practices and coding principles |
| **Designer** | Gemini 3 Pro (Preview) | Handles UI/UX design, visual specifications, and aesthetic decisions |

Each agent has specific expertise and tools, working together to deliver a complete, polished game from a single prompt.

## Features

- **Valentine's theme:** Heart-inspired visuals, romantic color palette, and playful enemy styling.
- **Classic arcade mechanics:** Move, shoot, dodge enemy fire, and survive as waves escalate.
- **Procedural graphics:** All game entities and effects are drawn in code (no sprite sheet dependency).
- **Web Audio-powered SFX:** Real-time synthesized sound effects for shooting, hits, wave clear, and game over.

## How to Run

Because the project uses ES module imports, serve it with a static file server (do not open `index.html` directly from disk).

### Option 1: VS Code Live Server

1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html`.
3. Select **Open with Live Server**.

### Option 2: Node.js

From the project root:

```bash
npx serve .
```

Then open the URL shown in your terminal.

```text
http://localhost:3000
```

## Controls

| Action | Key |
|---|---|
| Move left / right | **Arrow Keys** or **A / D** |
| Shoot | **Space** |
| Mute / Unmute | **M** |
| Confirm in menus | **Enter** (Space also works on start/restart screens) |

> Debug overlay: if you add a local debug toggle, `D` is a sensible default key binding to document.

## Game Mechanics

- **Progressive waves:** Each cleared formation starts the next wave with faster invader movement and increased enemy fire pressure.
- **Invader variety:** The formation includes themed enemy variants such as **cupids**, **broken hearts**, and **anti-love badges**.
- **Score system:** Defeating invaders awards points by row, rewarding harder targets with higher values.
- **Lives system:** You start with limited lives, gain brief invulnerability after taking a hit, and lose on final life or if invaders reach your line.

## Architecture Overview

The project follows a modular ES6 architecture with clear runtime boundaries:

- `src/main.js` initializes canvas, input, audio, world state, renderer, and the game loop.
- `src/engine/` handles reusable engine concerns (canvas sizing, input mapping, timing loop, asset utilities).
- `src/game/` contains gameplay logic (state machine, world orchestration, collisions, scoring, lives, enemy behavior, entities).
- `src/render/` contains Canvas drawing logic for entities and scene rendering.
- `src/ui/` manages HUD and screen overlays (start/game-over presentation).
- `src/audio/` provides procedural sound playback via the Web Audio API.

## Technologies Used

- **HTML5 Canvas** for rendering
- **JavaScript (ES6 Modules)** for architecture and game logic
- **Web Audio API** for procedural sound effects
- **CSS3** for page-level styling and presentation

## Credits

- Gameplay inspiration: the original **Space Invaders** arcade formula.
- Visual/audio direction informed by the design notes in `docs/theme.md` and `docs/audio.md`.
- Graphics and SFX are generated procedurally in code for this project.

## License

No license file is currently included.

If you plan to open source this project, **MIT** is a strong default choice for a portfolio-friendly game repository. Consider adding a `LICENSE` file with the MIT text.