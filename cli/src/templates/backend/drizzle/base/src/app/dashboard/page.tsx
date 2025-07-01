import { headers } from "next/headers";
import { redirect } from "next/navigation";

import MattInitBanner from "~/components/matt-init-banner";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";
import { user } from "~/lib/db/schema";

async function signOut() {
  "use server";

  const headersList = await headers();

  await auth.api.signOut({
    headers: headersList,
  });

  redirect("/");
}

export default async function DashboardPage() {
  const headersList = await headers();

  // middleware is guarding this route, so this assertion is safe unless the middleware fails
  const session = (await auth.api.getSession({
    headers: headersList,
  }))!;

  const userCount = await db.$count(user);

  return (
    <div className={`
      flex h-screen flex-col items-center justify-center space-y-8
    `}
    >
      <MattInitBanner />
      <p className="font-sans">
        Hey
        {" "}
        <span className="font-bold">{session.user.name}</span>
        ! This is a protected route, meaning authentication is working!
      </p>
      <div className={`
        flex flex-col items-center justify-center gap-4
        sm:flex-row
      `}
      >
        <p className={`
          bg-foreground text-background flex h-10 items-center justify-center
          gap-2 rounded-full border border-solid border-transparent px-4 text-sm
          font-medium transition-colors
          sm:h-12 sm:w-auto sm:px-5 sm:text-base
        `}
        >
          There are currently
          {" "}
          <span className="font-bold">{userCount}</span>
          {" "}
          users in the database.
        </p>
        <button
          type="button"
          onClick={signOut}
          className={`
            flex h-10 w-full cursor-pointer items-center justify-center
            rounded-full border border-solid border-black/[.08] px-4 text-sm
            font-medium transition-colors
            hover:border-transparent hover:bg-[#f2f2f2]
            sm:h-12 sm:w-auto sm:px-5 sm:text-base
            md:w-[172px]
            dark:border-white/[.145] dark:hover:bg-[#1a1a1a]
          `}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
