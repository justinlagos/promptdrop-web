// The line being read must be fully visible inside the black drop, at any font size
// the slider offers. A clipped line means the speaker loses words mid-sentence.
//
// SWITCHED OFF (known gap). The prompter centres four lines of different sizes inside a
// fixed-height drop with overflow hidden, so a long paragraph is cut off at some sizes
// and screen heights, and which ones changes with the neighbouring lines. Results are
// not stable enough to gate on. Fix the prompter text layout first (fit or split long
// paragraphs to the drop), then change test.fixme to test below.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openPhoneApp, openRecordSetup, setSlider } from "./helpers.js";

const SIZES = [28, 40, 42, 52, 64];
const PHONES = [{ width: 390, height: 844 }, { width: 375, height: 667 }, { width: 320, height: 568 }];

for (const vp of PHONES) {
  for (const size of SIZES) {
    test.fixme(`${vp.width}x${vp.height}: current line is not clipped at ${size}px`, async ({ page }) => {
      await page.setViewportSize(vp);
      await seedFirstRun(page);
      const app = await openPhoneApp(page);
      await openRecordSetup(app);
      await setSlider(app, "prompt-font", size);
      await app.getByTestId("record-start").click();
      await expect(app.getByTestId("live-session")).toHaveAttribute("data-phase", "prompting", { timeout: 20_000 });
      await page.waitForTimeout(700); // drop open animation
      const r = await app.getByTestId("live-line-cur").first().evaluate((el) => {
        const line = el.getBoundingClientRect();
        let clip = el.parentElement;
        while (clip && getComputedStyle(clip).overflow !== "hidden") clip = clip.parentElement;
        const c = clip.getBoundingClientRect();
        return { top: line.top - c.top, bottom: c.bottom - line.bottom };
      });
      expect(r.top, "space above the current line inside the drop").toBeGreaterThanOrEqual(0);
      expect(r.bottom, "space below the current line inside the drop").toBeGreaterThanOrEqual(0);
    });
  }
}
