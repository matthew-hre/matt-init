import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";

export default async function DashboardPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    // This shouldn't be possible, as we handle this in the middleware,
    // but just in case, we redirect to the home page.
    redirect("/");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="font-sans">
        Hey
        {" "}
        <span className="font-bold">{session.user.name}</span>
        ! This is a protected route, and you can only access it if you are logged in.
      </p>
    </div>
  );
}
