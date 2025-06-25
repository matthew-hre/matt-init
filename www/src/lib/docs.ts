import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const docsDirectory = path.join(process.cwd(), "src/docs");

type DocItem = {
  title: string;
  slug: string;
  path: string;
};

type DocItemWithOrder = DocItem & {
  order: number;
};

type DocSection = {
  title: string;
  items: DocItem[];
};

function formatTitle(filename: string): string {
  return filename
    .replace(/\.mdx?$/, "")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function getDocsStructure(): Promise<DocSection[]> {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const sections: DocSection[] = [];
  const sectionDirs = fs
    .readdirSync(docsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Define section order - sections not listed here will appear at the end alphabetically
  const sectionOrder = ["about", "usage", "next-steps"];

  // Sort sections according to the defined order
  const orderedSectionDirs = sectionDirs.sort((a, b) => {
    const indexA = sectionOrder.indexOf(a);
    const indexB = sectionOrder.indexOf(b);

    // If both sections are in the order array, sort by their order
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only one is in the order array, prioritize it
    if (indexA !== -1)
      return -1;
    if (indexB !== -1)
      return 1;

    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });

  for (const sectionDir of orderedSectionDirs) {
    const sectionPath = path.join(docsDirectory, sectionDir);
    const files = fs
      .readdirSync(sectionPath)
      .filter(file => file.endsWith(".mdx") || file.endsWith(".md"));

    const items: DocItemWithOrder[] = [];

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(sectionPath, file);
      let title = formatTitle(file);
      let order = Number.MAX_SAFE_INTEGER; // Default to end if no order specified

      try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(fileContent);

        // Use frontmatter title if available, otherwise use formatted filename
        if (data.title) {
          title = data.title;
        }

        // Use frontmatter order if specified
        if (typeof data.order === "number") {
          order = data.order;
        }
      }
      catch (error) {
        // If there's an error reading frontmatter, just use defaults
        console.warn(`Warning: Could not read frontmatter for ${filePath}:`, error);
      }

      items.push({
        title,
        slug,
        path: `/docs/${sectionDir}/${slug}`,
        order,
      });
    }

    // Sort items by order, then by title for items with the same order
    items.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });

    if (items.length > 0) {
      sections.push({
        title: formatTitle(sectionDir),
        items: items.map(({ order, ...item }) => item), // Remove order from final output
      });
    }
  }

  return sections;
}

export async function getAllDocsPaths(): Promise<string[]> {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }

  const paths: string[] = [];
  const sectionDirs = fs
    .readdirSync(docsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const sectionDir of sectionDirs) {
    const sectionPath = path.join(docsDirectory, sectionDir);
    const files = fs.readdirSync(sectionPath).filter(file => file.endsWith(".mdx") || file.endsWith(".md"));

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      paths.push(`${sectionDir}/${slug}`);
    }
  }

  return paths;
}

export async function getDocsContent(slugPath: string) {
  let fullPath: string;

  if (slugPath === "docs") {
    fullPath = path.join(docsDirectory, "docs.mdx");
  }
  else {
    fullPath = path.join(docsDirectory, `${slugPath}.mdx`);
  }

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: data,
    content,
  };
}
