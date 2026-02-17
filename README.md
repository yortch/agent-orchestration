# Agent Orchestration with fast models to implement Space Invaders

A minimal multi-agent system with an orchestrator, a planner, a coder, and a designer working together providing orchestration between Claude, Codex and Gemini.

This project is an **agent orchestration experiment** focused on using **fast models** to keep delegation and execution responsive: **Gemini 3 Flash**, **Claude Opus 4.6 (fast mode)**, and **Claude Haiku 4.5**.

### Why fast models?

- **Lower end-to-end latency** across planner → orchestrator → specialist handoffs.
- **Higher iteration speed** for multi-step coding and design workflows.
- **Better cost/performance tradeoff** for frequent subagent calls in orchestration-heavy tasks.

## Overview

This repository demonstrates agent orchestration using custom GitHub Copilot agents. The system consists of four specialized agents that work together to handle complex software development tasks:

- **Orchestrator** - The main coordinator that breaks down requests and delegates to specialist agents
- **Planner** - Creates detailed implementation strategies and technical plans
- **Coder** - Writes code following mandatory coding principles
- **Designer** - Handles all UI/UX and design tasks

## Game Screenshot

Gameplay screenshot captured with Playwright MCP:

![Cupid's Invasion gameplay screenshot](assets/images/gameplay-playwright.png)

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
| **Orchestrator**<br/>(Claude Haiku 4.5 (copilot)) | Agent | Architect agent that orchestrates work through subagents (Sonnet, Codex, Gemini) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md) |
| **Planner**<br/>(GPT-5.3-Codex (copilot)) | Agent | Creates comprehensive implementation plans by researching the codebase, consulting documentation, and identifying edge cases | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md) |
| **Coder**<br/>(Claude Opus 4.6 (fast mode) (Preview) (copilot)) | Agent | Writes code following mandatory coding principles | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md) |
| **Designer**<br/>(Gemini 3 Flash (Preview) (copilot)) | Agent | Handles all UI/UX and design tasks | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md) |

## Agent Models (from definitions)

The following model values come directly from each custom agent definition file in `.github/agents/`:

| Agent | Model | Definition File |
| ----- | ----- | --------------- |
| Orchestrator | Claude Haiku 4.5 (copilot) | `.github/agents/orchestrator.agent.md` |
| Planner | GPT-5.3-Codex (copilot) | `.github/agents/planner.agent.md` |
| Coder | Claude Opus 4.6 (fast mode) (Preview) (copilot) | `.github/agents/coder.agent.md` |
| Designer | Gemini 3 Flash (Preview) (copilot) | `.github/agents/designer.agent.md` |

## Usage

1. Install the agents using the links above
2. Open VS Code or VS Code Insiders
3. Use the Orchestrator agent in the chat panel
4. Send your prompt and let the orchestrator coordinate the work

Example prompts:
- "Add dark mode to the application"
- "Create a user authentication system"
- "Build a dashboard with data visualization"

## How It Works

### Orchestrator Agent
The orchestrator is the entry point for all requests. It:
1. Analyzes the user's request
2. Calls the Planner agent to create an implementation strategy
3. Parses the plan into execution phases
4. Delegates work to Coder and Designer agents
5. Coordinates parallel execution when possible
6. Validates and reports final results

### Planner Agent
The planner creates comprehensive implementation plans by:
- Researching the codebase thoroughly
- Verifying documentation for libraries and APIs
- Identifying edge cases and error states
- Creating ordered implementation steps
- Noting open questions and uncertainties

### Coder Agent
The coder writes production-quality code following mandatory principles:
- Uses clear, predictable structure
- Prefers flat, explicit code over abstractions
- Keeps control flow linear and simple
- Makes errors explicit and informative
- Writes regenerable code with minimal coupling
- Always consults documentation via context7

### Designer Agent
The designer focuses on:
- Creating optimal user experiences
- Designing accessible interfaces
- Ensuring visual aesthetics
- Prioritizing usability over technical constraints

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

## Example Workflow

For a request like "Add dark mode to the app":

1. **Planning Phase**: Orchestrator calls Planner
   - Planner researches the codebase
   - Creates detailed implementation steps
   - Identifies file dependencies

2. **Execution Phases**:
   - Phase 1: Designer creates color palette and toggle UI (parallel)
   - Phase 2: Coder implements theme context and toggle component (parallel)
   - Phase 3: Coder applies theme tokens across components

3. **Completion**: Orchestrator validates and reports results

## Contributing

Feel free to customize the agent definitions in `.github/agents/` to match your team's needs and preferences.

## License

This is a demonstration repository for agent orchestration concepts.

## Credits

Based on the [ultralight orchestration pattern](https://gist.github.com/burkeholland/0e68481f96e94bbb98134fa6efd00436) by [Burke Holland](https://github.com/burkeholland).

For a detailed walkthrough and demonstration, watch the [YouTube video](https://youtu.be/-BhfcPseWFQ?si=VmDWGtHBe1fUcpRY).