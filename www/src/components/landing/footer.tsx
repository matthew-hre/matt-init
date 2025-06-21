export default function Footer() {
  return (
    <footer className="w-full bg-background/80 backdrop-blur-md border-t border-muted mt-16 py-12 px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-bold text-foreground">matt-init</h4>
            <p className="text-sm text-muted-foreground">
              A project by
              {" "}
              <a
                href="https://matthew-hre.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline font-medium"
              >
                Matthew Hrehirchuk
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-3 md:justify-self-center">
            <h4 className="text-sm font-bold text-foreground">Resources</h4>
            <div className="flex flex-col gap-2">
              <a href="https://github.com/matthew-hre/matt-init" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub Repository
              </a>
              <a href="https://www.npmjs.com/package/matt-init" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                NPM Package
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:justify-self-center">
            <h4 className="text-sm font-bold text-foreground">Documentation</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Getting Started
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Configuration
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Building an App
              </a>

            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex flex-col gap-1 md:items-end">
              <p className="text-xs text-muted-foreground font-mono">
                commit #abcd123
              </p>
              <p className="text-xs text-muted-foreground">
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
