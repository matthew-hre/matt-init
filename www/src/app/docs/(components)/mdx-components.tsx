import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import Link from "next/link";

import { CodeBlock } from "~/components/code-block";
import { ProjectStructure } from "~/components/project-structure";
import { ProjectStructureWithDocs } from "~/components/project-structure-with-docs";

function createHeadingId(children: ReactNode): string {
  const extractText = (node: ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (typeof node === "number") {
      return node.toString();
    }
    if (Array.isArray(node)) {
      return node.map(extractText).join("");
    }
    if (node && typeof node === "object" && "props" in node && node.props && typeof node.props === "object" && "children" in node.props) {
      return extractText(node.props.children as ReactNode);
    }
    return "";
  };

  const text = extractText(children);
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export const components: MDXComponents = {
  h1: ({ children }: { children: ReactNode }) => {
    const id = createHeadingId(children);
    return (
      <h1
        id={id}
        className={`
          text-foreground mt-8 mb-6 text-3xl font-bold
          first:mt-0
        `}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children }: { children: ReactNode }) => {
    const id = createHeadingId(children);
    return (
      <h2
        id={id}
        className="text-foreground mt-8 mb-4 text-2xl font-semibold"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }: { children: ReactNode }) => {
    const id = createHeadingId(children);
    return (
      <h3
        id={id}
        className="text-foreground mt-6 mb-3 text-xl font-semibold"
      >
        {children}
      </h3>
    );
  },
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
  pre: ({ children, ...props }: { children: any } & React.HTMLAttributes<HTMLPreElement>) => {
    if (
      children?.props?.children
    ) {
      const { className, children: codeChildren } = children.props as { className?: string; children: ReactNode };
      return (
        <CodeBlock className={className} language={className?.replace("language-", "")}>
          {String(codeChildren)}
        </CodeBlock>
      );
    }
    return (
      <pre
        className={`
          bg-foreground/[0.05] mb-4 min-w-full overflow-x-auto rounded-lg px-6
          py-4
        `}
        {...props}
      >
        {children}
      </pre>
    );
  },
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
  ProjectStructure,
  ProjectStructureWithDocs,
};
