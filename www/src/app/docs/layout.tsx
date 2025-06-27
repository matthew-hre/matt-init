import type React from "react";

import { MobileSidebarWrapper } from "~/app/docs/(components)/mobile-sidebar-wrapper";
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
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileSidebarWrapper structure={docsStructure} />
        </div>

        {/* Desktop Sidebar */}
        <div className={`
          hidden
          lg:block
        `}
        >
          <Sidebar structure={docsStructure} />
        </div>

        <div className={`
          flex flex-1 overflow-hidden
          lg:ml-64
        `}
        >
          <main className="flex flex-1 justify-center overflow-x-hidden">
            <div className={`
              w-full max-w-3xl px-4 py-12
              sm:px-6
              lg:px-8
            `}
            >
              {children}
            </div>
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
