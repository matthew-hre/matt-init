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
          flex flex-1 flex-col items-center
          lg:ml-64
        `}
        >
          <div className="flex flex-row">
            <main className="flex max-w-3xl justify-center overflow-x-hidden">
              <div className={`
                w-full px-4 py-12
                sm:px-6
                lg:px-8
              `}
              >
                {children}
              </div>
            </main>
            <aside className={`
              hidden w-64 shrink-0
              xl:block
            `}
            >
              <div className="sticky top-0 h-screen overflow-y-auto px-6 py-12">
                <TableOfContents />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
