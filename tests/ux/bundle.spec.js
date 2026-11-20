// The phone app ships as a prebuilt bundle. If someone edits the jsx sources and forgets
// to rebuild, the site keeps serving old behaviour while the code looks fixed.
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { buildBundle } from "../../scripts/build-m.mjs";

test("public/m/app.bundle.js is built from the current sources", () => {
  const shipped = fs.readFileSync(new URL("../../public/m/app.bundle.js", import.meta.url), "utf8");
  expect(shipped === buildBundle(), "bundle is stale. Run: npm run build:m").toBe(true);
});
