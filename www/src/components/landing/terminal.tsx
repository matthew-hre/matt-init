"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function Terminal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const STEPS = useMemo(() => [
    `
◆  What's your project name?
│  my-app
└
  `,
    `
◇  What's your project name?
│  sick-new-project
│
◆  Choose your backend setup:
│  ● Database + Drizzle + BetterAuth
│  ○ Supabase + Drizzle
│  ○ None
└
  `,
    `
◇  What's your project name?
│  sick-new-project
│
◇  Choose your backend setup:
│  Database + Drizzle + BetterAuth
│
◆  Choose your database provider:
│  ● Turso (Locally hostable SQLite)
│  ○ PostgreSQL (Docker)
└
  `,
    `
◇  What's your project name?
│  sick-new-project
│
◇  Choose your backend setup:
│  Database + Drizzle + BetterAuth
│
◇  Choose your database provider:
│  Turso
│
◆  Initialize with Nix flake?
│  ● Yes / ○ No
└
  `,
    `
◇  What's your project name?
│  sick-new-project
│
◇  Choose your backend setup:
│  Database + Drizzle + BetterAuth
│
◇  Choose your database provider:
│  Turso
│
◇  Initialize with Nix flake?
│  Yes
│
◆  Setting up your project...
`,
  ], []);

  // Calculate the maximum height needed based on the longest step
  const maxHeight = useMemo(() => {
    const maxLines = Math.max(...STEPS.map(step => step.split("\n").length));
    // Estimate height: line-height (1.625 for leading-relaxed) * font-size (0.75rem) * lines + padding
    return `${maxLines * 1.625 * 0.75 + 2}rem`;
  }, [STEPS]);

  // Intersection observer to detect when terminal is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 },
    );

    const currentRef = terminalRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Auto-advance through steps when visible
  useEffect(() => {
    if (!isVisible)
      return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        return prev < STEPS.length - 1 ? prev + 1 : prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, STEPS.length]);

  return (
    <div
      ref={terminalRef}
      className={`
        bg-primary/[0.05] border-muted text-primary w-full rounded-lg border p-4
        font-mono text-sm
      `}
      style={{ minHeight: maxHeight }}
      role="region"
      aria-label="Terminal simulation"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center gap-2 text-gray-300">
        <div className="flex gap-1" role="img" aria-label="Terminal window controls">
          <div className="h-3 w-3 rounded-full bg-red-500" aria-label="Close"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500" aria-label="Minimize"></div>
          <div className="h-3 w-3 rounded-full bg-green-500" aria-label="Maximize"></div>
        </div>
      </div>
      <div
        className="relative"
        style={{ minHeight: `calc(${maxHeight} - 3rem)` }}
      >
        <pre className="absolute top-0 left-0 w-full text-xs leading-relaxed">
          {STEPS[currentStep]}
        </pre>
      </div>
    </div>
  );
}
