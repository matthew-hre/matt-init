import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";

async function signinAction(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/dashboard",
    },
  });

  redirect("/dashboard");
}

export default function SigninPage() {
  return (
    <div className={`
      grid min-h-screen grid-rows-[20px_1fr_20px] items-center
      justify-items-center gap-16 p-8 pb-20
      font-[family-name:var(--font-geist-sans)]
      sm:p-20
    `}
    >
      <main className={`
        row-start-2 flex w-full flex-col items-center gap-8
        sm:items-start
      `}
      >
        <div className="mx-auto w-full max-w-md">
          <h1 className={`
            mb-8 text-center
            font-[family-name:var(--font-geist-sans)]
            text-2xl font-semibold tracking-tight
          `}
          >
            Sign In
          </h1>

          <form action={signinAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={`
                  bg-background text-foreground w-full rounded-full border
                  border-black/[.08] px-4 py-3 transition-colors
                  focus:ring-foreground/20 focus:border-transparent focus:ring-2
                  focus:outline-none
                  dark:border-white/[.145]
                `}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className={`
                  bg-background text-foreground w-full rounded-full border
                  border-black/[.08] px-4 py-3 transition-colors
                  focus:ring-foreground/20 focus:border-transparent focus:ring-2
                  focus:outline-none
                  dark:border-white/[.145]
                `}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className={`
                bg-foreground text-background flex h-12 w-full cursor-pointer
                items-center justify-center gap-2 rounded-full border
                border-solid border-transparent px-5 text-sm font-medium
                transition-colors
                hover:bg-[#383838]
                sm:text-base
                dark:hover:bg-[#ccc]
              `}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-foreground/60 text-sm">Don't have an account? </span>
            <Link
              href="/signup"
              className={`
                text-sm font-medium underline transition-colors
                hover:text-[#1a1a1a]
                dark:hover:text-[#ccc]
              `}
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
