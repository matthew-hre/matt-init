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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-muted overflow-y-auto">
      <Link href="/" className="flex items-center pb-6 p-6 border-b border-muted">
        <h2 className="text-lg font-bold">matt-init</h2>
      </Link>

      <nav>
        <Link
          href="/docs"
          className={`flex items-center text-sm py-2 px-3 transition-colors border-b border-muted ${
            pathname === "/docs"
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-primary/[0.05]"
          }`}
        >
          <Book className="w-4 h-4 mr-2" />
          matt-init docs
        </Link>

        {structure.map(section => (
          <div key={section.title}>
            <button
              type="button"
              onClick={() => toggleSection(section.title)}
              className="flex items-center w-full text-left text-sm font-medium text-foreground py-2 px-3 hover:underline transition-colors border-b border-muted"
            >
              {expandedSections.has(section.title)
                ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  )
                : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}

              {section.title}
            </button>

            {expandedSections.has(section.title) && (
              <ul>
                {section.items.map(item => (
                  <li key={item.slug}>
                    <Link
                      href={item.path}
                      className={`pl-9 block text-sm py-2 px-3 transition-colors border-b border-muted ${
                        pathname === item.path
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                      }`}
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
