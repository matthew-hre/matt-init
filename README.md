# matt-init

```
 ███╗   ███╗ █████╗ ████████╗████████╗      ██╗███╗   ██╗██╗████████╗
 ████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝      ██║████╗  ██║██║╚══██╔══╝
 ██╔████╔██║███████║   ██║      ██║   █████╗██║██╔██╗ ██║██║   ██║   
 ██║╚██╔╝██║██╔══██║   ██║      ██║   ╚════╝██║██║╚██╗██║██║   ██║   
 ██║ ╚═╝ ██║██║  ██║   ██║      ██║         ██║██║ ╚████║██║   ██║   
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
```

A simple CLI tool for scaffolding Next.js projects with TypeScript and Tailwind CSS.

## Features

🚀 **Interactive CLI** - Simple prompts to get you started quickly
📦 **Next.js 14** with App Router and TypeScript
🎨 **Tailwind CSS** for styling
⚙️ **ESLint** configuration included
🏗️ **Opinionated structure** with `src/` directory
🔍 **Path aliases** configured (`~/` points to `src/`)

## Installation

```bash
# Install globally
npm install -g matt-init

# Or use with npx
npx matt-init my-project
```

## Usage

### Interactive Mode (Recommended)
```bash
matt-init
```

### With Directory Argument
```bash
matt-init my-awesome-app
```

## What Gets Generated

Every project includes:
- ⚡ Next.js 14 with App Router and TypeScript
- 🎨 Tailwind CSS with default configuration
- 🏗️ Clean folder structure with `src/` directory
- 🔍 Path aliases (`~/` points to `src/`)
- 🎯 ESLint configuration
- 📋 Comprehensive README

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
node dist/index.js my-test-project
```

## Project Structure

Generated projects follow this structure:

```
my-project/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   └── lib/                # Utility functions
├── public/                 # Static assets
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Changelog

### v1.0.0
- Initial release with basic Next.js project scaffolding
- TypeScript and Tailwind CSS support
- Interactive CLI interface