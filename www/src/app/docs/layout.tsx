import type React from "react";

import { Sidebar } from "~/app/docs/(components)/sidebar";
import { TableOfContents } from "~/components/table-of-contents";
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
        <div className="ml-64 flex flex-1">
          <main className="flex flex-1 justify-center">
            <div className="w-full max-w-3xl px-8 py-12">{children}</div>
            <aside className={`
              hidden w-64 shrink-0
              xl:block
            `}
            >
              <div className="sticky top-12 px-6">
                <TableOfContents />
              </div>
            </aside>
          </main>

        </div>
      </div>
    </div>
  );
}
