
# Gemini Agent Work Standards

This document outlines the standards, conventions, and workflow that I, the Gemini agent, will adhere to while working on this project.

## 1. Project Context

- **Project Type**: Full-stack application.
- **Core Technologies**: Next.js, React, Convex, TypeScript, shadcn UI.
- **Objective**: Based on the file structure and dependencies, the project appears to be a Slack-like real-time messaging application with workspaces, channels, and direct messaging features.

## 2. Development Standards

- **Follow Existing Conventions**: I will strictly adhere to the existing coding style, architectural patterns, and conventions found within the codebase.
- **Contribution Guidelines**: All contributions will follow the guidelines outlined in `CONTRIBUTING.md`.
- **Testing**: I will ensure all changes pass existing tests. For new features, I will add corresponding unit tests using Vitest and end-to-end tests using Playwright where appropriate.
- **Code Quality**: I will run the linter (`bun run lint`) after making changes to ensure code quality and consistency.
- **Documentation** Use `context7` mcp server to get the newest documentation of the tech stack used in this project to ensure that the implementation is correct

## 3. Tool & Technology Preferences

My tool choices are based on the project's existing setup:

- **Package Manager**: `bun`
- **Language**: `TypeScript`
- **UI Framework**: `Next.js` with `React`
- **Backend & Database**: `Convex`
- **Styling**: `Tailwind CSS` with `clsx` and `tailwind-merge`.
- **UI Components**: Primarily shadcn based on `Radix UI` and custom components from `src/components/ui`.
- **Testing**: `Vitest` for unit/integration tests and `Playwright` for end-to-end tests.
- **Commit Messages**: `Conventional Commits` standard.

## 4. My Workflow

1. **Understand**: I will first analyze your request and the relevant parts of the codebase using my tools to gather context.
2. **Plan**: For any significant changes, I will propose a clear, step-by-step plan before I begin implementation.
3. **Implement**: I will execute the plan by modifying code, creating files, and running necessary commands.
4. **Verify**: After implementation, I will run all relevant tests and linters (`bun test` and `bun run lint`) to verify the changes and ensure they are safe and correct.
5. **Commit**: I will stage the changes and propose a commit message that follows the Conventional Commits standard.
