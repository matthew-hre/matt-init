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
    <div className={`
      grid min-h-screen grid-rows-[20px_1fr_20px] items-center
      justify-items-center gap-16 p-8 pb-20 font-sans
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
          mx-auto list-inside list-decimal text-center font-mono text-sm/8
          sm:text-left
        `}
        >
          <li className="mb-4">
            Get started by
            {" "}
            <Link
              href="/signup"
              className={`
                font-medium underline transition-colors
                hover:text-[#1a1a1a]
                dark:hover:text-[#ccc]
              `}
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
              className={`
                font-medium underline transition-colors
                hover:text-[#1a1a1a]
                dark:hover:text-[#ccc]
              `}
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
                className={`
                  font-medium underline transition-colors
                  hover:text-[#1a1a1a]
                  dark:hover:text-[#ccc]
                `}
              >
                /dashboard
              </Link>
              {" "}
              route!
            </li>
          )}

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
            📖 Read the docs
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
            ⭐ Star matt-init
          </a>
        </div>
      </main>
    </div>
  );
}
