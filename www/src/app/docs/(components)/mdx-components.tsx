import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import Link from "next/link";

export const components: MDXComponents = {
  h1: ({ children }: { children: ReactNode }) => <h1 className="text-foreground text-3xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>,
  h2: ({ children }: { children: ReactNode }) => <h2 className="text-foreground text-2xl font-semibold mb-4 mt-8">{children}</h2>,
  h3: ({ children }: { children: ReactNode }) => <h3 className="text-foreground text-xl font-semibold mb-3 mt-6">{children}</h3>,
  p: ({ children }: { children: ReactNode }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
  ul: ({ children }: { children: ReactNode }) => <ul className="list-disc list-outside mb-4 text-muted-foreground space-y-1">{children}</ul>,
  ol: ({ children }: { children: ReactNode }) => <ol className="list-decimal list-outside mb-4 text-muted-foreground space-y-1">{children}</ol>,
  li: ({ children }: { children: ReactNode }) => <li className="text-muted-foreground ml-4">{children}</li>,
  Link: ({ href, children }: { href?: string; children: ReactNode }) => (
    <Link
      href={href || "#"}
      className="underline hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="text-sm font-mono">{children}</code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className="bg-foreground/[0.05] py-4 px-6 rounded-lg overflow-x-auto mb-4 border w-max">{children}</pre>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-foreground pl-4 italic text-muted-foreground mb-4">{children}</blockquote>
  ),
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a href={href} className="underline hover:text-foreground transition-colors">
      {children}
    </a>
  ),
  CardLink: ({ title, description, href }: { title: string; description: string; href: string }) => (
    <Link
      className="border border-muted rounded-lg p-6 hover:bg-foreground/[0.05] transition-colors"
      href={href}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
    </Link>
  ),
};
