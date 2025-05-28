import * as fs from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { TemplateManager, TemplateContext } from './template-manager';

export interface ProjectOptions {
    name: string;
    directory: string;
    database: 'turso' | 'postgres' | 'none';
    auth: boolean;
    ci: boolean;
    editor: boolean;
    hooks: boolean;
    ui: 'shadcn' | 'daisyui' | 'none';
}

export async function createProject(options: ProjectOptions): Promise<void> {
    const projectPath = path.resolve(process.cwd(), options.directory);
    const templateManager = new TemplateManager();

    const context: TemplateContext = {
        projectName: options.name,
        database: options.database,
        auth: options.auth,
        ci: options.ci,
        editor: options.editor,
        hooks: options.hooks,
        ui: options.ui
    };

    // Check if directory already exists
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Directory "${options.directory}" already exists`);
    }

    console.log(chalk.gray('📦 Creating Next.js project...'));
    await createNextJsProject(options.directory);

    console.log(chalk.gray('🔧 Setting up project structure...'));
    await setupProjectStructure(projectPath, options);

    console.log(chalk.gray('📝 Creating configuration files...'));
    await createConfigFiles(projectPath, options, templateManager, context);

    console.log(chalk.gray('🎨 Setting up styling...'));
    await setupStyling(projectPath, templateManager, context);

    if (options.database !== 'none') {
        console.log(chalk.gray('🗄️  Setting up database...'));
        await setupDatabase(projectPath, templateManager, context);
    }

    if (options.auth) {
        console.log(chalk.gray('🔐 Setting up authentication...'));
        await setupAuth(projectPath, templateManager, context);
    }

    if (options.ui !== 'none') {
        console.log(chalk.gray('🧩 Setting up UI library...'));
        await setupUILibrary(projectPath, templateManager, context);
    }

    if (options.editor) {
        console.log(chalk.gray('⚙️  Setting up editor configuration...'));
        await setupEditorConfig(projectPath, templateManager);
    }

    if (options.ci) {
        console.log(chalk.gray('🚀 Setting up CI configuration...'));
        await setupCI(projectPath, templateManager, context);
    }

    if (options.hooks) {
        console.log(chalk.gray('🪝 Setting up Git hooks...'));
        await setupGitHooks(projectPath, templateManager);
    }

    console.log(chalk.gray('📋 Creating documentation...'));
    await createDocumentation(projectPath, options);

    console.log(chalk.gray('🔄 Installing dependencies...'));
    await installDependencies(projectPath);
}

async function createNextJsProject(directory: string): Promise<void> {
    execSync(`pnpm create next-app@latest ${directory} --typescript --tailwind --eslint --app --turbopack --src-dir --import-alias="~/*" --use-pnpm`, {
        stdio: 'inherit',
        cwd: process.cwd()
    });
}

async function setupProjectStructure(projectPath: string, options: ProjectOptions): Promise<void> {
    const directories = [
        'src/components/ui',
        'src/lib',
        'src/hooks',
        'src/types',
        'src/config',
        'public/images'
    ];

    if (options.database !== 'none') {
        directories.push('src/db', 'src/db/migrations');
    }

    if (options.auth) {
        directories.push('src/auth');
    }

    for (const dir of directories) {
        await fs.ensureDir(path.join(projectPath, dir));
    }
}

async function createConfigFiles(projectPath: string, options: ProjectOptions, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    // Update package.json with additional scripts and dependencies
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    packageJson.scripts = {
        ...packageJson.scripts,
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "lint:fix": "next lint --fix",
        "type-check": "tsc --noEmit"
    };

    // Add base dependencies
    const dependencies = ['zod', 'clsx', 'class-variance-authority'];
    const devDependencies = ['@types/node'];

    if (options.database === 'turso') {
        dependencies.push('@libsql/client', 'drizzle-orm');
        devDependencies.push('drizzle-kit');
    } else if (options.database === 'postgres') {
        dependencies.push('pg', 'drizzle-orm');
        devDependencies.push('@types/pg', 'drizzle-kit');
    }

    if (options.auth) {
        dependencies.push('better-auth');
    }

    if (options.ui === 'shadcn') {
        dependencies.push('lucide-react', '@radix-ui/react-slot', 'tailwind-merge');
    } else if (options.ui === 'daisyui') {
        devDependencies.push('daisyui');
    }

    if (options.hooks) {
        devDependencies.push('husky', 'lint-staged');
        // Don't add prepare script here - we'll handle husky init after install
    }

    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    // Create files using templates
    await templateManager.copyTemplate('config/flake.nix', path.join(projectPath, 'flake.nix'), context);
    await templateManager.copyTemplate('config/env.ts', path.join(projectPath, 'src/config/env.ts'), context);

    // Create .env.example
    const envExample = await templateManager.createEnvExample(context);
    await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

    // Update next.config.js
    const nextConfig = await templateManager.createNextConfig();
    await fs.writeFile(path.join(projectPath, 'next.config.mjs'), nextConfig);
}

async function setupStyling(projectPath: string, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    // Update globals.css with custom CSS variables and dark mode support
    const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

    await fs.writeFile(path.join(projectPath, 'src/app/globals.css'), globalsCss);

    // Update tailwind.config.js using template manager
    const tailwindConfig = await templateManager.createTailwindConfig(context);
    await fs.writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindConfig);
}

async function setupDatabase(projectPath: string, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    if (context.database === 'turso') {
        await templateManager.copyTemplate('database/turso.ts', path.join(projectPath, 'src/db/index.ts'), context);
        const drizzleConfig = await templateManager.createDrizzleConfig(context);
        await fs.writeFile(path.join(projectPath, 'drizzle.config.ts'), drizzleConfig);
    } else if (context.database === 'postgres') {
        await templateManager.copyTemplate('database/postgres.ts', path.join(projectPath, 'src/db/index.ts'), context);
        await templateManager.copyTemplate('database/docker-compose.yml', path.join(projectPath, 'docker-compose.yml'), context);
        const drizzleConfig = await templateManager.createDrizzleConfig(context);
        await fs.writeFile(path.join(projectPath, 'drizzle.config.ts'), drizzleConfig);
    }
}

async function setupAuth(projectPath: string, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    await templateManager.copyTemplate('auth/config.ts', path.join(projectPath, 'src/auth/config.ts'), context);
}

async function setupUILibrary(projectPath: string, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    if (context.ui === 'shadcn') {
        await templateManager.copyTemplate('ui/utils.ts', path.join(projectPath, 'src/lib/utils.ts'), context);
        const componentsJson = await templateManager.createComponentsJson();
        await fs.writeFile(path.join(projectPath, 'components.json'), componentsJson);
    }
    // DaisyUI is handled in tailwind config
}

async function setupEditorConfig(projectPath: string, templateManager: TemplateManager): Promise<void> {
    const vscodeSettings = await templateManager.createVSCodeSettings();
    await fs.ensureDir(path.join(projectPath, '.vscode'));
    await fs.writeFile(path.join(projectPath, '.vscode/settings.json'), vscodeSettings);

    const editorConfig = await templateManager.createEditorConfig();
    await fs.writeFile(path.join(projectPath, '.editorconfig'), editorConfig);
}

async function setupCI(projectPath: string, templateManager: TemplateManager, context: TemplateContext): Promise<void> {
    await fs.ensureDir(path.join(projectPath, '.github/workflows'));
    await templateManager.copyTemplate('ci/github-actions.yml', path.join(projectPath, '.github/workflows/ci.yml'), context);
}

async function setupGitHooks(projectPath: string, templateManager: TemplateManager): Promise<void> {
    const lintStagedConfig = await templateManager.createLintStagedConfig();
    await fs.writeFile(path.join(projectPath, '.lintstagedrc.json'), lintStagedConfig);

    // Initialize husky after dependencies are installed
    try {
        execSync('pnpm exec husky init', {
            cwd: projectPath,
            stdio: 'inherit'
        });

        // Create pre-commit hook
        const preCommitHook = '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\npnpm exec lint-staged\n';
        await fs.writeFile(path.join(projectPath, '.husky/pre-commit'), preCommitHook);

        // Make the pre-commit hook executable
        execSync('chmod +x .husky/pre-commit', {
            cwd: projectPath
        });
    } catch (error) {
        console.warn(chalk.yellow('⚠️  Failed to initialize husky. You can run "pnpm exec husky init" manually.'));
    }
}

async function createDocumentation(projectPath: string, options: ProjectOptions): Promise<void> {
    let readme = `# ${options.name}

\`\`\`
 ███╗   ███╗ █████╗ ████████╗████████╗      ██╗███╗   ██╗██╗████████╗
 ████╗ ████║██╔══██╗╚══██╔══╝╚══██╔══╝      ██║████╗  ██║██║╚══██╔══╝
 ██╔████╔██║███████║   ██║      ██║   █████╗██║██╔██╗ ██║██║   ██║   
 ██║╚██╔╝██║██╔══██║   ██║      ██║   ╚════╝██║██║╚██╗██║██║   ██║   
 ██║ ╚═╝ ██║██║  ██║   ██║      ██║         ██║██║ ╚████║██║   ██║   
 ╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝         ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   
\`\`\`

A modern Next.js application scaffolded with opinionated defaults.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** with dark mode support
- 📱 **Responsive design** with mobile-first approach
- 🔧 **TypeScript** with strict configuration
- 📦 **pnpm** for fast package management
- 🏗️ **Opinionated folder structure** with \`src/\` directory
- 🔍 **Path aliases** configured (\`~/\` points to \`src/\`)`;

    if (options.database !== 'none') {
        readme += `\n- 🗄️ **${options.database === 'turso' ? 'Turso' : 'PostgreSQL'}** database with Drizzle ORM`;
    }

    if (options.auth) {
        readme += `\n- 🔐 **Better-Auth** for authentication`;
    }

    if (options.ui !== 'none') {
        readme += `\n- 🧩 **${options.ui === 'shadcn' ? 'shadcn/ui' : 'DaisyUI'}** for UI components`;
    }

    if (options.ci) {
        readme += `\n- 🚀 **GitHub Actions** CI/CD pipeline`;
    }

    if (options.hooks) {
        readme += `\n- 🪝 **Git hooks** with Husky and lint-staged`;
    }

    if (options.editor) {
        readme += `\n- ⚙️ **Editor configuration** for VS Code`;
    }

    readme += `
- 📝 **Zod** for type-safe environment variables
- 🎯 **ESLint & Prettier** for code quality
- 🐳 **Nix flake** for reproducible development environment

## Getting Started

1. **Install dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your values
   \`\`\``;

    if (options.database === 'postgres') {
        readme += `

3. **Start the database:**
   \`\`\`bash
   docker-compose up -d
   \`\`\``;
    }

    readme += `

${options.database === 'postgres' ? '4' : '3'}. **Run the development server:**
   \`\`\`bash
   pnpm dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm lint:fix\` - Fix ESLint errors
- \`pnpm type-check\` - Run TypeScript type checking

## Project Structure

\`\`\`
${options.directory}/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── config/             # Configuration files`;

    if (options.database !== 'none') {
        readme += `
│   ├── db/                 # Database configuration and schema`;
    }

    if (options.auth) {
        readme += `
│   └── auth/               # Authentication configuration`;
    }

    readme += `
├── public/                 # Static assets
├── .vscode/               # VS Code settings
├── flake.nix              # Nix development environment
└── ...config files
\`\`\`

## Environment Variables

See \`.env.example\` for required environment variables.

## Deployment

This project can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [Railway](https://railway.app)
- Self-hosted with Docker

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

Generated with ❤️ by [matt-init](https://github.com/your-username/matt-init)
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);
}

async function installDependencies(projectPath: string): Promise<void> {
    execSync('pnpm install', {
        cwd: projectPath,
        stdio: 'inherit'
    });
}