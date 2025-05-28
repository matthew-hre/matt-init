# TODO: matt-init Features

## Core CLI Functionality

- [ ] Interactive walkthrough via **Commander** + **Inquirer**
  - [ ] Prompt: Database (Turso, Postgres via Docker, None)
  - [ ] Prompt: Authentication (Better-Auth on/off)
  - [ ] Prompt: CI linting (enable/disable)
  - [ ] Prompt: Editor settings (include/skip)
  - [ ] Prompt: Git pre-commit hooks (Husky + lint-staged)
  - [ ] Prompt: UI library (shadcn/ui, DaisyUI, None)
  - [x] Summary & confirmation screen before scaffolding

- [x] ASCII art styling on Welcome screen and README placeholder
- [x] `--version` and `--help` flags

## Scaffolding Outputs

- [x] **Project Structure**
  - [x] `src/` directory with `~` path alias
  - [x] `flake.nix` and Nix flake config
- [ ] **Next.js Setup**
  - [x] Tailwind CSS
  - [ ] `next-themes` integration
  - [x] Example home page template
- [x] **ESLint**
  - [x] `.eslintrc.js` or equivalent
- [x] **TypeScript**
  - [x] `ts-node` support for CLI
- [ ] **Environment Validation**
  - [ ] `src/lib/env.ts` using Zod for type-safe `.env`
- [x] **README.md**
  - [x] Polished template with ASCII art header and usage examples

## Optional Feature Templates

- **Database**
  - [x] Turso template
  - [ ] Postgres (Docker) template
  - [x] No database stub
- **Auth**
  - [ ] Better-Auth integration
  - [ ] No auth stub
- **CI**
  - [ ] `.github/workflows/lint.yml` for lint checks
- **Editor**
  - [ ] `.editorconfig` and/or `.vscode` settings
- **Pre-commit Hooks**
  - [ ] Husky + lint-staged setup
- **UI Libraries**
  - [ ] shadcn/ui example components
  - [ ] DaisyUI config
  - [ ] No UI boilerplate

## Documentation & Publishing

- [ ] README for `matt-init` with usage
- [ ] GitHub Actions: build & publish on release tag
- [ ] Changelog & versioning strategy
