import fs from "fs-extra";

/**
 * Handles the case where the target directory already exists and is not empty.
 *
 * @param projectDir the directory where the project will be created
 * @param projectName the name of the project, used for display purposes
 * @returns "overwrite" | "merge" | "cancel"
 */
export async function handleExistingDirectory(projectDir: string, projectName: string): Promise<"overwrite" | "merge" | "cancel"> {
  const { select, isCancel } = await import("@clack/prompts");

  const choice = await select({
    message: `Directory "${projectName}" already exists and is not empty. What would you like to do?`,
    options: [
      { value: "overwrite", label: "Overwrite (delete existing content)" },
      { value: "merge", label: "Merge (keep existing files, add new ones)" },
      { value: "cancel", label: "Cancel operation" },
    ],
    initialValue: "cancel",
  });

  if (isCancel(choice)) {
    return "cancel";
  }

  return choice as "overwrite" | "merge" | "cancel";
}

/**
 * Handles directory conflicts when creating a new project.
 *
 * @param projectDir the directory where the project will be created
 * @param projectName the name of the project, used for display purposes
 */
export async function handleDirectoryConflict(projectDir: string, projectName: string): Promise<void> {
  if (fs.existsSync(projectDir)) {
    const dirContents = fs.readdirSync(projectDir);
    if (dirContents.length > 0) {
      const action = await handleExistingDirectory(projectDir, projectName);

      switch (action) {
        case "overwrite": {
          await fs.remove(projectDir);
          break;
        }
        case "merge": {
          // Do nothing, let the copy operation merge/overwrite files
          break;
        }
        case "cancel": {
          const { cancel } = await import("@clack/prompts");
          cancel("Operation cancelled.");
          process.exit(0);
        }
      }
    }
  }
}
