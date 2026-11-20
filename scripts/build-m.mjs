// Rebuilds public/m/app.bundle.js from the jsx sources in public/m.
// Run with: npm run build:m        Check only (no write): npm run build:m -- --check
import { transformSync } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "m");
// Order matters: each file uses globals defined by the ones before it.
const FILES = [
  "frames/ios-frame.jsx",
  "app/data.jsx",
  "app/screens-library.jsx",
  "app/screens-record.jsx",
  "app/cleantake.jsx",
  "app/screens-meetings.jsx",
  "app/screens-account.jsx",
  "app/app.jsx",
];

export function buildBundle() {
  let out = "";
  for (const f of FILES) {
    const src = fs.readFileSync(path.join(root, f), "utf8");
    out += `\n;/* ${f} */\n` + transformSync(src, { loader: "jsx", jsx: "transform", target: "es2018" }).code;
  }
  return out;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const target = path.join(root, "app.bundle.js");
  const built = buildBundle();
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
    if (current !== built) {
      console.error("public/m/app.bundle.js is out of date. Run: npm run build:m");
      process.exit(1);
    }
    console.log("public/m/app.bundle.js matches its sources.");
  } else {
    fs.writeFileSync(target, built);
    console.log("Wrote public/m/app.bundle.js");
  }
}
