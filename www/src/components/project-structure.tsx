"use client";

import { useEffect, useState } from "react";

type Feature = {
  id: string;
  label: string;
  checked: boolean;
};

const DEFAULT_FEATURES: Feature[] = [
  { id: "base", label: "Base (always enabled)", checked: true },
  { id: "backend", label: "Backend (Database + Auth)", checked: true },
  { id: "nix", label: "Nix Environment", checked: true },
  { id: "vscode", label: "VS Code Settings", checked: true },
];

type FileNode = {
  name: string;
  type: "file" | "folder";
  features?: string[];
  children?: FileNode[];
  description?: string;
};

const PROJECT_STRUCTURE: FileNode = {
  name: "my-project/",
  type: "folder",
  children: [
    { name: ".env", type: "file", features: ["backend"] },
    { name: ".env.example", type: "file", features: ["backend"] },
    { name: ".gitignore", type: "file" },
    {
      name: ".vscode/",
      type: "folder",
      features: ["vscode"],
      children: [
        { name: "extensions.json", type: "file" },
        { name: "settings.json", type: "file" },
      ],
    },
    { name: "drizzle.config.ts", type: "file", features: ["backend"] },
    { name: "eslint.config.mjs", type: "file" },
    { name: "flake.lock", type: "file", features: ["nix"] },
    { name: "flake.nix", type: "file", features: ["nix"] },
    { name: "next-env.d.ts", type: "file" },
    { name: "next.config.ts", type: "file" },
    { name: "package.json", type: "file" },
    { name: "postcss.config.mjs", type: "file" },
    { name: "tsconfig.json", type: "file" },
    {
      name: "nix/",
      type: "folder",
      features: ["nix"],
      children: [{ name: "devShell.nix", type: "file" }],
    },
    {
      name: "src/",
      type: "folder",
      children: [
        {
          name: "app/",
          type: "folder",
          children: [
            { name: "globals.css", type: "file" },
            { name: "layout.tsx", type: "file" },
            { name: "page.tsx", type: "file" },
            {
              name: "api/",
              type: "folder",
              features: ["backend"],
              children: [
                {
                  name: "auth/",
                  type: "folder",
                  children: [
                    {
                      name: "[...all]/",
                      type: "folder",
                      children: [{ name: "route.ts", type: "file" }],
                    },
                  ],
                },
              ],
            },
            {
              name: "dashboard/",
              type: "folder",
              features: ["backend"],
              children: [{ name: "page.tsx", type: "file" }],
            },
            {
              name: "signin/",
              type: "folder",
              features: ["backend"],
              children: [{ name: "page.tsx", type: "file" }],
            },
            {
              name: "signup/",
              type: "folder",
              features: ["backend"],
              children: [{ name: "page.tsx", type: "file" }],
            },
          ],
        },
        {
          name: "components/",
          type: "folder",
          children: [{ name: "matt-init-banner.tsx", type: "file" }],
        },
        {
          name: "lib/",
          type: "folder",
          children: [
            { name: "auth.ts", type: "file", features: ["backend"] },
            { name: "env.ts", type: "file" },
            { name: "try-parse-env.ts", type: "file" },
            {
              name: "db/",
              type: "folder",
              features: ["backend"],
              children: [
                { name: "index.ts", type: "file" },
                {
                  name: "schema/",
                  type: "folder",
                  children: [
                    { name: "auth.ts", type: "file" },
                    { name: "index.ts", type: "file" },
                  ],
                },
              ],
            },
          ],
        },
        { name: "middleware.ts", type: "file", features: ["backend"] },
      ],
    },
  ],
};

function shouldShowNode(node: FileNode, enabledFeatures: Set<string>): boolean {
  // If no features specified, always show
  if (!node.features || node.features.length === 0) {
    return true;
  }

  // Check if any of the required features are enabled
  return node.features.some(feature => enabledFeatures.has(feature));
}

function renderNode(
  node: FileNode,
  enabledFeatures: Set<string>,
  depth = 0,
  isLast = true,
  parentPrefix = "",
): string[] {
  if (!shouldShowNode(node, enabledFeatures)) {
    return [];
  }

  const lines: string[] = [];
  const indent = depth === 0 ? "" : `${parentPrefix}${isLast ? "└── " : "├── "}`;
  const line = `${indent}${node.name}`;

  lines.push(line);

  if (node.children) {
    const visibleChildren = node.children.filter(child =>
      shouldShowNode(child, enabledFeatures),
    );

    visibleChildren.forEach((child, index) => {
      const isChildLast = index === visibleChildren.length - 1;
      const childPrefix = depth === 0
        ? ""
        : `${parentPrefix}${isLast ? "    " : "│   "}`;

      const childLines = renderNode(
        child,
        enabledFeatures,
        depth + 1,
        isChildLast,
        childPrefix,
      );
      lines.push(...childLines);
    });
  }

  return lines;
}

type ProjectStructureProps = {
  onFeaturesChange?: (features: Set<string>) => void;
};

export function ProjectStructure({ onFeaturesChange }: ProjectStructureProps = {}) {
  const [features, setFeatures] = useState<Feature[]>(DEFAULT_FEATURES);

  // Call onFeaturesChange on mount with initial features
  useEffect(() => {
    if (onFeaturesChange) {
      // Use setTimeout to defer the call until after the current render cycle
      setTimeout(() => {
        const enabledSet = new Set(
          DEFAULT_FEATURES.filter(f => f.checked).map(f => f.id),
        );
        onFeaturesChange(enabledSet);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const toggleFeature = (id: string) => {
    // Don't allow toggling the base feature
    if (id === "base")
      return;

    setFeatures((prev) => {
      const newFeatures = prev.map(f =>
        f.id === id ? { ...f, checked: !f.checked } : f,
      );

      // Call onFeaturesChange after state update is complete
      if (onFeaturesChange) {
        setTimeout(() => {
          const enabledSet = new Set(
            newFeatures.filter(f => f.checked).map(f => f.id),
          );
          onFeaturesChange(enabledSet);
        }, 0);
      }

      return newFeatures;
    });
  };

  const enabledFeatures = new Set(
    features.filter(f => f.checked).map(f => f.id),
  );

  const structure = renderNode(PROJECT_STRUCTURE, enabledFeatures).join("\n");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-semibold">Toggle Features</h3>
        <div className="flex flex-wrap gap-3">
          {features.map(feature => (
            <label
              key={feature.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={feature.checked}
                onChange={() => toggleFeature(feature.id)}
                disabled={feature.id === "base"}
                className="rounded border-gray-300"
              />
              <span className={feature.id === "base" ? "text-muted-foreground" : ""}>
                {feature.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <pre className="bg-foreground/[0.05] rounded-lg border px-6 py-4">
          <code className="font-mono text-sm">{structure}</code>
        </pre>
      </div>
    </div>
  );
}
