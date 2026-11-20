// REGRESSION: mobile Clean Take editing controls hidden.
// Original bug: an oversized video preview, a tall tab row and a sticky bottom bar left
// the editing controls below the fold or underneath the Save bar on real phones.
// These checks run at phone sizes including short ones that stand in for Safari with
// its address bar and toolbar showing.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openPhoneApp, seedTake, openTakeEditor, box, isHittable, CONTROL_SELECTOR } from "./helpers.js";

const PHONES = [
  { name: "320x568 (small phone)", width: 320, height: 568 },
  { name: "360x640", width: 360, height: 640 },
  { name: "375x553 (iPhone SE with Safari bars)", width: 375, height: 553 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x664 (iPhone with Safari bars)", width: 390, height: 664 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
];
const MIN_PREVIEW_HEIGHT = 120;
const MIN_TOUCH_TARGET = 36;
const MIN_PANEL_HEIGHT = 96; // room for two rows of controls between the tool row and the Save bar
// Tabs that open with read-only information. Their controls must still be reachable by
// scrolling, but need not be the first thing on screen.
const INFO_TABS = ["ct-tab-Review"];

for (const vp of PHONES) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height }, isMobile: true, hasTouch: true });

    test("every editing tool shows its first control with the video still visible", async ({ page }) => {
      await seedFirstRun(page);
      let app = await openPhoneApp(page);
      await seedTake(app);
      await page.reload();
      app = page.mainFrame();
      await openTakeEditor(app);

      const tabs = app.locator('[data-testid^="ct-tab-"]');
      const names = await tabs.evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
      expect(names.length, "editor has tools").toBeGreaterThan(0);

      for (const id of names) {
        await test.step(id, async () => {
          const tab = app.getByTestId(id);
          await tab.scrollIntoViewIfNeeded();
          await tab.click();
          await expect(tab).toHaveAttribute("aria-pressed", "true");

          // The video stays on screen, whole, at a usable size.
          const preview = await box(app.getByTestId("ct-preview"));
          expect.soft(preview.y, `${id}: preview top is on screen`).toBeGreaterThanOrEqual(0);
          expect.soft(preview.bottom, `${id}: preview bottom is on screen`).toBeLessThanOrEqual(vp.height);
          expect.soft(preview.height, `${id}: preview is big enough to judge an edit`).toBeGreaterThanOrEqual(MIN_PREVIEW_HEIGHT);

          // The tool row is big enough to tap.
          expect.soft((await box(tab)).height, `${id}: tool button height`).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);

          // The preview must not squeeze the controls out: there is real room to edit.
          const actionsTop = (await box(app.getByTestId("ct-actions"))).y;
          const panelTop = (await box(app.getByTestId("ct-panel"))).y;
          expect.soft(actionsTop - panelTop, `${id}: space for controls between the tool row and the Save bar`).toBeGreaterThanOrEqual(MIN_PANEL_HEIGHT);
          if (INFO_TABS.includes(id)) return;

          // The first control of the tool is visible without scrolling and not under the bottom bar.
          const controls = app.getByTestId("ct-panel").locator(CONTROL_SELECTOR).filter({ visible: true });
          if ((await controls.count()) === 0) return; // an information-only tab
          const first = controls.first();
          const fb = await box(first);
          expect.soft(fb.bottom, `first control of ${id} sits above the bottom action bar`).toBeLessThanOrEqual(actionsTop);
          expect.soft(fb.y, `first control of ${id} is below the top of the screen`).toBeGreaterThanOrEqual(0);
          expect.soft(await isHittable(first), `first control of ${id} can be tapped (nothing on top of it)`).toBe(true);
        });
      }
    });

    test("every control can be scrolled clear of the bottom action bar", async ({ page }) => {
      await seedFirstRun(page);
      let app = await openPhoneApp(page);
      await seedTake(app);
      await page.reload();
      app = page.mainFrame();
      await openTakeEditor(app);

      const names = await app.locator('[data-testid^="ct-tab-"]').evaluateAll((els) => els.map((e) => e.getAttribute("data-testid")));
      for (const id of names) {
        await test.step(id, async () => {
          await app.getByTestId(id).click();
          const controls = app.getByTestId("ct-panel").locator(CONTROL_SELECTOR).filter({ visible: true });
          const count = await controls.count();
          for (let i = 0; i < count; i++) {
            const c = controls.nth(i);
            await c.evaluate((el) => el.scrollIntoView({ block: "center" }));
            expect.soft(await isHittable(c), `${id} control ${i + 1} of ${count} can be reached and tapped`).toBe(true);
          }
        });
      }
    });

    test("the editor does not scroll sideways", async ({ page }) => {
      await seedFirstRun(page);
      let app = await openPhoneApp(page);
      await seedTake(app);
      await page.reload();
      app = page.mainFrame();
      await openTakeEditor(app);
      const overflow = await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth);
      expect(overflow, "page is no wider than the screen").toBeLessThanOrEqual(0);
      const preview = await box(app.getByTestId("ct-preview"));
      expect(preview.x).toBeGreaterThanOrEqual(0);
      expect(preview.right).toBeLessThanOrEqual(vp.width);
    });
  });
}
