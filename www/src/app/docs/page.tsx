import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { createComponents } from "~/app/docs/(components)/mdx-components";
import { getDocsContent } from "~/lib/docs";

export default async function DocsRootPage() {
  try {
    const { content, frontmatter } = await getDocsContent("docs");

    const components = createComponents();

    return (
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{frontmatter.title}</h1>
          {frontmatter.description && (
            <p className="text-muted-foreground text-lg">
              {frontmatter.description}
            </p>
          )}
        </header>
        <hr className="mt-8" />
        <MDXRemote source={content} components={components} />
      </article>
    );
  }
  catch (error) {
    console.error("Error loading documentation content:", error);
    notFound();
  }
}
