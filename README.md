# Agent Orchestration

A minimal multi-agent system with an orchestrator, a planner, a coder, and a designer working together providing orchestration between Claude, Codex and Gemini.

## Overview

This repository demonstrates agent orchestration using custom GitHub Copilot agents. The system consists of four specialized agents that work together to handle complex software development tasks:

- **Orchestrator** - The main coordinator that breaks down requests and delegates to specialist agents
- **Planner** - Creates detailed implementation strategies and technical plans
- **Coder** - Writes code following mandatory coding principles
- **Designer** - Handles all UI/UX and design tasks

## Prerequisites

Before using the agent orchestration system, ensure you have the following installed:

- **VS Code 109.2 or later** - This system was tested using VS Code 109.2
- **VS Code Insiders 110 or later** - Currently required for the memory tool functionality
- **Context7 MCP** - Provides agents access to up-to-date documentation
  1. Open Extensions tab (Ctrl + Shift + X)
  2. Search for `@mcp context7`
  3. Click Install
  4. The custom agent files reference the Context7 MCP server as `context7/*` in their tool definitions. If named differently, locate your `mcp.json` file and rename the server from `io.github.upstash/context7` to `context7`. Alternatively, you can update the `tools` array in each `.agent.md` file to reference the full server name
- **GitHub MCP Server** - Enables GitHub integration for the agents

## Installation

Install all agents into VS Code or VS Code Insiders:

| Agent | Type | Description | Install Links |
| ----- | ---- | ----------- | ------------- |
| **Orchestrator**<br/>(Claude Sonnet 4.5) | Agent | Architect agent that orchestrates work through subagents (Sonnet, Codex, Gemini) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md) |
| **Planner**<br/>(GPT-5.2) | Agent | Creates comprehensive implementation plans by researching the codebase, consulting documentation, and identifying edge cases | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md) |
| **Coder**<br/>(GPT-5.3-Codex) | Agent | Writes code following mandatory coding principles (GPT-5.3-Codex) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md) |
| **Designer**<br/>(Gemini 3 Pro) | Agent | Handles all UI/UX and design tasks (Gemini 3 Pro) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md) |

## Usage

1. Install the agents using the links above
2. Open VS Code or VS Code Insiders
3. Use the Orchestrator agent in the chat panel
4. Send your prompt and let the orchestrator coordinate the work

## Key Features

- **Parallel Execution**: Tasks that don't conflict can run simultaneously
- **File Conflict Prevention**: Agents are scoped to specific files to avoid conflicts
- **Structured Workflow**: Clear phases ensure dependencies are respected
- **Best Practices**: Each agent follows specialized principles for their domain
- **Documentation-First**: Agents verify current documentation before implementation

## Agent Definitions

All agent definitions are stored in `.github/agents/`:
- `orchestrator.agent.md` - Main orchestration logic
- `planner.agent.md` - Planning and research workflow
- `coder.agent.md` - Coding principles and standards
- `designer.agent.md` - Design philosophy and approach

## Experiment: Valentine's Space Invaders

To evaluate the orchestration system, the same prompt was given to the Orchestrator agent across three separate branches, each using different model configurations for the custom agents. All three were implemented using VS Code and the Orchestrator agent.

> **Prompt used:** _"Implement a valentine's theme version of the Space Invader game from scratch"_

### Agent Models Per Branch

| Agent | `space-invaders-vscode` | `space-invaders-fast-vscode` | `space-invaders-gpt-codex-5-3-coder` |
|-------|------------------------|------------------------------|--------------------------------------|
| **Orchestrator** | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Sonnet 4.5 |
| **Planner** | GPT-5.2 | GPT-5.3-Codex | GPT-5.2 |
| **Coder** | Claude Opus 4.6 | Claude Opus 4.6 (fast mode) | GPT-5.3-Codex |
| **Designer** | Gemini 3 Pro (Preview) | Gemini 3 Flash (Preview) | Gemini 3 Pro (Preview) |

### Screenshots

| `space-invaders-vscode` | `space-invaders-fast-vscode` | `space-invaders-gpt-codex-5-3-coder` |
|------------------------|------------------------------|--------------------------------------|
| ![space-invaders-vscode](assets/images/vscode-screenshot.png) | ![space-invaders-fast-vscode](assets/images/fast-screenshot.png) | ![space-invaders-gpt-codex-5-3-coder](assets/images/codex-screenshot.png) |

### Feature Completeness Comparison

| Feature | `space-invaders-vscode` | `space-invaders-fast-vscode` | `space-invaders-gpt-codex-5-3-coder` |
|---------|------------------------|------------------------------|--------------------------------------|
| Player movement & shooting | ✅ | ✅ | ✅ |
| Enemy grid & movement | ✅ | ✅ | ✅ |
| Enemy shooting | ✅ | ⚠️ Random (not column-based) | ✅ |
| Shields/barriers | ✅ Degradable | ❌ Missing | ❌ Missing |
| Scoring system | ✅ | ✅ (bug: dead enemies re-hittable) | ✅ |
| Lives system | ✅ | ✅ | ✅ |
| Level progression | ✅ | ✅ | ✅ |
| Bonus/mystery ship | ✅ | ❌ Missing | ❌ Missing |
| Particle effects | ✅ | ✅ | ✅ |
| Sound/audio | ✅ SFX (music wired but not started) | ⚠️ SFX only (music stubbed) | ✅ Procedural SFX |
| Responsive design | ✅ | ✅ | ⚠️ Fixed logical viewport |
| High score persistence | ✅ localStorage | ❌ Missing | ⚠️ In-memory only |
| Pause functionality | ✅ | ✅ | ⚠️ Auto-pause on blur only |
| Game states (start/play/over) | ✅ | ⚠️ No start screen | ✅ |
| **Feature Score** | **13.5 / 14** | **8.5 / 14** | **10.5 / 14** |

### Quality Metrics Comparison

| Metric | `space-invaders-vscode` | `space-invaders-fast-vscode` | `space-invaders-gpt-codex-5-3-coder` |
|--------|------------------------|------------------------------|--------------------------------------|
| **Source Files** | 22 | 16 | 27 |
| **Lines of Code** | ~6,282 | ~3,117 | ~2,423 |
| **Module System** | ES Modules | Script tags + globals | ES Modules |
| **Maintainability** | 7/10 | 6/10 | 7/10 |
| **Enterprise Robustness** | 5/10 | 4/10 | 5/10 |
| **Config Externalization** | Centralized config.js | Centralized config.js | Scattered in modules |
| **Documentation** | Extensive (docs/) | README only | README + theme/audio docs |
| **Runtime Correctness** | ⚠️ Required follow-up fixes | ⚠️ Required follow-up fixes | ✅ Worked on first run |

### Analysis by Agent Role

**Orchestrator: Claude Sonnet 4.5 vs Claude Haiku 4.5**
- Sonnet 4.5 (used in `space-invaders-vscode` and `gpt-codex-5-3-coder`) produced more complete feature sets and better-structured execution plans. Both branches using Sonnet achieved higher feature completeness scores.
- Haiku 4.5 (`space-invaders-fast-vscode`) was faster but missed key features (shields, bonus ship, start screen, high score persistence), suggesting it delegated less comprehensively to sub-agents.
- **Verdict:** Sonnet 4.5 is the stronger orchestrator for complex multi-feature tasks.

**Planner: GPT-5.2 vs GPT-5.3-Codex**
- GPT-5.2 (`space-invaders-vscode`) produced the most thorough plan, resulting in the highest feature coverage including shields, bonus items, and comprehensive game states.
- GPT-5.3-Codex as planner (`space-invaders-fast-vscode`) produced a viable but less comprehensive plan, missing several classic Space Invaders features.
- **Verdict:** GPT-5.2 performed better as planner, producing more detailed and complete implementation strategies.

**Coder: Claude Opus 4.6 vs Claude Opus 4.6 (fast) vs GPT-5.3-Codex**
- Claude Opus 4.6 (`space-invaders-vscode`) produced the most feature-complete and robust implementation at ~6.3K LOC with proper ES modules, centralized config, and the only branch with shields and bonus items.
- Claude Opus 4.6 fast mode (`space-invaders-fast-vscode`) traded completeness for speed — used script tags instead of ES modules and had correctness bugs (dead enemies remaining collidable).
- GPT-5.3-Codex (`space-invaders-gpt-codex-5-3-coder`) produced clean, well-organized ES module code at ~2.4K LOC with good separation of concerns, but with fewer features implemented. Notably, **GPT-5.3-Codex was the only coder model that produced a working implementation on the first run with no runtime errors**, while both Claude Opus 4.6 branches required follow-up fixes to resolve runtime issues.
- **Verdict:** Claude Opus 4.6 (standard) produced the most complete implementation. GPT-5.3-Codex had the cleanest architecture per LOC and the best first-run correctness. Opus fast mode sacrificed too much quality.

**Designer: Gemini 3 Pro vs Gemini 3 Flash**
- Gemini 3 Pro (Preview) produced cohesive Valentine theming across both branches it was used in, with procedural Canvas graphics and consistent color palettes.
- Gemini 3 Flash (Preview) (`space-invaders-fast-vscode`) delivered a working Valentine theme, but the design felt noticeably weaker and would likely need additional rework to flush out kinks — for example, the shooting range felt off and gameplay polish was lacking compared to the Pro branches.
- **Verdict:** Gemini 3 Pro produced a more polished and complete design. Gemini 3 Flash is viable for quick prototyping but may require more manual refinement for production-quality results.

### Conclusions

1. **Best overall result:** `space-invaders-vscode` (Claude Sonnet 4.5 + GPT-5.2 + Claude Opus 4.6 + Gemini 3 Pro) — highest feature completeness, best documentation, and most maintainable code.
2. **Best code efficiency:** `space-invaders-gpt-codex-5-3-coder` — achieved solid results with the fewest lines of code and cleanest module architecture.
3. **Best first-run correctness:** `space-invaders-gpt-codex-5-3-coder` (GPT-5.3-Codex as Coder) was the only branch that produced a fully working implementation without any runtime errors or follow-up fixes. Both other branches (`space-invaders-vscode` and `space-invaders-fast-vscode`) required manual intervention to fix runtime issues before the game was playable.
4. **Speed vs quality tradeoff:** `space-invaders-fast-vscode` demonstrated that using "fast" model variants across agents reduces implementation time but at a significant cost to feature completeness and code correctness.
5. **Model selection matters most for Orchestrator and Coder roles** — these had the largest impact on output quality. The Planner and Designer roles showed less sensitivity to model tier.

## Play Valentine Invaders Locally

1. Open `index.html` in a modern browser (no build step required), or serve the folder with `python3 -m http.server 4173`.
2. Move with **A / D** or **← →**, shoot with **Space**, pause with **P**.
3. Protect the heart shields, clear each wave, and chase the bonus bouquet ship for extra points.

## Contributing

Feel free to customize the agent definitions in `.github/agents/` to match your team's needs and preferences.

## License

This is a demonstration repository for agent orchestration concepts.

## Credits

Based on the [ultralight orchestration pattern](https://gist.github.com/burkeholland/0e68481f96e94bbb98134fa6efd00436) by [Burke Holland](https://github.com/burkeholland).

For a detailed walkthrough and demonstration, watch the [YouTube video](https://youtu.be/-BhfcPseWFQ?si=VmDWGtHBe1fUcpRY).
