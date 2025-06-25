import { Book, Github } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className={`
      bg-background/80 fixed top-4 z-10 flex flex-row items-center
      justify-center gap-4 rounded-full p-2 backdrop-blur-md
      sm:p-4
    `}
    >
      <Link
        href="/docs"
        className={`
          bg-foreground text-background flex h-10 w-auto items-center
          justify-center gap-2 rounded-full border border-solid
          border-transparent px-4 text-sm font-medium transition-colors
          hover:bg-muted-foreground
          sm:h-12 sm:px-5 sm:text-base
        `}
      >
        <Book className={`
          h-4 w-4
          sm:h-5 sm:w-5
        `}
        />
        Documentation
      </Link>
      <a
        className={`
          border-muted flex h-10 w-auto items-center justify-center gap-2
          rounded-full border border-solid px-4 text-sm font-medium
          transition-colors
          hover:bg-muted hover:border-transparent
          sm:h-12 sm:px-5 sm:text-base
        `}
        href="https://github.com/matthew-hre/matt-init"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className={`
          h-4 w-4
          sm:h-5 sm:w-5
        `}
        />
        Github
      </a>
    </div>
  );
}
