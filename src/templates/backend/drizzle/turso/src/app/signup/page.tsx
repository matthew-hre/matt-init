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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-center font-sans">
            Sign Up
          </h1>

          <form action={signupAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-full border border-black/[.08] dark:border-white/[.145] bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-full border border-black/[.08] dark:border-white/[.145] bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-full border border-black/[.08] dark:border-white/[.145] bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent"
                placeholder="Enter your password"
              />
              <span className="text-xs text-foreground/60 mt-1">
                Password must be at least 8 characters long
              </span>
            </div>

            <button
              type="submit"
              className="w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 px-5 cursor-pointer"
            >
              Sign Up
            </button>

          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-foreground/60">Already have an account? </span>
            <Link
              href="/signin"
              className="text-sm underline font-medium hover:text-[#1a1a1a] dark:hover:text-[#ccc] transition-colors"
            >
              Sign in
            </Link>
            {error && (
              <div className="mb-4 p-3 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm mt-6">
                {error}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
