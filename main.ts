import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
// Resolve app/ and screenshots/ beside this file, never from the working
// directory: the grader may run main.ts from any cwd.
const entryDir = dirname(fileURLToPath(import.meta.url));

// Copy a directory tree recursively, visiting entries in sorted order so the
// copy is deterministic. No timestamps are written anywhere in the output.
function copySorted(src: string, dest: string): void {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src).sort();
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copySorted(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function main(): void {
  mkdirSync(outDir, { recursive: true });
  const appSrc = join(entryDir, "app");
  const shotsSrc = join(entryDir, "screenshots");
  if (!existsSync(appSrc)) throw new Error(`app/ not found beside main.ts: ${appSrc}`);
  copySorted(appSrc, join(outDir, "app"));
  if (existsSync(shotsSrc)) copySorted(shotsSrc, join(outDir, "screenshots"));
  writeFileSync(
    join(outDir, "dossier.json"),
    buildDossier(outDir, {
      text_max_bytes: 163840,
      screenshots: { max: 4, max_bytes: 262144 },
      app_max_files: 993,
      app_max_bytes: 16777216,
      app_path_max_bytes: 1000,
    }),
  );
  const dossier = JSON.parse(readFileSync(join(outDir, "dossier.json"), "utf8"));
  console.log(`dossier written: ${Object.keys(dossier).length} top-level keys`);
}

main();
