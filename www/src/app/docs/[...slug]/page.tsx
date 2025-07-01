import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import { createComponents } from "~/app/docs/(components)/mdx-components";
import { getAllDocsPaths, getDocsContent } from "~/lib/docs";

type DocsPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

export async function generateStaticParams() {
  const paths = await getAllDocsPaths();
  return paths.map(path => ({
    slug: path.split("/").filter(Boolean),
  }));
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  try {
    const { content, frontmatter } = await getDocsContent(slugPath);

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
