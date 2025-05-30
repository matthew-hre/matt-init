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

- **Opinionated Setup** - Pre-configured with sensible defaults and ~~best~~ practices that I like
- **⚡ Interactive CLI** - Prompts powered by @clack/prompts
- **Flexible Configuration** - Choose your stack components
- **Multiple Package Managers** - Support for pnpm (primary), with npm/bun/yarn on the roadmap
- **Database Integration** - Built-in support for Turso (SQLite) with Drizzle ORM
- **Nix Support** - Optional Nix flake for reproducible development environments
- **Pre-configured Tooling** - ESLint, TypeScript, VS Code settings out of the box

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

- Project name
- Database provider (Turso/None)
- ORM choice (Drizzle/None)
- Nix flake initialization
- Git repository initialization
- Dependency installation

### Command Line Options

```bash
matt-init [project-name] [options]

Options:
  --no-git      Skip git initialization
  --no-install  Skip package installation
  --nix         Initialize with Nix flake
  -y, --default Use defaults, skip prompts
  -V, --version Display version number
  -h, --help    Display help
```

### Examples

```bash
# Create a new project with prompts
pnpm dev my-awesome-app

# Create with defaults (skip prompts)
pnpm dev my-app --default

# Create without git and dependency installation
pnpm dev my-app --no-git --no-install

# Create with Nix support
pnpm dev my-app --nix
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

- **Turso Database** - Edge SQLite database
- **Drizzle ORM** - Type-safe database operations
- **Nix Flake** - Reproducible development environment

## 🗂️ Project Structure

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
├── flake.nix              # (if Nix enabled)
├── drizzle.config.ts      # (if Drizzle enabled)
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env           # (if database enabled)
```

## Development Status

### Implemented Features

**Mandatory Per Project:**

- [x] ESLint Config
- [x] Custom default app.tsx
- [x] Zod-validated env variables
- [x] VS Code Config

**Optional Flags:**

- [x] Setup Nix
- [x] Database Option (Turso SQLite)
- [x] ORM Option (Drizzle)
- [x] Install Dependencies
- [x] Setup Git / Stage

### 🚧 In Progress

- [ ] Setup Github Actions for Linting
- [ ] Husky / lint-staged (Known issues with git config when installed via execa)

### 🗺️ Roadmap

**Auth Providers:**

- [ ] BetterAuth integration
- [ ] Auth.js integration(?)

**UI Libraries:**

- [ ] Shadcn/ui integration
- [ ] DaisyUI integration

**Database Options:**

- [ ] Postgres with Docker
- [ ] Neon (Postgres)
- [ ] PlanetScale (MySQL) (?)

**Package Manager Support:**

- [ ] npm
- [ ] Bun (?)
- [ ] Yarn (?)

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

## 📄 License

CC BY-SA 4.0

## 🤝 Contributing

Not taking any PRs until 1.0 is released!

## Acknowledgements

- Thanks to [@antfu](https://github.com/antfu/) for the ESLint config
- Shoutout to [@w3cj](https://github.com/w3cj/) from the Syntax team for general project setup advice, and the `try-parse-env.ts` script
- Quick mention to [create-t3-app](https://github.com/t3-oss/create-t3-app/) for pointing me in the right direction architecture-wise
