import { text } from "@clack/prompts";

/**
 * Prompts the user for a project name and validates the input.
 *
 * @returns {Promise<{ projectName: string }>} The user's project name.
 */
export async function promptProjectName(): Promise<{ projectName: string }> {
  const projectName = await text({
    message: "What's your project name?",
    placeholder: "my-app",
    validate: (value) => {
      if (!value)
        return "Project name is required";
      if (!/^[a-z0-9-]+$/.test(value)) {
        return "Project name must only contain lowercase letters, numbers, and hyphens";
      }
      return undefined;
    },
  });

  if (typeof projectName === "symbol") {
    process.exit(0);
  }

  return { projectName };
}
