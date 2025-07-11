export default function Components() {
  return (
    <div className={`
      flex w-full flex-col items-center justify-center gap-8 p-8
      md:mt-32
    `}
    >
      <h2 className="text-3xl font-bold">What's in the Box?</h2>
      <p className={`
        text-muted-foreground text-lg
        lg:w-2/3 lg:text-center
      `}
      >
        Here's the tech stack baked into every matt-init project. All chosen for the simple reason that I like to use them.
      </p>
      <div className={`
        grid w-full max-w-screen-lg grid-cols-1 gap-8
        lg:grid-cols-2
      `}
      >
        <ComponentExample
          name="Next.js"
          description="App router, server actions, and file-based routing. No legacy pages dir."
        >
          <img
            src="https://www.svgrepo.com/show/354113/nextjs-icon.svg"
            alt="Next.js logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="TypeScript"
          description="Type safety for your codebase, with semi-strict settings for a good balance of safety and usability."
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/typescript.svg"
            alt="TypeScript logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="Tailwind CSS v4"
          description="Utility-first CSS framework for rapid UI development."
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/tailwindcss.svg"
            alt="Tailwind CSS logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="ESLint w/ antfu Rules"
          description="Linting with a focus on simplicity and readability, using rules from Anthony Fu's ESLint config."
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/eslint.svg"
            alt="ESLint logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="Zod + .env Validation"
          description="Type-safe schema validation for your data, with environment variable validation baked in."
        >
          <img
            src="https://raw.githubusercontent.com/colinhacks/zod/refs/heads/main/logo/Logo.png"
            alt="Zod logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="VSCode Settings"
          description="Preconfigured VSCode settings and recommended plugins for a consistent development experience."
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1200px-Visual_Studio_Code_1.35_icon.svg.png"
            alt="VSCode logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>

      </div>
      <p className={`
        text-muted-foreground text-lg
        lg:w-2/3 lg:text-center
      `}
      >
        Plus, plenty more additional options:
      </p>
      <div className={`
        grid w-full max-w-screen-lg grid-cols-1 gap-8
        lg:grid-cols-2
      `}
      >
        <ComponentExample
          name="better-auth"
          description="A wickedly comprehensive authentication solution, with great server side support."
        >
          <img
            src="https://raw.githubusercontent.com/better-auth/better-auth/refs/heads/main/docs/public/branding/better-auth-logo-light.svg"
            alt="better-auth logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="Drizzle ORM"
          description="Type-safe SQL ORM for Next.js, with support for SQLite, PostgreSQL, and MySQL."
        >
          <img
            src="https://avatars.githubusercontent.com/u/108468352?v=4"
            alt="Drizzle ORM logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="Turso"
          description="A self-hostable, serverless database with a focus on simplicity and performance."
        >
          <img
            src="https://avatars.githubusercontent.com/u/139391156?s=200&v=4"
            alt="Turso logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="Docker"
          description="Containerization platform for running applications in isolated environments."
        >
          <img
            src="https://www.docker.com/app/uploads/2024/02/cropped-docker-logo-favicon-192x192.png"
            alt="Docker logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
        <ComponentExample
          name="PostgreSQL"
          description="A powerful, open-source relational database management system."
        >
          <img
            src="https://www.postgresql.org/media/img/about/press/elephant.png"
            alt="PostgreSQL logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>

        <ComponentExample
          name="Nix"
          description="The greatest package manager ever made. Declaratively manage your environments with ease."
        >
          <img
            src="https://raw.githubusercontent.com/NixOS/nixos-artwork/refs/heads/master/logo/nix-snowflake-colours.svg"
            alt="Nix logo"
            className="min-h-8 min-w-8"
          />
        </ComponentExample>
      </div>
    </div>
  );
}

function ComponentExample({ name, description, children }: { name: string; description: string; children: React.ReactNode }) {
  return (
    <div className={`
      bg-primary/[0.05] border-muted flex flex-col gap-2 rounded-lg border p-4
    `}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center">{children}</div>
        <h3 className="text-xl font-semibold">{name}</h3>
      </div>
      <p className="text-md text-muted-foreground">{description}</p>
    </div>
  );
}
