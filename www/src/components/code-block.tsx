"use client";

import type { BundledLanguage, BundledTheme, HighlighterGeneric } from "shiki";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { createHighlighter } from "shiki";

type CodeBlockProps = {
  children: string;
  className?: string;
  language?: string;
};

const languageMap: Record<string, BundledLanguage> = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  bash: "bash",
  shell: "bash",
  sh: "bash",
  json: "json",
  css: "css",
  html: "html",
  md: "markdown",
  mdx: "markdown",
  yml: "yaml",
  yaml: "yaml",
  sql: "sql",
  python: "python",
  py: "python",
  go: "go",
  rust: "rust",
  rs: "rust",
  java: "java",
  cpp: "cpp",
  c: "c",
  diff: "diff",
  docker: "dockerfile",
  dockerfile: "dockerfile",
  toml: "toml",
  ini: "ini",
  xml: "xml",
  env: "dotenv",
};

export function CodeBlock({ children, className = "", language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [highlighter, setHighlighter] = useState<HighlighterGeneric<BundledLanguage, BundledTheme> | null>(null);
  const [html, setHtml] = useState<string>("");

  // Extract language from className if not provided
  const langMatch = className.match(/language-(\w+)/);
  const detectedLang = language || (langMatch ? langMatch[1] : "plaintext");
  const shikiLang = (languageMap[detectedLang] || detectedLang) as BundledLanguage;

  useEffect(() => {
    async function initHighlighter() {
      const hl = await createHighlighter({
        themes: ["github-dark", "github-light"],
        langs: [shikiLang],
      });
      setHighlighter(hl);
    }

    initHighlighter();
  }, [shikiLang]);

  useEffect(() => {
    if (!highlighter)
      return;

    const processCode = async () => {
      try {
        const code = children.trim();
        const highlighted = highlighter.codeToHtml(code, {
          lang: shikiLang,
          theme: theme === "dark" ? "github-dark" : "github-light",
          colorReplacements: {
            "#24292e": "#141416",
          },
        });
        setHtml(highlighted);
      }
      catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        setHtml(`<pre><code>${children}</code></pre>`);
      }
    };

    processCode();
  }, [children, highlighter, shikiLang, theme]);

  if (!html) {
    return (
      <pre className={`
        bg-foreground/[0.05] min-w-full overflow-x-auto rounded-lg border px-6
        py-4
      `}
      >
        <code className="font-mono text-sm">{children}</code>
      </pre>
    );
  }

  return (
    <div
      className="border-muted mb-4 overflow-x-auto rounded-lg border"
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
