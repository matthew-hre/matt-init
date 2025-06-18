import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "~/lib/auth";

import MattInitBanner from "../components/matt-init-banner";

export default async function Home() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <MattInitBanner />
        <ol className="list-inside list-decimal text-sm/8 text-center sm:text-left font-mono mx-auto">
          <li className="mb-4">
            Get started by
            {" "}
            <Link
              href="/signup"
              className="underline font-medium hover:text-[#1a1a1a] dark:hover:text-[#ccc] transition-colors"
            >
              signing up
            </Link>
            .
          </li>
          <li>
            Or by
            {" "}
            <Link
              href="/signin"
              className="underline font-medium hover:text-[#1a1a1a] dark:hover:text-[#ccc] transition-colors"
            >
              logging in
            </Link>
            {" "}
            if you already have an account.
          </li>
          {session && (
            <li className="mt-4">
              Finally, navigate to the protected
              {" "}
              <Link
                href="/dashboard"
                className="underline font-medium hover:text-[#1a1a1a] dark:hover:text-[#ccc] transition-colors"
              >
                /dashboard
              </Link>
              {" "}
              route!
            </li>
          )}

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
