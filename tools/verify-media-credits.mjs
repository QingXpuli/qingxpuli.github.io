import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const manifestPath = path.join(root, "content", "media-credits.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const registered = new Map(manifest.map((entry) => [entry.path, entry]));
const failures = [];

if (!Array.isArray(manifest) || manifest.length === 0) {
  failures.push("media credit manifest is empty");
}

for (const [index, entry] of manifest.entries()) {
  if (!entry || !["image", "audio", "lyrics", "font"].includes(entry.kind)) failures.push(`entry ${index + 1}: invalid kind`);
  if (!entry?.path || !entry.author || !entry.license) failures.push(`entry ${index + 1}: path, author and license are required`);
  if (entry?.path?.startsWith("/")) {
    try {
      await access(path.join(publicDir, entry.path.slice(1)));
    } catch {
      failures.push(`missing local media: ${entry.path}`);
    }
  }
}

async function collectFiles(directory, relative = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    const filePath = path.join(relative, entry.name).replaceAll("\\", "/");
    if (entry.isDirectory()) files.push(...await collectFiles(file, filePath));
    else files.push(`/${filePath}`);
  }
  return files;
}

for (const file of await collectFiles(publicDir)) {
  if (!registered.has(file)) failures.push(`unregistered public media: ${file}`);
}

if (failures.length) {
  console.error("Media credit verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Media credit verification passed: ${manifest.length} entries registered.`);
}
