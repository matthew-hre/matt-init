import { Book, Github } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed top-4 flex gap-4 items-center flex-row justify-center p-2 sm:p-4 z-10 bg-background/80 backdrop-blur-md rounded-full">
      <Link
        href="/docs"
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-muted-foreground font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-auto"
      >
        <Book className="w-4 h-4 sm:w-5 sm:h-5" />
        Documentation
      </Link>
      <a
        className="rounded-full border border-solid border-muted transition-colors flex items-center justify-center hover:bg-muted hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-auto gap-2"
        href="https://github.com/matthew-hre/matt-init"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="w-4 h-4 sm:w-5 sm:h-5" />
        Github
      </a>
    </div>
  );
}
