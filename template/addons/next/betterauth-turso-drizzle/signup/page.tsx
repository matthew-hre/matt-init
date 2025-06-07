import Link from "next/link";

import { auth } from "~/lib/auth"; // Adjust the import path as necessary

async function signupAction(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: "/signin",
      },
    });
  }
  catch (error) {
    console.error("Signup error:", error);
  }
}

export default function SignupPage() {
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
          </div>
        </div>
      </main>
    </div>
  );
}
