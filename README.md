# matt-init

```
 ███╗   ███╗ █████╗ ████████╗████████╗      ██╗███╗   ██╗██╗████████╗
 ████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝      ██║████╗  ██║██║╚══██╔══╝
 ██╔████╔██║███████║   ██║      ██║   █████╗██║██╔██╗ ██║██║   ██║   
 ██║╚██╔╝██║██╔══██║   ██║      ██║   ╚════╝██║██║╚██╗██║██║   ██║   
 ██║ ╚═╝ ██║██║  ██║   ██║      ██║         ██║██║ ╚████║██║   ██║   
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
```

A powerful Node.js/TypeScript CLI tool for scaffolding Next.js projects with opinionated defaults.

## Features

🚀 **Interactive CLI** powered by Commander and Inquirer
📦 **Next.js 14** with App Router and TypeScript
🎨 **Styling** with Tailwind CSS and dark mode support
🗄️ **Database Options**: Turso (SQLite), PostgreSQL, or None
🔐 **Authentication** with Better-Auth
🧩 **UI Libraries**: shadcn/ui, DaisyUI, or plain Tailwind
⚙️ **Development Tools**: ESLint, Prettier, Husky, lint-staged
🐳 **Nix Flake** for reproducible development environments
📝 **Type-safe Environment** variables with Zod
🚀 **CI/CD** with GitHub Actions
⚙️ **Editor Configuration** for VS Code

## Installation

```bash
# Install globally
npm install -g matt-init

# Or use with npx
npx matt-init create my-project
```

## Usage

### Interactive Mode (Recommended)
```bash
matt-init create
```

### With Command Line Options
```bash
# Create with specific database and UI
matt-init create my-app --database postgres --ui shadcn

# Create minimal project
matt-init create simple-app --database none --no-auth --no-hooks --ui none

# Skip specific features
matt-init create my-app --no-ci --no-editor
```

### Available Options
- `--database <type>`: Database setup (turso, postgres, none)
- `--ui <type>`: UI library (shadcn, daisyui, none)
- `--no-auth`: Skip authentication setup
- `--no-ci`: Skip CI configuration
- `--no-editor`: Skip editor configuration
- `--no-hooks`: Skip Git hooks setup

## What Gets Generated

Every project includes:
- ⚡ Next.js 14 with App Router and TypeScript
- 🎨 Tailwind CSS with custom design system
- 🏗️ Opinionated folder structure with `src/` directory
- 🔍 Path aliases (`~/` points to `src/`)
- 📝 Zod-powered environment schema
- 🎯 ESLint & Prettier configuration
- 🐳 Nix flake for development environment
- 📋 Comprehensive README with ASCII art

### Optional Features
- **Database**: Turso (edge SQLite) or PostgreSQL with Drizzle ORM
- **Authentication**: Better-Auth integration
- **UI Library**: shadcn/ui components or DaisyUI
- **Git Hooks**: Husky + lint-staged for code quality
- **CI/CD**: GitHub Actions workflow
- **Editor Config**: VS Code settings and EditorConfig

## Development

```bash
# Clone the repository
git clone <repository-url>
cd matt-init

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build the CLI
pnpm build

# Test the built CLI
node dist/index.js create test-project
```

## Examples

### Full-Featured App
```bash
matt-init create my-saas-app --database turso --ui shadcn
```
Perfect for: SaaS applications, dashboards, complex web apps

### Simple Blog
```bash
matt-init create my-blog --database none --no-auth --ui none
```
Perfect for: Static sites, blogs, documentation

### E-commerce Store
```bash
matt-init create my-store --database postgres --ui shadcn
```
Perfect for: E-commerce, marketplaces, inventory management

## Project Structure

Generated projects follow this opinionated structure:

```
my-project/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   └── ui/             # UI components (if using shadcn)
│   ├── lib/                # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── config/             # Configuration files
│   ├── db/                 # Database setup (if enabled)
│   └── auth/               # Auth configuration (if enabled)
├── public/                 # Static assets
├── .vscode/               # VS Code settings
├── .github/workflows/     # CI/CD workflows
├── flake.nix              # Nix development environment
├── components.json        # shadcn/ui config (if using shadcn)
├── docker-compose.yml     # PostgreSQL setup (if using postgres)
└── ...config files
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release with full Next.js scaffolding
- Support for Turso and PostgreSQL databases
- Better-Auth integration
- shadcn/ui and DaisyUI support
- Complete development toolchain setup
- Nix flake configuration
- Comprehensive documentation generation

---

Built with ❤️ for the Next.js community