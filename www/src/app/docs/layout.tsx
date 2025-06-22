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
        <main className="flex-1 ml-64">
          <div className="max-w-4xl mx-auto px-8 py-12">{children}</div>
        </main>
      </div>
    </div>
  );
}
