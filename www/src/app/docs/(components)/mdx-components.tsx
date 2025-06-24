import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import Link from "next/link";

export const components: MDXComponents = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className={`
      text-foreground mt-8 mb-6 text-3xl font-bold
      first:mt-0
    `}
    >
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-foreground mt-8 mb-4 text-2xl font-semibold">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-foreground mt-6 mb-3 text-xl font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="text-muted-foreground mb-4 text-base leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="text-muted-foreground mb-4 list-outside list-disc space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className={`
      text-muted-foreground mb-4 list-outside list-decimal space-y-1
    `}
    >
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-muted-foreground ml-4">
      {children}
    </li>
  ),
  Link: ({ href, children }: { href?: string; children: ReactNode }) => (
    <Link
      href={href || "#"}
      className={`
        underline transition-colors
        hover:text-foreground
      `}
    >
      {children}
    </Link>
  ),
  code: ({ children }: { children: ReactNode }) => (
    <code className="font-mono">
      {children}
    </code>
  ),
  pre: ({ children }: { children: ReactNode }) => (
    <pre className={`
      bg-foreground/[0.05] mb-4 w-max overflow-x-auto rounded-lg border px-6
      py-4
    `}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className={`
      border-foreground text-muted-foreground mb-4 border-l-4 pl-4 italic
    `}
    >
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      className={`
        underline transition-colors
        hover:text-foreground
      `}
    >
      {children}
    </a>
  ),
  CardLink: ({ title, description, href }: { title: string; description: string; href: string }) => (
    <Link
      className={`
        border-muted rounded-lg border p-6 transition-colors
        hover:bg-foreground/[0.05]
      `}
      href={href}
    >
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
    </Link>
  ),
};
