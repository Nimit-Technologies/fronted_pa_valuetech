/**
 * Fails the build when the JavaScript every user downloads before they see
 * anything grows past its budget.
 *
 * "Initial" is read from the built index.html rather than from a list kept
 * here: it is the entry script plus everything the browser is told to
 * modulepreload, which is exactly what a route-level React.lazy boundary keeps
 * out. Adding a static import that drags a dashboard into the entry chunk is
 * the regression this catches, and it is invisible in the per-file sizes vite
 * prints because each file stays small.
 *
 * Gzipped, because that is what crosses the network. The budget is generous
 * against the current 177 KB so that ordinary feature work does not trip it;
 * if a change genuinely needs more, raise it deliberately here rather than
 * letting it drift.
 *
 * Run as postbuild, so `npm run build` enforces it everywhere — including the
 * Docker image build.
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const DIST = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "dist",
);

const BUDGET_KB = { js: 250, css: 50 };

const gzippedKb = (file) => zlib.gzipSync(fs.readFileSync(file)).length / 1024;

const indexHtml = path.join(DIST, "index.html");

if (!fs.existsSync(indexHtml)) {
  console.error(`[bundle-size] No build found at ${DIST}.`);
  process.exit(1);
}

const html = fs.readFileSync(indexHtml, "utf8");

// Both the entry <script src> and every <link rel="modulepreload"/stylesheet>,
// which together are the first-paint download.
const assets = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+)"/g)].map(
  (match) => match[1],
);

const total = { js: 0, css: 0 };

for (const asset of assets) {
  const kind = asset.endsWith(".css") ? "css" : asset.endsWith(".js") && "js";
  if (!kind) continue;
  total[kind] += gzippedKb(path.join(DIST, "assets", asset));
}

const report = (kind) =>
  `${kind.toUpperCase()} ${total[kind].toFixed(1)} KB / ${BUDGET_KB[kind]} KB`;

const over = Object.keys(BUDGET_KB).filter(
  (kind) => total[kind] > BUDGET_KB[kind],
);

// Printed on every build, over budget or not: the number is only useful if
// someone sees it move.
console.log(
  `[bundle-size] initial download, gzipped — ${report("js")}, ${report("css")}`,
);

if (over.length > 0) {
  console.error(
    `[bundle-size] over budget: ${over.map(report).join(", ")}.\n` +
      "Something that used to be lazy is now in the entry chunk. Check for a " +
      "static import of a page or a heavy library in src/App.jsx or anything " +
      "it imports eagerly, or raise the budget in scripts/check-bundle-size.mjs " +
      "deliberately.",
  );
  process.exit(1);
}
