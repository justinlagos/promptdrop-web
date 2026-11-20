// REGRESSION: font size and scroll speed reset between takes.
// Original bug: RecordSetupScreen rebuilt its settings from hardcoded defaults
// (142 wpm, 40px) every time it mounted, so each new take lost the user's choices.
// A second bug hid behind it: the live prompter capped the font at 40px, so any
// larger size chosen on the slider was silently ignored.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openPhoneApp, openRecordSetup, readSetup, setSlider, recordTake, listTakes } from "./helpers.js";

const FONT = 42;
const SPEED = 185; // wpm, about 1.3x the 142 wpm default

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test("font size and speed survive two takes, navigation and a refresh", async ({ page }) => {
  await seedFirstRun(page);
  let app = await openPhoneApp(page);

  await openRecordSetup(app);
  await setSlider(app, "prompt-font", FONT);
  await setSlider(app, "prompt-speed", SPEED);

  // Take 1 uses the chosen values, and the prompter really renders that size.
  const take1 = await recordTake(app);
  expect(take1, "take 1 settings").toMatchObject({ font: FONT, speed: SPEED });
  expect(take1.renderedFontPx, "live prompter font size on screen").toBe(FONT);

  // Record another: back to the script, launch again. Nothing should have reset.
  await app.getByTestId("nav-back").last().click();
  await app.getByText("Launch Prompt Drop").click();
  await expect(app.getByTestId("record-start")).toBeVisible();
  expect(await readSetup(app), "setup screen before take 2").toEqual({ font: FONT, speed: SPEED });

  const take2 = await recordTake(app);
  expect(take2, "take 2 settings").toMatchObject({ font: FONT, speed: SPEED, renderedFontPx: FONT });

  // Take 2 is a new recording. Take 1 is still there and untouched.
  const takes = await listTakes(app);
  expect(takes, "both takes are kept").toHaveLength(2);
  expect(new Set(takes.map((t) => t.id)).size, "each take has its own id").toBe(2);
  for (const t of takes) expect(t.size, "take has recorded data").toBeGreaterThan(0);

  // Back to the library (fresh navigation), open the script again.
  app = await openPhoneApp(page);
  await openRecordSetup(app);
  expect(await readSetup(app), "after returning to the library").toEqual({ font: FONT, speed: SPEED });

  // Refresh the browser.
  await page.reload();
  await expect(page.getByText("Regression script").first()).toBeVisible();
  await openRecordSetup(page.mainFrame());
  expect(await readSetup(page.mainFrame()), "after a browser refresh").toEqual({ font: FONT, speed: SPEED });
});

test("a first-time user gets the system defaults", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await openRecordSetup(app);
  expect(await readSetup(app)).toEqual({ font: 40, speed: 142 });
});

test("damaged or out-of-range saved settings do not break the prompter", async ({ page }) => {
  await seedFirstRun(page, { "pd.promptPrefs": JSON.stringify({ font: 900, speed: "fast", pos: 7 }) });
  const app = await openPhoneApp(page);
  await openRecordSetup(app);
  const s = await readSetup(app);
  expect(s.font, "font clamped to the slider range").toBe(64);
  expect(s.speed, "unreadable speed falls back to the default").toBe(142);
});

test("every font size on the slider is the size the prompter shows", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await openRecordSetup(app);
  await setSlider(app, "prompt-font", 64);
  await app.getByTestId("record-start").click();
  const live = app.getByTestId("live-session");
  await expect(live).toHaveAttribute("data-phase", "prompting", { timeout: 20_000 });
  const px = await app.getByTestId("live-line-cur").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(px).toBe(64);
});

// Known gap. Settings are saved per device only: there is no account-backed copy yet.
// When that is built, give this test two browser contexts signed in to one test account
// and remove the fixme.
test.fixme("saved font size and speed follow the account to a second device", async () => {});
