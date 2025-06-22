"use client";

import { Book, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type DocItem = {
  title: string;
  slug: string;
  path: string;
};

type DocSection = {
  title: string;
  items: DocItem[];
};

type SidebarProps = {
  structure: DocSection[];
};

export function Sidebar({ structure }: SidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(structure.map(section => section.title)),
  );

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    }
    else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <aside className={`
      bg-background border-muted fixed top-0 left-0 h-screen w-64
      overflow-y-auto border-r
    `}
    >
      <Link
        href="/"
        className="border-muted flex items-center border-b p-6 pb-6"
      >
        <h2 className="text-lg font-bold">matt-init</h2>
      </Link>

      <nav>
        <Link
          href="/docs"
          className={`
            border-muted flex items-center border-b px-3 py-2 text-sm
            transition-colors
            ${
    pathname === "/docs"
      ? "bg-muted text-foreground"
      : `
        text-muted-foreground
        hover:text-foreground hover:bg-primary/[0.05]
      `
    }
          `}
        >
          <Book className="mr-2 h-4 w-4" />
          matt-init docs
        </Link>

        {structure.map(section => (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className={`
                text-foreground border-muted flex w-full items-center border-b
                px-3 py-2 text-left text-sm font-medium transition-colors
                hover:underline
              `}
            >
              {expandedSections.has(section.title)
                ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  )
                : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}

              {section.title}
            </button>

            {expandedSections.has(section.title) && (
              <ul>
                {section.items.map(item => (
                  <li key={item.slug}>
                    <Link
                      href={item.path}
                      className={`
                        border-muted block border-b px-3 py-2 pl-9 text-sm
                        transition-colors
                        ${
                  pathname === item.path
                    ? "bg-muted text-foreground"
                    : `
                      text-muted-foreground
                      hover:text-foreground hover:bg-foreground/[0.05]
                    `
                  }
                      `}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
