import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "~/lib/auth";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

async function signupAction(formData: FormData) {
  "use server";

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validationResult = signupSchema.safeParse(rawData);

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map(error => error.message).join(", ");

    redirect(`/signup?error=${
      encodeURIComponent(errorMessages)
    }`);
  }

  const { name, email, password } = validationResult.data;

  await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      callbackURL: "/signin",
    },
  });

  redirect("/signin");
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = (await searchParams).error;
  return (
    <div className={`
      grid min-h-screen grid-rows-[20px_1fr_20px] items-center
      justify-items-center gap-16 p-8 pb-20 font-sans
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
            mb-8 text-center font-sans text-2xl font-semibold tracking-tight
          `}
          >
            Sign Up
          </h1>

          <form action={signupAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={`
                  bg-background text-foreground w-full rounded-full border
                  border-black/[.08] px-4 py-3 transition-colors
                  focus:ring-foreground/20 focus:border-transparent focus:ring-2
                  focus:outline-none
                  dark:border-white/[.145]
                `}
                placeholder="Enter your name"
              />
            </div>

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
              <span className="text-foreground/60 mt-1 text-xs">
                Password must be at least 8 characters long
              </span>
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
              Sign Up
            </button>

          </form>

          <div className="mt-6 text-center">
            <span className="text-foreground/60 text-sm">Already have an account? </span>
            <Link
              href="/signin"
              className={`
                text-sm font-medium underline transition-colors
                hover:text-[#1a1a1a]
                dark:hover:text-[#ccc]
              `}
            >
              Sign in
            </Link>
            {error && (
              <div className={`
                mt-6 mb-4 rounded-full border border-red-200 bg-red-50 p-3
                text-sm text-red-700
                dark:border-red-800 dark:bg-red-900/20 dark:text-red-300
              `}
              >
                {error}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
