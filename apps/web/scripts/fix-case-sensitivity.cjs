#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const SRC_DIR = path.resolve(__dirname, "../src");
const COMPONENTS_DIR = path.resolve(SRC_DIR, "components");
const FILE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (FILE_EXTENSIONS.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const allFiles = getAllFiles(SRC_DIR);

const componentMap = {};

const importUsageCount = {};

getAllFiles(COMPONENTS_DIR).forEach((filePath) => {
  const fileName = path.basename(filePath);
  const componentName = path.basename(filePath, path.extname(filePath));
  const relativePath = path.relative(SRC_DIR, filePath);

  componentMap[componentName.toLowerCase()] = {
    actualName: componentName,
    relativePath: relativePath.replace(/\\/g, "/"),
    filePath,
  };
});

const importRegex =
  /@\/components\/([^/'"]+)\/([^/'"]+)|@\/components\/([^/'"]+)/g;

allFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const componentDir = match[1];
    const componentName = match[2] || match[3];

    if (!componentName) continue;

    const importPath = `@/components/${componentDir}/${componentName}`;
    importUsageCount[importPath] = (importUsageCount[importPath] || 0) + 1;
  }
});

let issuesFound = 0;
let issuesFixed = 0;

const mismatches = [];

allFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const relativeFilePath = path.relative(process.cwd(), filePath);

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const componentDir = match[1];
    const componentName = match[2] || match[3];

    if (!componentName) continue;

    const lowerComponentName = componentName.toLowerCase();

    if (componentMap[lowerComponentName]) {
      const actualComponent = componentMap[lowerComponentName];

      if (componentName !== actualComponent.actualName) {
        console.log(`\x1b[33mCase mismatch in ${relativeFilePath}:\x1b[0m`);
        console.log(`  Import: @/components/${componentDir}/${componentName}`);
        console.log(
          `  Actual: @/components/${path.dirname(actualComponent.relativePath).replace("components/", "")}/${actualComponent.actualName}`,
        );
        console.log("");

        mismatches.push({
          importName: componentName,
          actualName: actualComponent.actualName,
          filePath: actualComponent.filePath,
          directory: componentDir,
        });

        issuesFound++;
      }
    }
  }
});

if (issuesFound > 0) {
  console.log(`\x1b[31mFound ${issuesFound} case sensitivity issues.\x1b[0m`);

  const fileRenames = {};

  mismatches.forEach((mismatch) => {
    if (!fileRenames[mismatch.filePath]) {
      fileRenames[mismatch.filePath] = {
        oldPath: mismatch.filePath,
        newName: mismatch.importName,
        oldName: mismatch.actualName,
        directory: mismatch.directory,
      };
    } else {
      const currentImportPath = `@/components/${fileRenames[mismatch.filePath].directory}/${fileRenames[mismatch.filePath].newName}`;
      const newImportPath = `@/components/${mismatch.directory}/${mismatch.importName}`;

      if (
        (importUsageCount[newImportPath] || 0) >
        (importUsageCount[currentImportPath] || 0)
      ) {
        fileRenames[mismatch.filePath].newName = mismatch.importName;
        fileRenames[mismatch.filePath].directory = mismatch.directory;
      }
    }
  });

  console.log("\nThe following files will be renamed to match imports:");

  Object.values(fileRenames).forEach((rename) => {
    console.log(
      `  ${path.basename(rename.oldPath)} -> ${rename.newName}${path.extname(rename.oldPath)}`,
    );
  });

  console.log("\nDo you want to proceed with these renames? (y/n)");

  const userInput = "y";

  if (userInput.toLowerCase() === "y") {
    Object.values(fileRenames).forEach((rename) => {
      const dirPath = path.dirname(rename.oldPath);
      const newPath = path.join(
        dirPath,
        `${rename.newName}${path.extname(rename.oldPath)}`,
      );

      try {
        const relativeOldPath = path.relative(process.cwd(), rename.oldPath);
        const relativeNewPath = path.relative(process.cwd(), newPath);

        try {
          execSync(`git ls-files --error-unmatch "${relativeOldPath}"`, {
            stdio: "pipe",
          });
          const isTracked = true;

          execSync(`git mv -f "${relativeOldPath}" "${relativeNewPath}"`, {
            stdio: "inherit",
          });

          console.log(
            `\x1b[32mRenamed with git mv: ${path.basename(rename.oldPath)} -> ${rename.newName}${path.extname(rename.oldPath)}\x1b[0m`,
          );
        } catch (error) {
          const tempPath = path.join(
            dirPath,
            `__temp_${Date.now()}${path.extname(rename.oldPath)}`,
          );
          fs.renameSync(rename.oldPath, tempPath);
          fs.renameSync(tempPath, newPath);

          console.log(
            `\x1b[32mRenamed with fs (untracked file): ${path.basename(rename.oldPath)} -> ${rename.newName}${path.extname(rename.oldPath)}\x1b[0m`,
          );
        }

        issuesFixed++;
      } catch (error) {
        console.error(
          `\x1b[31mError renaming ${rename.oldPath}: ${error.message}\x1b[0m`,
        );
      }
    });

    console.log(
      `\n\x1b[32mFixed ${issuesFixed} of ${issuesFound} issues.\x1b[0m`,
    );

    if (issuesFixed < issuesFound) {
      console.log(
        "\x1b[33mSome issues could not be fixed automatically. Please check the remaining issues manually.\x1b[0m",
      );
    }
  } else {
    console.log("\nRename operation cancelled.");
  }
} else {
  console.log("\x1b[32mNo case sensitivity issues found!\x1b[0m");
}
