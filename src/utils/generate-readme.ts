import fs from "fs-extra";
import path from "node:path";

import type { DatabaseProvider, OrmProvider } from "../types";

type ReadmeOptions = {
  projectName: string;
  projectDir: string;
  databaseProvider: DatabaseProvider;
  ormProvider: OrmProvider;
  shouldUseNix: boolean;
};

export async function generateReadme(options: ReadmeOptions) {
  const { projectName, projectDir, databaseProvider, ormProvider, shouldUseNix } = options;

  const readme = `# ${projectName}

A Next.js project scaffolded with [matt-init](https://github.com/matthew-hre/matt-init).

## Getting Started

${shouldUseNix ? getNixInstructions() : getStandardInstructions()}

Open [http://localhost:3000](http://localhost:3000) to view your application.

## Tech Stack

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[ESLint](https://eslint.org)** - Code linting with @antfu/eslint-config${getDatabaseStack(databaseProvider, ormProvider)}${shouldUseNix ? "\n- **[Nix](https://nixos.org)** - Reproducible development environment" : ""}

## Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── matt-init-banner.tsx${databaseProvider !== "none" ? "\n├── lib/\n│   ├── env.ts" : ""}${databaseProvider !== "none" && ormProvider === "drizzle" ? "\n│   └── db/\n│       └── index.ts\n│       ├── schema/" : ""}
\`\`\`

${getEnvironmentSection(databaseProvider)}${getDatabaseSection(databaseProvider, ormProvider, shouldUseNix)}## Development

You can start editing the page by modifying \`src/app/page.tsx\`. The page auto-updates as you edit.

### Commands

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm lint:fix\` - Fix ESLint issues${databaseProvider !== "none" && ormProvider === "drizzle" ? "\n- `pnpm db:generate` - Generate Drizzle migrations\n- `pnpm db:migrate` - Run Drizzle migrations\n- `pnpm db:push` - Generate *and* migrate Drizzle migrations\n- `pnpm db:studio` - Open Drizzle Studio" : ""}

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)${databaseProvider === "turso" ? "\n- [Turso Documentation](https://docs.turso.tech/)" : ""}${ormProvider === "drizzle" ? "\n- [Drizzle ORM Documentation](https://orm.drizzle.team/)" : ""}
`;

  const readmePath = path.join(projectDir, "README.md");
  await fs.writeFile(readmePath, readme);
}

function getNixInstructions(): string {
  return `### With Nix (Recommended)

\`\`\`bash
# Enter the development shell
nix develop

# Install dependencies and start development server
pnpm install
pnpm dev
\`\`\`

### Without Nix

\`\`\`bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
\`\`\``;
}

function getStandardInstructions(): string {
  return `\`\`\`bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
\`\`\``;
}

function getDatabaseStack(databaseProvider: DatabaseProvider, ormProvider: OrmProvider): string {
  if (databaseProvider === "none")
    return "";

  let stack = "";

  if (databaseProvider === "turso") {
    stack += "\n- **[Turso](https://turso.tech)** - Edge SQLite database";
  }

  if (ormProvider === "drizzle") {
    stack += "\n- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database operations";
  }

  return stack;
}

function getEnvironmentSection(databaseProvider: DatabaseProvider): string {
  if (databaseProvider === "none")
    return "";

  return `## Environment Setup

Your environment variables should be automatically set up based on the database provider you chose!

Environment variables are all typed and validated using [zod](https://zod.dev). If you add any additional variables, make sure to update the \`src/lib/env.ts\` file.

When it's time to deploy, make sure to update the \`.env\` file with your production ${databaseProvider === "turso" ? "Turso" : "database"} credentials.

`;
}

function getDatabaseSection(databaseProvider: DatabaseProvider, ormProvider: OrmProvider, shouldUseNix: boolean): string {
  if (databaseProvider === "none")
    return "";

  let section = `## Database

This project uses ${databaseProvider === "turso" ? "Turso (SQLite)" : databaseProvider} as the database.

`;

  if (databaseProvider === "turso") {
    section += `### Turso Setup

1. ${shouldUseNix ? "Make sure you're in your Nix shell" : "Install the Turso CLI: \`curl -sSfL https://get.tur.so/install.sh | bash\`"}
2. That's it! Turso is ready to use.

`;
  }

  if (ormProvider === "drizzle") {
    section += `### Drizzle ORM

This project uses Drizzle ORM for type-safe database operations.

- Schema files are in \`src/lib/db/schema/\`
- Database client is configured in \`src/lib/db/index.ts\`
- Generate migrations: \`pnpm db:generate\`
- Run migrations: \`pnpm db:migrate\`
- Generate *and* run migrations: \`pnpm db:push\`
- Open Drizzle Studio: \`pnpm db:studio\`

`;
  }

  return section;
}
