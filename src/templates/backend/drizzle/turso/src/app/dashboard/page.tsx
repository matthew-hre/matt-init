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
    <div className="flex flex-col space-y-8 h-screen items-center justify-center">
      <MattInitBanner />
      <p className="font-sans">
        Hey
        {" "}
        <span className="font-bold">{session.user.name}</span>
        ! This is a protected route, meaning authentication is working!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <p className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto">
          There are currently
          {" "}
          <span className="font-bold">{userCount}</span>
          {" "}
          users in the database.
        </p>
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[172px] cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
