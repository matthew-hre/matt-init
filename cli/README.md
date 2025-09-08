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
- **Minimal Choices** - Three streamlined prompts: backend setup, database
  provider, and tooling preferences
- **Opinionated Defaults** - Pre-configured with sensible defaults and best
  practices
- **Backend Bundles** - Choose "DB + Drizzle + BetterAuth" for full-stack or
  "None" for frontend-only
- **Zero Configuration** - Strict linting, Prettier, pre-commit hooks, and CI
  rules included
- **Type-Safe Environment** - Zod-validated env variables that fail fast on
  missing config
- **Ready for Deployment** - Tailwind, VSCode settings, and production
  optimizations included

## ...why?

I've probably started and abandoned a dozen Next.js projects. The commonality
between them is that the first hour or two of a given project is spent setting
up the same things over and over again. This tool aims to automate that setup
process with the components and configurations I prefer, so I can focus on
building features instead of boilerplate.

Also, because enforcing harsh linting rules on hackathon teammates is more
justafiable when "it came installed like that".

## Installation

```bash
npx matt-init@latest [project-name] [options]
```

## Usage

### Interactive Mode (Recommended)

```bash
npx matt-init@latest
```

This will prompt you for:

- **Project name** - What to call your app
- **Backend setup** - Choose from:
  - `DB + Drizzle + BetterAuth` - Full-stack with database, ORM, and
    authentication
  - `Supabase` - (coming soon)
  - `None` - Frontend-only
- **Database provider** - If you chose the full-stack option:

  - `Turso (SQLite)` - Edge database (implemented)
  - `Docker Postgres` - Local Postgres with Docker (implemented)
  - `Neon (Postgres)` - (coming soon)

- **Nix flake** - Optional reproducible dev environment
- **Install dependencies** - Run `pnpm install` automatically
- **VS Code settings** - Setup workspace settings and recommended extensions
- **Git repository** - Initialize git with initial commit

### Command Line Options

```bash
matt-init [project-name] [options]

Options:
  --no-git        Skip git initialization
  --no-install    Skip package installation
  --no-nix        Skip Nix flake for environment management
  --no-linting-ci Skip setting up GitHub Actions CI
  --no-vscode     Skip VS Code settings setup
  -y, --default   Use defaults, skip prompts
  --ci            Run in CI mode (non-interactive, test mode)
  -V, --version   Display version number
  -h, --help      Display help
```

### Examples

```bash
# Create a new project with prompts (recommended)
npx matt-init@latest my-awesome-app

# Create with defaults (frontend-only, no prompts)
npx matt-init@latest my-app --default

# Create without git and dependency installation
npx matt-init@latest my-app --no-git --no-install

# Create without Nix support (Nix is disabled by default)
npx matt-init@latest my-app --no-nix
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

- **Full-Stack Backend** - Turso database + Drizzle ORM + BetterAuth
  authentication
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
│       ├── env.ts
│       └── try-parse-env.ts
├── .vscode/               # (if VSCode setup chosen)
│   ├── extensions.json
│   └── settings.json
├── flake.nix              # (if Nix enabled)
├── drizzle.config.ts      # (if backend setup chosen)
├── .env                   # (if backend setup chosen)
├── .env.example
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
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
- [x] Docker Postgres support
- [x] CI/CD for Linting
- [ ] Custom README generation

### Roadmap

**Backend Options:**

- [ ] Supabase integration
- [ ] Neon (Postgres) support

**Future Flags:**

- [ ] --shadcn for UI components
- [ ] --auth-only for auth without ORM

## Development

### Prerequisites

- Nix

> Feel free to go install all the project dependencies manually if you don't
> want to use Nix, but I ain't telling you how to do that. This is a Nix-first
> project baby.

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd matt-init

# Switch to the development shell
nix develop

# Install dependencies
pnpm install

# Run the tool in development mode!
pnpm dev:cli
```

### Scripts

- `pnpm build:cli` - Compile CLI TypeScript to JavaScript
- `pnpm dev:cli` - Run CLI in development mode with ts-node
- `pnpm test:cli` - Test the CLI by creating a test project
- `pnpm lint:cli` - Run ESLint on CLI
- `pnpm --filter ./cli lint:fix` - Fix CLI ESLint issues automatically

## License

MIT

## Acknowledgements

- Thanks to [@antfu](https://github.com/antfu/) for the ESLint config
- Shoutout to [@w3cj](https://github.com/w3cj/) from the Syntax team for general
  project setup advice, and the `try-parse-env.ts` script
- Quick mention to [create-t3-app](https://github.com/t3-oss/create-t3-app/) for
  pointing me in the right direction architecture-wise
