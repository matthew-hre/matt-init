"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReadme = generateReadme;
function generateReadme(projectName, directory) {
    return `# ${projectName}

A modern Next.js application created with matt-init.

## Features

- ⚡ **Next.js 15** with App Router
- 🎨 **TailwindCSS v4** for styling
- 🔧 **TypeScript** with strict configuration
- 📦 **pnpm** for fast package management
- 🏗️ **Opinionated folder structure** with \`src/\` directory
- 🔍 **Path aliases** configured (\`~/\` points to \`src/\`)

## Getting Started

1. **Install dependencies:**
   \`\`\`bash
   nix develop
   pnpm install
   \`\`\`

2. **Run the development server:**
   \`\`\`bash
   pnpm dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development Scripts

- \`pnpm dev\` - Start development server
- \`pnpm build\` - Build for production
- \`pnpm start\` - Start production server
- \`pnpm lint\` - Run ESLint
- \`pnpm lint:fix\` - Fix linting issues

## Project Structure

\`\`\`
${directory}/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── ...config files
\`\`\`

---

Generated with <3 by [matt-init](https://github.com/matthew-hre/matt-init)
`;
}
//# sourceMappingURL=readme.js.map