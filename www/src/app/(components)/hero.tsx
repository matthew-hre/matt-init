import CopyableCommand from "~/components/copyable-command";
import MattInitBanner from "~/components/matt-init-banner";

export default function Hero() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center max-h-screen h-full p-8 pb-20 gap-16 sm:p-40 font-sans">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="hidden md:block">
          <MattInitBanner />
        </div>
        <h1 className="md:hidden text-6xl sm:text-6xl font-bold text-center sm:text-left">
          matt-init
        </h1>
        <h2 className="list-inside list-decimal text-md text-center sm:text-left font-mono mx-auto">
          A CLI tool for scaffolding Next.js projects the way Matt likes 'em.
        </h2>
        <div className="w-full flex flex-row items-center justify-center sm:justify-start">
          <CopyableCommand />
        </div>
      </main>
    </div>
  );
}
