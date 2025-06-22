import type React from "react";

import { Sidebar } from "~/app/docs/(components)/sidebar";
import { getDocsStructure } from "~/lib/docs";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsStructure = await getDocsStructure();

  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar structure={docsStructure} />
        <main className="ml-64 flex-1">
          <div className="mx-auto max-w-4xl px-8 py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
