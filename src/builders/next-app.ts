import fs from "fs-extra";
import path from "path";

export async function buildNextApp(
    projectDir: string,
    templateDir: string,
    projectName: string,
) {
    fs.copySync(templateDir, projectDir);

    // Rename gitignore
    fs.renameSync(
        path.join(projectDir, "_gitignore"),
        path.join(projectDir, ".gitignore")
    );

    // Update package.json name
    const pkgJsonPath = path.join(projectDir, "package.json");
    const pkgJson = fs.readJsonSync(pkgJsonPath);
    pkgJson.name = projectName;
    fs.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}