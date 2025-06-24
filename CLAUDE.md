# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Root level commands (monorepo management)
pnpm dev:cli           # Run CLI in development mode
pnpm dev:web           # Run web documentation in development mode

# CLI development (run from root or ./cli/)
pnpm --filter ./cli dev     # CLI development mode with ts-node
pnpm --filter ./cli build   # Build CLI for distribution
pnpm --filter ./cli start   # Run built CLI

# Web development (run from root or ./www/)
pnpm --filter ./www dev     # Web dev server with Turbopack
pnpm --filter ./www build   # Build web for production
```

### Testing
```bash
# Run all tests
pnpm test              # Runs both CLI and web tests

# CLI tests only
pnpm test:cli          # or pnpm --filter ./cli test
pnpm --filter ./cli test:watch    # Watch mode
pnpm --filter ./cli test:ui       # UI mode
pnpm --filter ./cli coverage      # With coverage report

# Run single test file
pnpm --filter ./cli test integration.test.ts
```

### Linting
```bash
pnpm lint              # Lint both CLI and web
pnpm lint:cli          # CLI only
pnpm lint:web          # Web only
pnpm --filter ./cli lint:fix      # Auto-fix CLI issues
pnpm --filter ./www lint:fix      # Auto-fix web issues
```

## Architecture

### Monorepo Structure
This is a pnpm monorepo with three main packages:
- **`/cli/`** - The main CLI tool (published as `matt-init`)
- **`/www/`** - Documentation website (Next.js app)
- **Root** - Monorepo orchestration and shared tooling

### CLI Package (`/cli/`)
The CLI is a TypeScript tool that scaffolds Next.js projects with opinionated defaults.

**Core Architecture:**
- **`src/cli.ts`** - Main CLI entry point using Commander.js
- **`src/lib/project-generator.ts`** - Core project generation logic
- **`src/prompts/`** - Interactive prompts using @clack/prompts
- **`src/templates/`** - File templates for generated projects
- **`src/utils/`** - Utilities for git, package managers, directories

**Key Components:**
- **Template System**: Uses `src/templates/` with file prefixes (`_` for dotfiles)
- **Project Generation**: Copies templates, processes them, handles git/deps
- **Interactive Prompts**: Backend setup, database provider, tooling choices
- **Package Manager Detection**: Auto-detects pnpm/npm/yarn/bun

### Testing Strategy
- **Unit Tests**: Individual functions and utilities
- **Integration Tests**: Full CLI flows with temporary directories
- **Test Helpers**: `test/cli/helpers.ts` provides test utilities
- **Coverage**: Excludes templates, configs, and test files

### Build System
- **CLI**: Uses tsup for bundling, cpx for template copying
- **Web**: Standard Next.js build process
- **Templates**: Copied to `dist/templates/` during CLI build

### Development Environment
- **Nix-first**: Primary development environment
- **pnpm workspaces**: Monorepo package management
- **Husky**: Git hooks for linting
- **@antfu/eslint-config**: Shared linting configuration

## Template System

When working with templates in `cli/src/templates/`:
- Prefix files with `_` to generate dotfiles (e.g., `_gitignore` → `.gitignore`)
- Templates are copied during build to `dist/templates/`
- Use existing template structure: `base/`, `backend/drizzle/turso/`, `extras/`
- Template processing happens in `src/lib/project-generator.ts`

## Testing New Changes

Always test CLI changes by running:
```bash
# From cli/ directory
pnpm dev my-test-project
# Follow prompts and verify generated project works
```

The CLI creates real projects in temporary directories during testing - clean up manually if needed.