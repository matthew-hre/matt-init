"use client";

import { useState } from "react";

import { ProjectStructure } from "./project-structure";

type ConditionalSectionProps = {
  feature: string;
  children: React.ReactNode;
  enabledFeatures: Set<string>;
};

function ConditionalSection({ feature, children, enabledFeatures }: ConditionalSectionProps) {
  if (feature === "base" || enabledFeatures.has(feature)) {
    return <>{children}</>;
  }
  return null;
}

export function ProjectStructureWithDocs() {
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(
    () => new Set(["base", "backend", "nix", "ci", "vscode"]),
  );

  const handleFeaturesChange = (features: Set<string>) => {
    setEnabledFeatures(features);
  };

  return (
    <>
      <ProjectStructure onFeaturesChange={handleFeaturesChange} />

      <hr className="my-8" />

      <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold">
        Project Structure (Top-Level Files)
      </h2>

      <ConditionalSection feature="backend" enabledFeatures={enabledFeatures}>
        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">.env</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This file contains environment variables needed for local development. It's dynamically generated when the project is scaffolded, based on your selected options (e.g. database, auth). It's also type-checked at runtime using Zod. You'll usually only need to touch this when deploying to production or if you're pointing to a different database or auth server.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">.env.example</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          A template file showing the structure of environment variables needed by your application. This file is safe to commit to version control and helps other developers understand what environment variables they need to set up. When backend features are enabled, this file includes placeholder values for database URLs and authentication secrets.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">drizzle.config.ts</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This is the config file for Drizzle ORM. It sets the output folder for migration files, points to your schema, and defines your database dialect and credentials. The DB credentials are pulled directly from your
          {" "}
          <code className="font-mono">.env</code>
          {" "}
          file, so you won't hardcode any sensitive info here. If you later change your schema path or DB backend, update this file accordingly.
        </p>
        <hr className="my-6" />
      </ConditionalSection>

      <ConditionalSection feature="base" enabledFeatures={enabledFeatures}>
        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">eslint.config.mjs</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          Your linting rules live here. It uses
          {" "}
          <code className="font-mono">@antfu/eslint-config</code>
          {" "}
          as a base, which includes solid defaults for React, TypeScript, and formatting. There are a few opinionated overrides: sorted imports, kebab-case filenames, and no top-level
          {" "}
          <code className="font-mono">await</code>
          —intended to keep things consistent in team environments. You'll almost never need to touch this unless you strongly disagree with a specific rule (which is fair).
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">next-env.d.ts</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This is managed by Next.js and used to make TypeScript play nice with your Next.js app. You should leave this file alone.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">next.config.ts</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          Optional config file for customizing Next.js behavior. This project uses it to pre-load your environment variables on boot, so any invalid or missing envs will fail fast. If you want to tweak routing, image handling, or experimental flags, this is where you'd do it.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">package.json</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This file manages your project's metadata, dependencies, and scripts. It comes with all the essentials already set up: dev scripts, Drizzle DB commands, linting, and Tailwind. The
          {" "}
          <code className="font-mono">dev</code>
          {" "}
          script uses
          {" "}
          <code className="font-mono">concurrently</code>
          {" "}
          to run the Next.js dev server
          {" "}
          <em>and</em>
          {" "}
          your optional database at the same time. If you add new CLI tooling or frameworks later, this is one of the first files you'll touch.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">postcss.config.mjs</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          Tailwind uses PostCSS under the hood for its transformation pipeline. This config just loads the Tailwind plugin. You probably won't need to touch this.
        </p>
        <blockquote className={`
          border-foreground text-muted-foreground mb-4 border-l-4 pl-4 italic
        `}
        >
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            <strong>Note:</strong>
            {" "}
            This project uses Tailwind CSS v4, which doesn't require a separate
            {" "}
            <code className="font-mono">
              tailwind.config.ts
            </code>
            {" "}
            file. Configuration is handled through CSS variables and
            {" "}
            <code className="font-mono">
              @import
            </code>
            {" "}
            statements in
            {" "}
            <code className="font-mono">
              globals.css
            </code>
            .
          </p>
        </blockquote>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">tsconfig.json</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          The TypeScript config includes sane defaults for a modern React project. It enables some type checking, supports module aliasing (
          <code className="font-mono">~/lib/env</code>
          {" "}
          instead of
          {" "}
          <code className="font-mono">../../../lib/env</code>
          ), and is tailored for Next.js. If you add new folders or want to tweak compiler behavior, you'll adjust this file.
        </p>
        <blockquote className={`
          border-foreground text-muted-foreground mb-4 border-l-4 pl-4 italic
        `}
        >
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            <strong>Note:</strong>
            {" "}
            The import alias is
            {" "}
            <code className="font-mono">
              ~/
            </code>
            , not
            {" "}
            <code className="font-mono">
              @/
            </code>
            . This is a personal preference, and you are more than welcome to change it to
            {" "}
            <code className="font-mono">
              @/
            </code>
            {" "}
            if you prefer that style.
          </p>
        </blockquote>
        <hr className="my-6" />
      </ConditionalSection>

      <ConditionalSection feature="nix" enabledFeatures={enabledFeatures}>
        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">flake.nix</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This is your project's Nix flake, defining its dependencies and build environments. If you're using Nix, this is what makes your dev shell reproducible. It pulls in specific versions of
          {" "}
          <code className="font-mono">nodejs</code>
          ,
          {" "}
          <code className="font-mono">pnpm</code>
          , any database requirements if enabled, and other tools, so you don't have to worry about local mismatches between teammates. If you're
          {" "}
          <em>not</em>
          {" "}
          using Nix, you should be.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">nix/devShell.nix</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          This file defines your Nix development shell. It specifies the Node.js version, PNPM, and any additional tools you want available in your dev environment (like
          {" "}
          <code className="font-mono">jq</code>
          ,
          {" "}
          <code className="font-mono">sqlite-utils</code>
          , etc.). If you need to add or change tools, this is where you'd do it.
        </p>
        <hr className="my-6" />

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">flake.lock</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          Autogenerated by Nix. It pins the exact versions of your flake dependencies (
          <code className="font-mono">nixpkgs</code>
          ,
          {" "}
          <code className="font-mono">flake-utils</code>
          , etc.) to ensure reproducible builds across machines. You should commit this file. You should not edit this file.
        </p>
        <hr className="my-6" />
      </ConditionalSection>

      <ConditionalSection feature="vscode" enabledFeatures={enabledFeatures}>
        <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold">.vscode/</h2>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          If you opted in, these files are generated:
        </p>
        <ul className={`
          text-muted-foreground mb-4 list-outside list-disc space-y-1
        `}
        >
          <li className="text-muted-foreground ml-4">
            <strong>extensions.json</strong>
            : Recommended extensions for the stack (e.g., ESLint, Tailwind CSS IntelliSense, etc).
          </li>
          <li className="text-muted-foreground ml-4">
            <strong>settings.json</strong>
            : Preconfigured formatting, import sorting, and TypeScript settings.
          </li>
        </ul>
        <hr className="my-6" />
      </ConditionalSection>

      <ConditionalSection feature="ci" enabledFeatures={enabledFeatures}>
        <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold">.github/workflows/</h2>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          If you opted in, this folder contains the GitHub Actions workflow for linting:
        </p>
        <ul className={`
          text-muted-foreground mb-4 list-outside list-disc space-y-1
        `}
        >
          <li className="text-muted-foreground ml-4">
            <strong>lint.yaml</strong>
            : Runs ESLint (and Alejandra if you're using Nix) checks on every pull request. It ensures code quality and consistency across your project. If you add new files or change linting rules, this workflow will automatically pick up those changes.
          </li>
        </ul>
        <hr className="my-6" />
      </ConditionalSection>

      <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold">src/</h2>
      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
        All the application code lives here. Traditionally, Next.js projects scatter all this in the root, but this keeps things organized and modular.
      </p>

      <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">app/</h3>
      <p className="text-muted-foreground mb-4 text-base leading-relaxed">
        matt-init uses the Next.js App Router layout for file-based routing.
      </p>
      <ul className={`
        text-muted-foreground mb-4 list-outside list-disc space-y-1
      `}
      >
        <li className="text-muted-foreground ml-4">
          <strong>globals.css</strong>
          : Tailwind base styles and dark mode variables.
        </li>
        <li className="text-muted-foreground ml-4">
          <strong>layout.tsx</strong>
          : Global layout with font imports and wrapper markup.
        </li>
        <li className="text-muted-foreground ml-4">
          <strong>page.tsx</strong>
          : Simple home page with call-to-actions.
        </li>
      </ul>

      <ConditionalSection feature="backend" enabledFeatures={enabledFeatures}>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          Additionally, if a backend is enabled, it includes:
        </p>
        <ul className={`
          text-muted-foreground mb-4 list-outside list-disc space-y-1
        `}
        >
          <li className="text-muted-foreground ml-4">
            <strong>api/auth/[...all]/route.ts</strong>
            : BetterAuth's Next.js handler route.
          </li>
          <li className="text-muted-foreground ml-4">
            <strong>dashboard/page.tsx</strong>
            : A protected route showing auth and DB in action.
          </li>
          <li className="text-muted-foreground ml-4">
            <strong>signin/</strong>
            {" "}
            and
            {" "}
            <strong>signup/</strong>
            : Basic auth forms using BetterAuth's API.
          </li>
        </ul>
      </ConditionalSection>

      <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">components/</h3>
      <ul className={`
        text-muted-foreground mb-4 list-outside list-disc space-y-1
      `}
      >
        <li className="text-muted-foreground ml-4">
          <strong>matt-init-banner.tsx</strong>
          : ASCII banner, purely decorative.
        </li>
      </ul>

      <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">lib/</h3>
      <ul className={`
        text-muted-foreground mb-4 list-outside list-disc space-y-1
      `}
      >
        <li className="text-muted-foreground ml-4">
          <strong>env.ts</strong>
          : Loads and validates environment variables using Zod.
        </li>
        <li className="text-muted-foreground ml-4">
          <strong>try-parse-env.ts</strong>
          : Helper that throws if required env vars are missing.
        </li>
      </ul>

      <ConditionalSection feature="backend" enabledFeatures={enabledFeatures}>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          And, if a backend is enabled:
        </p>
        <ul className={`
          text-muted-foreground mb-4 list-outside list-disc space-y-1
        `}
        >
          <li className="text-muted-foreground ml-4">
            <strong>auth.ts</strong>
            : Configures BetterAuth with Drizzle ORM and your database.
          </li>
          <li className="text-muted-foreground ml-4">
            <strong>db/</strong>
            : Drizzle ORM setup and schema.
            <ul className={`
              text-muted-foreground mb-4 list-outside list-disc space-y-1
            `}
            >
              <li className="text-muted-foreground ml-4">
                <strong>index.ts</strong>
                : Connects to the DB using your selected backend.
              </li>
              <li className="text-muted-foreground ml-4">
                <strong>schema/</strong>
                : Prebuilt tables for user, session, etc.
              </li>
            </ul>
          </li>
        </ul>

        <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">middleware.ts</h3>
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          If a backend is enabled, this file contains the middleware for protecting routes like
          {" "}
          <code className="font-mono">/dashboard</code>
          . It checks if the user is authenticated and redirects unauthenticated users to the sign-in page. If you want to add more protected routes, you can extend this middleware logic.
        </p>
      </ConditionalSection>
    </>
  );
}
