import { revalidatePath } from "next/cache";

import { db } from "~/lib/db";
import { message as messageSchema } from "~/lib/db/schema";

import MattInitBanner from "../components/matt-init-banner";

async function addMessage(formData: FormData) {
  "use server";

  try {
    const content = formData.get("message") as string;

    if (!content || content.trim() === "") {
      throw new Error("Message content is required");
    }

    await db.insert(messageSchema).values({
      content: content.trim(),
    });

    revalidatePath("/");
  }
  catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
}

async function getMessage() {
  try {
    const messages = await db.query.message.findFirst({
      orderBy: (message, { desc }) => [desc(message.id)],
    });
    return messages?.content || <span className="text-foreground/20">...have you sent a message yet?</span>;
  }
  catch (error) {
    console.error("Error fetching message:", error);
    return (
      <span
        className="text-red-500"
      >
        "Uh oh! Did you forget to run the migration?"
      </span>
    );
  }
}

export default async function Home() {
  const message = getMessage();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <MattInitBanner />
        <ol className="list-inside list-decimal text-sm/8 text-center sm:text-left font-[family-name:var(--font-geist-mono)] mx-auto">
          <li>
            Get started by adding a message to the database!
            <form
              action={addMessage}
              className="flex flex-col sm:flex-row gap-2 items-center justify-center my-2"
            >
              <input
                type="text"
                name="message"
                placeholder="Enter your message here"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-transparent text-sm sm:text-base px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                required
              />
              <button
                type="submit"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-12 w-14 cursor-pointer"
              >
                ➡️
              </button>
            </form>
          </li>
          <li>
            Fistpump at the database working first try (hopefully):
            <p className="font-mono text-xs sm:text-sm bg-[#f2f2f2] dark:bg-[#1a1a1a] rounded-md p-2 mt-2">
              {message}
            </p>
          </li>
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
