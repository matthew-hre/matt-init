import CopyableCommand from "~/components/copyable-command";
import MattInitBanner from "~/components/matt-init-banner";

export default function Hero() {
  return (
    <div className={`
      grid h-full max-h-screen grid-rows-[20px_1fr_20px] items-center
      justify-items-center gap-16 p-8 pb-20 font-sans
      sm:p-40
    `}
    >
      <main className={`
        row-start-2 flex flex-col items-center gap-[32px]
        sm:items-start
      `}
      >
        <div className={`
          hidden
          md:block
        `}
        >
          <MattInitBanner />
        </div>
        <h1 className={`
          text-center text-6xl font-bold
          sm:text-left sm:text-6xl
          md:hidden
        `}
        >
          matt-init
        </h1>
        <h2 className={`
          text-md mx-auto list-inside list-decimal text-center font-mono
          sm:text-left
        `}
        >
          A CLI tool for scaffolding Next.js projects the way Matt likes 'em.
        </h2>
        <div className={`
          flex w-full flex-row items-center justify-center
          sm:justify-start
        `}
        >
          <CopyableCommand />
        </div>
      </main>
    </div>
  );
}
