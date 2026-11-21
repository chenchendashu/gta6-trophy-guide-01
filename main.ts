// Leonida Platinum — the hand-in program for the gta6-trophy-guide-01 entry.
//
// The guide itself is the static web app in app/ (open app/index.html through
// any static server; it works offline). This program hands it in: it copies
// app/ and screenshots/ from beside this file into the output directory and
// writes the dossier the judge reads, using the kit's vendored library —
// vendor/makefun-frontend.ts stays byte for byte the kit's copy, because the
// scorer rebuilds the dossier with its own copy and compares the two.
//
// Run it the way the kit prescribes:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (MAKEFUN_OUTPUT_DIR stands in for /output outside the grader's container.)
// Serve the app locally with: node serve.ts  →  http://localhost:8080

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoDir = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, "app"), join(outputDir, "app"), { recursive: true });
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(join(repoDir, "screenshots"))) {
  cpSync(join(repoDir, "screenshots"), join(outputDir, "screenshots"), { recursive: true });
}

// The caps are the scorer's own (the kit's reference/gate.json): the dossier
// text is capped at 160 KiB, at most 4 screenshots of at most 256 KiB each,
// and app/ at most 993 entries and 48 MiB. buildDossier refuses anything
// past them, exactly as the scorer would.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
