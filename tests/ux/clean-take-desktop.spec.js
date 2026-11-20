// REGRESSION: missing desktop editing interface.
// Original bug: desktop users landed on a review screen with take details and no
// editing tools. These tests open a take the way a desktop user does, through /app.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openDesktopApp, seedTake, openTakeEditor, box, isHittable, CONTROL_SELECTOR } from "./helpers.js";

const DESKTOPS = [
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1440x900", width: 1440, height: 900 },
];

async function openEditor(page) {
  await seedFirstRun(page);
  let app = await openDesktopApp(page);
  await seedTake(app);
  await page.reload();
  app = await openDesktopApp(page);
  await openTakeEditor(app);
  return app;
}

for (const vp of DESKTOPS) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("opening a take gives the editor, not a details-only review screen", async ({ page }) => {
      const app = await openEditor(page);
      await expect(app.getByTestId("ct-preview")).toBeVisible();

      // The same editing tools as mobile are present and each one has working controls.
      const names = await app.locator('[data-testid^="ct-tab-"]').evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
      for (const required of ["ct-tab-Clean", "ct-tab-Style", "ct-tab-Captions", "ct-tab-Export"]) {
        expect(names, `desktop editor offers ${required}`).toContain(required);
      }
      await app.getByTestId("ct-tab-Clean").click();
      const first = app.getByTestId("ct-panel").locator(CONTROL_SELECTOR).filter({ visible: true }).first();
      await expect(first).toBeVisible();
      expect(await isHittable(first), "first Clean control can be clicked").toBe(true);

      // A real control changes the edit: brightness changes the preview filter.
      await app.getByTestId("ct-tab-Style").click();
      const video = app.getByTestId("ct-preview").locator("video");
      const before = await video.evaluate((v) => getComputedStyle(v).filter);
      await app.getByTestId("ct-panel").locator('input[type="range"]').first().fill("125");
      await expect.poll(() => video.evaluate((v) => getComputedStyle(v).filter), { message: "brightness slider changes the preview" }).not.toBe(before);
    });

    // Known gap (brief section 4.2). Today desktop shows the phone editor inside a
    // 460px frame. The target is a real desktop layout: large preview, tools in a side
    // panel. This test is expected to fail until that ships. When it starts passing,
    // Playwright reports it, and this test.fail line must be deleted so it becomes a
    // normal regression check.
    test("editor uses a desktop layout: large preview with the tools beside it", async ({ page }) => {
      test.fail(true, "Desktop Clean Take layout is not built yet. Remove this line when it ships.");
      const app = await openEditor(page);
      const preview = await box(app.getByTestId("ct-preview"));
      const panel = await box(app.getByTestId("ct-panel"));
      expect(preview.width, "preview uses the desktop width").toBeGreaterThanOrEqual(Math.min(640, vp.width * 0.5));
      expect(panel.x, "tools panel sits to the right of the preview").toBeGreaterThanOrEqual(preview.right - 1);
    });
  });
}
