// Next 16.2.10 exports nested RSC segment names on Windows; the client requests
// their dot-separated equivalents. Keep payloads untouched and retain originals.
// Upstream: https://github.com/vercel/next.js/issues/92339
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const checkOnly = process.argv.includes("--check");
const segments = [];

function collect(directory, parent, parts = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (parent) collect(source, parent, [...parts, entry.name]);
      else if (entry.name.startsWith("__next.")) collect(source, directory, [entry.name]);
      else collect(source);
    } else if (parent && entry.isFile() && entry.name.endsWith(".txt")) {
      segments.push({ source, target: path.join(parent, [...parts, entry.name].join(".")) });
    }
  }
}

collect(root);
let added = 0;
for (const { source, target } of segments) {
  if (fs.existsSync(target)) {
    if (!fs.readFileSync(source).equals(fs.readFileSync(target))) {
      throw new Error(`Conflicting static segment: ${path.relative(root, target)}`);
    }
  } else if (checkOnly) {
    throw new Error(`Missing static segment: ${path.relative(root, target)}. Run npm run build.`);
  } else {
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    added++;
  }
}
console.log(`Static segment filenames verified: ${segments.length}; added: ${added}.`);
