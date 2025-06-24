"use client";

import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

type TOCItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  className?: string;
};

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [headerIdsInView, setHeaderIdsInView] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractHeadings = () => {
      // Extract all headings from the content
      const elements = Array.from(
        document.querySelectorAll("article h1, article h2, article h3"),
      );

      const usedIds = new Set<string>();

      const items: TOCItem[] = elements.map((element) => {
        let id = element.id;

        // Generate ID from text content if element doesn't have one
        if (!id) {
          const baseId = element.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
            || "";

          id = baseId;
          let counter = 1;

          // Ensure unique ID by adding counter if needed
          while (usedIds.has(id)) {
            id = `${baseId}-${counter}`;
            counter++;
          }

          element.id = id;
        }

        usedIds.add(id);

        return {
          id,
          text: element.textContent || "",
          level: Number.parseInt(element.tagName.substring(1)),
        };
      });

      return items;
    };

    let updateTimeout: NodeJS.Timeout | null = null;
    let routeChangeTimeout: NodeJS.Timeout | null = null;

    const updateHeadings = () => {
      const items = extractHeadings();
      // Use functional update to avoid ESLint warning
      setHeadings((prevHeadings) => {
        const prevString = JSON.stringify(prevHeadings);
        const newString = JSON.stringify(items);
        return prevString !== newString ? items : prevHeadings;
      });
    };

    // Use setTimeout to avoid calling setState directly in useEffect
    const initialUpdate = setTimeout(updateHeadings, 0);

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        // Check if any nodes were added/removed that might affect headings
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);

          // Check if any heading elements were added or removed
          const hasHeadingChanges = [...addedNodes, ...removedNodes].some((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              return element.matches("h1, h2, h3")
                || element.matches("article")
                || element.querySelector("h1, h2, h3");
            }
            return false;
          });

          if (hasHeadingChanges) {
            shouldUpdate = true;
          }
        }
      });

      if (shouldUpdate) {
        // Debounce the update to avoid excessive re-renders
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }
        updateTimeout = setTimeout(updateHeadings, 100);
      }
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen for route changes in Next.js
    const handleRouteChange = () => {
      // Small delay to allow the new content to render
      if (routeChangeTimeout) {
        clearTimeout(routeChangeTimeout);
      }
      routeChangeTimeout = setTimeout(updateHeadings, 200);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      clearTimeout(initialUpdate);
      observer.disconnect();
      window.removeEventListener("popstate", handleRouteChange);
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      if (routeChangeTimeout) {
        clearTimeout(routeChangeTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const currentIdsInView: string[] = [];

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentIdsInView.push(entry.target.id);
          }
        });

        // Update the list of header IDs currently in view
        setHeaderIdsInView((prev) => {
          const newIds = [...prev];

          // Remove IDs that are no longer intersecting
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              const index = newIds.indexOf(entry.target.id);
              if (index > -1) {
                newIds.splice(index, 1);
              }
            }
          });

          // Add new intersecting IDs
          currentIdsInView.forEach((id) => {
            if (!newIds.includes(id)) {
              newIds.push(id);
            }
          });

          return newIds;
        });
      },
      {
        rootMargin: "-20px 0% -70% 0%",
        threshold: [0, 0.1, 0.5, 1],
      },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  // Determine active header based on what's in view
  useEffect(() => {
    const updateActiveId = () => {
      const currentActiveId = headings.find(heading =>
        headerIdsInView.includes(heading.id),
      )?.id;

      if (currentActiveId) {
        setActiveId(prev => prev !== currentActiveId ? currentActiveId : prev);
      }
    };

    const timeout = setTimeout(updateActiveId, 0);
    return () => clearTimeout(timeout);
  }, [headings, headerIdsInView]);

  if (headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 20; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className={cn("space-y-2", className)}>
      <ul className="text-sm">
        {headings.map(heading => (
          <li
            key={heading.id}
            className="relative"
          >
            <a
              href={`#${heading.id}`}
              onClick={e => handleClick(e, heading.id)}
              style={{
                paddingLeft: `${4 + (heading.level - 1) * 0.75 * 8}px`,
              }}
              className={cn(
                `
                  text-muted-foreground block py-1 transition-colors
                  hover:text-foreground
                `,
                activeId === heading.id && "text-foreground font-medium",
              )}
            >
              {heading.text}
            </a>
            {/* Faint border for all items */}
            <div
              className={`
                bg-muted-foreground/20 absolute top-0 bottom-0 -left-2 w-0.5
              `}
            />
            {/* Prominent border for active item */}
            {activeId === heading.id && (
              <div
                className="bg-foreground absolute top-0 bottom-0 -left-2 w-0.5"
              />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
