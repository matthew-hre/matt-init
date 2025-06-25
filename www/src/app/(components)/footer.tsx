export default function Footer() {
  return (
    <footer className={`
      bg-background/80 border-muted mt-16 w-full border-t px-8 py-12
      backdrop-blur-md
    `}
    >
      <div className="mx-auto max-w-screen-xl">
        <div className={`
          grid grid-cols-1 gap-8
          md:grid-cols-4
        `}
        >
          <div className="flex flex-col gap-3">
            <h4 className="text-foreground text-lg font-bold">matt-init</h4>
            <p className="text-muted-foreground text-sm">
              A project by
              {" "}
              <a
                href="https://matthew-hre.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  text-foreground font-medium
                  hover:underline
                `}
              >
                Matthew Hrehirchuk
              </a>
            </p>
          </div>

          <div className={`
            flex flex-col gap-3
            md:justify-self-center
          `}
          >
            <h4 className="text-foreground text-sm font-bold">Resources</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/matthew-hre/matt-init"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  text-muted-foreground text-sm transition-colors
                  hover:text-foreground
                `}
              >
                GitHub Repository
              </a>
              <a
                href="https://www.npmjs.com/package/matt-init"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  text-muted-foreground text-sm transition-colors
                  hover:text-foreground
                `}
              >
                NPM Package
              </a>
            </div>
          </div>

          <div className={`
            flex flex-col gap-3
            md:justify-self-center
          `}
          >
            <h4 className="text-foreground text-sm font-bold">Documentation</h4>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className={`
                  text-muted-foreground text-sm transition-colors
                  hover:text-foreground
                `}
              >
                Getting Started
              </a>
              <a
                href="#"
                className={`
                  text-muted-foreground text-sm transition-colors
                  hover:text-foreground
                `}
              >
                Configuration
              </a>
              <a
                href="#"
                className={`
                  text-muted-foreground text-sm transition-colors
                  hover:text-foreground
                `}
              >
                Building an App
              </a>

            </div>
          </div>

          <div className={`
            flex flex-col gap-3
            md:items-end
          `}
          >
            <div className={`
              flex flex-col gap-1
              md:items-end
            `}
            >
              <p className="text-muted-foreground font-mono text-xs">
                commit #abcd123
              </p>
              <p className="text-muted-foreground text-xs">
                ©
                {" "}
                {new Date().getFullYear()}
                {" "}
                matthew-hre
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
