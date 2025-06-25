import Terminal from "./terminal";

export default function About() {
  return (
    <div className={`
      flex w-full flex-col items-center justify-center gap-8 p-8
      lg:flex-row
    `}
    >
      <div className="flex flex-1 flex-col items-start justify-center gap-4">
        <h2 className="text-3xl font-bold">...another Next.js Scaffolding tool?</h2>
        <p className="text-muted-foreground text-lg">
          Yeah yeah, I know. Everyone has a Next.js starter these days. Tech stacks are like assholes: everyone's got one. But this one's mine.
        </p>
        <p className="text-muted-foreground text-lg">
          Most tools chase trends like “type safety” or “bleeding-edge tech,” but forget something more basic: working with other people suuuucks. Especially during a hackathon.
        </p>
        <p className="text-muted-foreground text-lg">
          This setup just works. Linting, formatting, CI: it's all right there, out of the box. No weird merge conflicts, no inconsistent filenames. matt-init is opinionated on purpose.
        </p>
      </div>
      <div className="flex w-full flex-1 justify-center">
        <Terminal />
      </div>
    </div>
  );
}
