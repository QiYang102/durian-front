#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

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

let issuesFound = 0;

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
        issuesFound++;
      }
    }
  }
});

if (issuesFound > 0) {
  console.log(`\x1b[31mFound ${issuesFound} case sensitivity issues.\x1b[0m`);
  console.log(
    "These issues will cause build failures on case-sensitive file systems (like Linux/GitHub Actions).",
  );
  console.log("Please fix the imports to match the actual file names.");
} else {
  console.log("\x1b[32mNo case sensitivity issues found!\x1b[0m");
}
