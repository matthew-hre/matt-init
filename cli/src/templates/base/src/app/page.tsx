import MattInitBanner from "../components/matt-init-banner";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <MattInitBanner />
        <ol className="list-inside list-decimal text-sm/8 text-center sm:text-left font-[family-name:var(--font-geist-mono)] mx-auto">
          <li>
            Get started by editing
            {" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row mx-auto">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://github.com/matthew-hre/matt-init"
            target="_blank"
            rel="noopener noreferrer"
          >
            ⭐ Star matt-init
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[172px]"
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
