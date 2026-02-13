# Agent Orchestration

A minimal multi-agent system with an orchestrator, a planner, a coder, and a designer working together providing orchestration between Claude, Codex and Gemini.

## Overview

This repository demonstrates agent orchestration using custom GitHub Copilot agents. The system consists of four specialized agents that work together to handle complex software development tasks:

- **Orchestrator** - The main coordinator that breaks down requests and delegates to specialist agents
- **Planner** - Creates detailed implementation strategies and technical plans
- **Coder** - Writes code following mandatory coding principles
- **Designer** - Handles all UI/UX and design tasks

## Installation

Install all agents into VS Code or VS Code Insiders:

| Agent | Type | Description | Install Links |
| ----- | ---- | ----------- | ------------- |
| **Orchestrator**<br/>(Claude Sonnet 4.5) | Agent | Architect agent that orchestrates work through subagents (Sonnet, Codex, Gemini) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Forchestrator.agent.md) |
| **Planner**<br/>(GPT-5.2) | Agent | Creates comprehensive implementation plans by researching the codebase, consulting documentation, and identifying edge cases | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fplanner.agent.md) |
| **Coder**<br/>(Claude Opus 4.6) | Agent | Writes code following mandatory coding principles (GPT-5.2-Codex) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fcoder.agent.md) |
| **Designer**<br/>(Gemini 3 Pro) | Agent | Handles all UI/UX and design tasks (Gemini 3 Pro) | [![VS Code](https://img.shields.io/badge/VS_Code-Install-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md)<br/>[![VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://aka.ms/awesome-copilot/install/agent?url=vscode-insiders%3Achat-agent%2Finstall%3Furl%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2Fyortch%2Fagent-orchestration%2Fmain%2F.github%2Fagents%2Fdesigner.agent.md) |

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

Based on the ultralight orchestration pattern by Burke Holland.