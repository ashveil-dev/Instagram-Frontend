import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "index.html");
const fallback = path.join(dist, "404.html");
const nojekyll = path.join(dist, ".nojekyll");

if (!fs.existsSync(index)) {
	console.error("[prepare-dist] dist/index.html not found. Run build:pages first.");
	process.exit(1);
}

fs.copyFileSync(index, fallback);
if (!fs.existsSync(nojekyll)) {
	fs.writeFileSync(nojekyll, "");
}

console.log("[prepare-dist] 404.html and .nojekyll ready.");
