import MattInitBanner from "../components/matt-init-banner";

export default function Home() {
  return (
    <div className={`
      grid min-h-screen grid-rows-[20px_1fr_20px] items-center
      justify-items-center gap-16 p-8 pb-20
      font-[family-name:var(--font-geist-sans)]
      sm:p-20
    `}
    >
      <main className={`
        row-start-2 flex flex-col items-center gap-[32px]
        sm:items-start
      `}
      >
        <MattInitBanner />
        <ol className={`
          mx-auto list-inside list-decimal text-center
          font-[family-name:var(--font-geist-mono)]
          text-sm/8
          sm:text-left
        `}
        >
          <li>
            Get started by editing
            {" "}
            <code className={`
              rounded bg-black/[.05] px-1 py-0.5
              font-[family-name:var(--font-geist-mono)]
              font-semibold
              dark:bg-white/[.06]
            `}
            >
              src/app/page.tsx
            </code>
            .
          </li>
          <li>
            Save and see your changes instantly.
          </li>
        </ol>

        <div className={`
          mx-auto flex flex-col items-center gap-4
          sm:flex-row
        `}
        >
          <a
            className={`
              bg-foreground text-background flex h-10 items-center
              justify-center gap-2 rounded-full border border-solid
              border-transparent px-4 text-sm font-medium transition-colors
              hover:bg-[#383838]
              sm:h-12 sm:w-auto sm:px-5 sm:text-base
              dark:hover:bg-[#ccc]
            `}
            href="https://github.com/matthew-hre/matt-init"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⭐ Star matt-init
          </a>
          <a
            className={`
              flex h-10 w-full items-center justify-center rounded-full border
              border-solid border-black/[.08] px-4 text-sm font-medium
              transition-colors
              hover:border-transparent hover:bg-[#f2f2f2]
              sm:h-12 sm:w-auto sm:px-5 sm:text-base
              md:w-[172px]
              dark:border-white/[.145] dark:hover:bg-[#1a1a1a]
            `}
            href="https://matthew-hre.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            👋 Say hi to Matt
          </a>
        </div>
      </main>
    </div>
  );
}
