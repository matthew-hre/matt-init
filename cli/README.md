```txt
 ███╗   ███╗ █████╗ ████████╗████████╗      ██╗███╗   ██╗██╗████████╗
 ████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝      ██║████╗  ██║██║╚══██╔══╝
 ██╔████╔██║███████║   ██║      ██║   █████╗██║██╔██╗ ██║██║   ██║
 ██║╚██╔╝██║██╔══██║   ██║      ██║   ╚════╝██║██║╚██╗██║██║   ██║
 ██║ ╚═╝ ██║██║  ██║   ██║      ██║         ██║██║ ╚████║██║   ██║
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝
```

> A CLI tool for scaffolding Next.js projects the way I like 'em.

## Features

- **Wickedly Fast Setup** - Under 30 seconds to a fully wired Next.js starter
- **Minimal Choices** - Three streamlined prompts: backend setup, database provider, and tooling preferences
- **Opinionated Defaults** - Pre-configured with sensible defaults and best practices
- **Backend Bundles** - Choose "DB + Drizzle + BetterAuth" for full-stack or "None" for frontend-only
- **Zero Configuration** - Strict linting, Prettier, pre-commit hooks, and CI rules included
- **Type-Safe Environment** - Zod-validated env variables that fail fast on missing config
- **Ready for Deployment** - Tailwind, VSCode settings, and production optimizations included

## ...why?

I've probably started and abandoned a dozen Next.js projects. The commonality between them is that the first hour or two of a given project is spent setting up the same things over and over again. This tool aims to automate that setup process with the components and configurations I prefer, so I can focus on building features instead of boilerplate.

Also, because enforcing harsh linting rules on hackathon teammates is more justafiable when "it came installed like that".

## Installation

```bash
# eventually this will be on npm, but for now, clone the repo
nix develop
pnpm i
```

## Usage

### Interactive Mode (Recommended)

```bash
pnpm dev
```

This will prompt you for:

- **Project name** - What to call your app
- **Backend setup** - Choose from:
  - `DB + Drizzle + BetterAuth` - Full-stack with database, ORM, and authentication
  - `Supabase` - (coming soon)
  - `None` - Frontend-only
- **Database provider** - If you chose the full-stack option:
  - `Turso (SQLite)` - Edge database (implemented)
  - `Neon (Postgres)` - (coming soon)
  - `Docker Postgres` - (coming soon)
- **Nix flake** - Optional reproducible dev environment
- **Install dependencies** - Run `pnpm install` automatically
- **Git repository** - Initialize git with initial commit

### Command Line Options

```bash
matt-init [project-name] [options]

Options:
  --no-git      Skip git initialization
  --no-install  Skip package installation
  --no-nix      Skip Nix flake for environment management
  --no-vscode   Skip VS Code settings setup
  -y, --default Use defaults, skip prompts
  --ci          Run in CI mode (non-interactive, test mode)
  -V, --version Display version number
  -h, --help    Display help
```

### Examples

```bash
# Create a new project with prompts (recommended)
pnpm dev my-awesome-app

# Create with defaults (frontend-only, no prompts)
pnpm dev my-app --default

# Create without git and dependency installation
pnpm dev my-app --no-git --no-install

# Create with Nix support
pnpm dev my-app --nix

# Run in CI mode (non-interactive, uses defaults, overwrites existing directories)
pnpm dev my-app --ci
```

## What's Included

Every generated project includes:

### Core Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting with @antfu/eslint-config

### Environment & Tooling

- **Zod-validated environment variables** - Type-safe env configuration
- **VSCode settings** - Optimized workspace configuration
- **VSCode extensions** - Recommended extensions for the stack

### Optional Addons

- **Full-Stack Backend** - Turso database + Drizzle ORM + BetterAuth authentication
- **Supabase Integration** - (coming soon)
- **Nix Flake** - Reproducible development environment

## Project Structure

Generated projects roughly follow this structure:

```txt
my-project/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── matt-init-banner.tsx
│   └── lib/
│       └── env.ts
├── public/
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── flake.nix              # (if --nix flag used)
├── drizzle.config.ts      # (if backend setup chosen)
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env           # (if backend setup chosen)
```

## Development Status

### Implemented Features

**Core (Every Project):**

- [x] ESLint + Prettier configuration
- [x] Custom Next.js app with banner
- [x] Zod-validated environment variables
- [x] VS Code workspace settings
- [x] Tailwind CSS setup
- [x] TypeScript configuration

**Optional (Behind Flags or Prompts):**

- [x] Full-stack backend (Turso + Drizzle + BetterAuth)
- [x] Nix development environment (--nix flag)
- [x] Git repository initialization
- [x] Dependency installation
- [ ] Custom README generation

### In Progress

- [ ] Improved CI/CD templates

### Roadmap

**Backend Options:**

- [ ] Supabase integration
- [ ] Neon (Postgres) support
- [ ] Docker Postgres support

**Future Flags:**

- [ ] --shadcn for UI components
- [ ] --auth-only for auth without ORM

## Development

### Prerequisites

- Nix

> Feel free to go install all the project dependencies manually if you don't want to use Nix, but I ain't telling you how to do that. This is a Nix-first project baby.

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd matt-init

# Switch to the development shell
nix develop

# Install dependencies
pnpm install

# Run the tool!
pnpm dev
```

### Scripts

- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm dev` - Run in development mode with ts-node
- `pnpm test` - Test the CLI by creating a test project
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically

## License

CC BY-SA 4.0

## Contributing

Not taking any PRs until 1.0.0 is released!

## Acknowledgements

- Thanks to [@antfu](https://github.com/antfu/) for the ESLint config
- Shoutout to [@w3cj](https://github.com/w3cj/) from the Syntax team for general project setup advice, and the `try-parse-env.ts` script
- Quick mention to [create-t3-app](https://github.com/t3-oss/create-t3-app/) for pointing me in the right direction architecture-wise
