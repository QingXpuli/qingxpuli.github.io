import { copyFile, access } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

const outputDir = path.join(process.cwd(), "out");
const nestedNotFound = path.join(outputDir, "404", "index.html");
const rootNotFound = path.join(outputDir, "404.html");

try {
  await access(nestedNotFound, constants.F_OK);
  await copyFile(nestedNotFound, rootNotFound);
} catch {
  console.error(`Expected static 404 page was not found: ${nestedNotFound}`);
  process.exitCode = 1;
}
