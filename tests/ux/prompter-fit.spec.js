// REGRESSION: script lines cut off inside the prompter.
// Original bug: the prompter centred four lines of different sizes in a fixed-height drop
// with overflow hidden. A long paragraph, or any paragraph at a large font, lost its top
// and bottom rows, so the speaker lost words mid-sentence.
// Now long lines are split into chunks that fit. These tests step through a whole script
// at each font size and screen size and check every chunk is fully visible.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openPhoneApp, openRecordSetup } from "./helpers.js";

const LONG = "This is one deliberately long paragraph with no blank lines in it, the kind people paste straight from a document, and it keeps going well past what fits in the drop at a large size, so the prompter has to split it sensibly; it must not cut words off, and it must not lose any of them either.";
const BODY = ["Short opening line.", LONG, "A line with a Pneumonoultramicroscopicsilicovolcanoconiosis in it.", "Done."].join("\n\n");
const SIZES = [28, 40, 42, 52, 64];
const PHONES = [{ width: 390, height: 844 }, { width: 390, height: 664 }, { width: 375, height: 667 }, { width: 320, height: 568 }];

for (const vp of PHONES) {
  for (const size of SIZES) {
    test(`${vp.width}x${vp.height} at ${size}px: every chunk of the script is fully visible`, async ({ page }) => {
      await page.setViewportSize(vp);
      // Tap-to-advance mode so the test controls the pace.
      await seedFirstRun(page, { "pd.promptPrefs": JSON.stringify({ font: size, speed: 142, follow: true, autoRec: false }) }, BODY);
      const app = await openPhoneApp(page);
      await openRecordSetup(app);
      await app.getByTestId("record-start").click();
      const live = app.getByTestId("live-session");
      await expect(live).toHaveAttribute("data-phase", "prompting", { timeout: 20_000 });
      await page.waitForTimeout(650); // drop open animation

      const total = Number(await live.getAttribute("data-chunks"));
      expect(total, "script was turned into chunks").toBeGreaterThanOrEqual(4);
      const seen = [];
      for (let i = 0; i < total; i++) {
        await expect(live).toHaveAttribute("data-chunk", String(i));
        const r = await app.getByTestId("live-line-cur").evaluate((el) => {
          const line = el.getBoundingClientRect();
          const drop = document.querySelector('[data-testid="live-drop"]').getBoundingClientRect();
          return { text: el.textContent, top: line.top - (drop.top + 74), bottom: drop.bottom - line.bottom, left: line.left - drop.left, right: drop.right - line.right, fontPx: parseFloat(getComputedStyle(el).fontSize), overflowX: el.scrollWidth - el.clientWidth };
        });
        expect(r.fontPx, "chunk is shown at the chosen size").toBe(size);
        expect.soft(r.top, `chunk ${i + 1}/${total} is not cut off at the top: "${r.text}"`).toBeGreaterThanOrEqual(0);
        expect.soft(r.bottom, `chunk ${i + 1}/${total} is not cut off at the bottom: "${r.text}"`).toBeGreaterThanOrEqual(0);
        expect.soft(r.left, `chunk ${i + 1}/${total} is inside the drop on the left`).toBeGreaterThanOrEqual(0);
        expect.soft(r.right, `chunk ${i + 1}/${total} is inside the drop on the right`).toBeGreaterThanOrEqual(0);
        expect.soft(r.overflowX, `chunk ${i + 1}/${total} does not overflow sideways`).toBeLessThanOrEqual(1);
        seen.push(r.text);
        if (i < total - 1) await app.getByTestId("live-drop").click({ position: { x: 40, y: 30 } });
      }
      // Nothing was dropped or reordered: the chunks join back into the script.
      // (A word too long for the drop may be shown in pieces, so compare without spaces.)
      const squash = (t) => t.replace(/\s+/g, "");
      expect(squash(seen.join("")), "all words shown, in order").toBe(squash(BODY));
    });
  }
}

test("a short script is not split at the default size", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seedFirstRun(page, {}, "One.\n\nTwo short lines.\n\nThree.");
  const app = await openPhoneApp(page);
  await openRecordSetup(app);
  await app.getByTestId("record-start").click();
  const live = app.getByTestId("live-session");
  await expect(live).toHaveAttribute("data-phase", "prompting", { timeout: 20_000 });
  expect(Number(await live.getAttribute("data-chunks")), "three lines stay three lines").toBe(3);
});
