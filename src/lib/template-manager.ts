import * as fs from 'fs-extra';
import * as path from 'path';

export interface TemplateContext {
    projectName: string;
    database: 'turso' | 'postgres' | 'none';
    auth: boolean;
    ci: boolean;
    editor: boolean;
    hooks: boolean;
    ui: 'shadcn' | 'daisyui' | 'none';
}

export class TemplateManager {
    private templatesDir: string;

    constructor() {
        this.templatesDir = path.join(__dirname, '..', 'templates');
    }

    async renderTemplate(templatePath: string, context: TemplateContext): Promise<string> {
        const fullPath = path.join(this.templatesDir, templatePath);
        let content = await fs.readFile(fullPath, 'utf-8');

        // Replace basic placeholders
        content = content.replace(/\{\{projectName\}\}/g, context.projectName);

        // Handle conditional database environment variables
        if (content.includes('{{databaseEnv}}')) {
            let databaseEnv = '';
            if (context.database === 'turso') {
                databaseEnv = `
  DATABASE_URL: z.string().min(1),
  DATABASE_AUTH_TOKEN: z.string().optional(),`;
            } else if (context.database === 'postgres') {
                databaseEnv = `
  DATABASE_URL: z.string().min(1),`;
            }
            content = content.replace('{{databaseEnv}}', databaseEnv);
        }

        // Handle conditional auth environment variables
        if (content.includes('{{authEnv}}')) {
            const authEnv = context.auth ? `
  AUTH_SECRET: z.string().min(32),` : '';
            content = content.replace('{{authEnv}}', authEnv);
        }

        return content;
    }

    async copyTemplate(templatePath: string, targetPath: string, context: TemplateContext): Promise<void> {
        const content = await this.renderTemplate(templatePath, context);
        await fs.writeFile(targetPath, content);
    }

    async createEnvExample(context: TemplateContext): Promise<string> {
        let envExample = `NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

        if (context.database === 'turso') {
            envExample += `
DATABASE_URL=your_turso_database_url
DATABASE_AUTH_TOKEN=your_turso_auth_token`;
        } else if (context.database === 'postgres') {
            envExample += `
DATABASE_URL=postgresql://username:password@localhost:5432/${context.projectName}`;
        }

        if (context.auth) {
            envExample += `
AUTH_SECRET=your_32_character_secret_key_here`;
        }

        return envExample;
    }

    async createNextConfig(): Promise<string> {
        return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;`;
    }

    async createTailwindConfig(context: TemplateContext): Promise<string> {
        let config = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [`;

        if (context.ui === 'daisyui') {
            config += `require('daisyui')`;
        }

        config += `],
}
export default config`;

        return config;
    }

    async createVSCodeSettings(): Promise<string> {
        return `{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}`;
    }

    async createEditorConfig(): Promise<string> {
        return `root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false`;
    }

    async createLintStagedConfig(): Promise<string> {
        return `{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}`;
    }

    async createComponentsJson(): Promise<string> {
        return `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils"
  }
}`;
    }

    async createDrizzleConfig(context: TemplateContext): Promise<string> {
        if (context.database === 'turso') {
            return `import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;`;
        } else {
            return `import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;`;
        }
    }
}