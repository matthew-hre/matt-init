import Terminal from "./terminal";

export default function About() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 p-8 w-full">
      <div className="flex flex-col items-start justify-center gap-4 flex-1">
        <h2 className="text-3xl font-bold">...another Next.js Scaffolding tool?</h2>
        <p className="text-lg text-muted-foreground">
          Yeah yeah, I know. Everyone has a Next.js starter these days. Tech stacks are like assholes: everyone's got one. But this one's mine.
        </p>
        <p className="text-lg text-muted-foreground">
          Most tools chase trends like “type safety” or “bleeding-edge tech,” but forget something more basic: working with other people suuuucks. Especially during a hackathon.
        </p>
        <p className="text-lg text-muted-foreground">
          This setup just works. Linting, formatting, CI: it's all right there, out of the box. No weird merge conflicts, no inconsistent filenames. matt-init is opinionated on purpose.
        </p>
      </div>
      <div className="w-full flex-1 flex justify-center">
        <Terminal />
      </div>
    </div>
  );
}
