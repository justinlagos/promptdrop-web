// REGRESSION: missing desktop editing interface.
// Original bug: desktop users landed on a review screen with take details and no
// editing tools, and later on the phone editor squeezed into a 460px frame.
// These tests open a take the way a desktop user does, through /app.
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

    test("editor uses a desktop layout: large preview, tools beside it, edit map below", async ({ page }) => {
      const app = await openEditor(page);
      const preview = await box(app.getByTestId("ct-preview"));
      const side = await box(app.getByTestId("ct-side"));
      const panel = await box(app.getByTestId("ct-panel"));
      const timeline = await box(app.getByTestId("ct-timeline"));

      expect(preview.width, "preview uses the desktop width").toBeGreaterThanOrEqual(Math.min(640, vp.width * 0.5));
      expect(preview.height, "preview is tall enough to judge an edit").toBeGreaterThanOrEqual(220);
      expect(side.x, "tools panel sits to the right of the preview").toBeGreaterThanOrEqual(preview.right - 1);
      expect(panel.x, "tool controls are inside the side panel").toBeGreaterThanOrEqual(side.x - 1);
      expect(timeline.y, "edit map sits below the preview").toBeGreaterThanOrEqual(preview.bottom - 1);

      // Everything fits the window: nothing important is off screen.
      for (const [name, b] of [["preview", preview], ["tools panel", side], ["edit map", timeline]]) {
        expect(b.x, `${name} left edge on screen`).toBeGreaterThanOrEqual(0);
        expect(b.right, `${name} right edge on screen`).toBeLessThanOrEqual(vp.width);
        expect(b.bottom, `${name} bottom edge on screen`).toBeLessThanOrEqual(vp.height);
      }

      // All five tools are visible at once. No sideways scrolling in the tool row.
      const tabsRow = app.getByTestId("ct-tabs");
      expect(await tabsRow.evaluate((el) => el.scrollWidth - el.clientWidth), "tool row does not scroll sideways").toBeLessThanOrEqual(1);
      for (const t of await app.locator('[data-testid^="ct-tab-"]').all()) expect(await isHittable(t), "tool tab can be clicked").toBe(true);

      // Export, Undo and Redo are in the header.
      await expect(app.getByTestId("ct-export")).toBeVisible();
      await expect(app.getByTestId("ct-undo")).toBeVisible();
      await expect(app.getByTestId("ct-redo")).toBeVisible();
    });
  });
}

test.describe("desktop editing", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("edit map shows the detected pause, and clicking it keeps or removes it", async ({ page }) => {
    const app = await openEditor(page);
    const pause = app.getByTestId("ct-timeline-pause");
    await expect(pause, "the one real pause in the test take").toHaveCount(1);
    await expect(pause).toHaveAttribute("data-kept", "0");
    await expect(app.getByTestId("ct-main")).toContainText("1 pause suggested");

    await pause.click();
    await expect(pause, "pause is now kept").toHaveAttribute("data-kept", "1");
    await expect(app.getByTestId("ct-main")).not.toContainText("1 pause suggested");
    await pause.click();
    await expect(pause, "pause is removed again").toHaveAttribute("data-kept", "0");
  });

  test("clicking the edit map moves the playhead", async ({ page }) => {
    const app = await openEditor(page);
    const video = app.getByTestId("ct-preview").locator("video");
    await expect.poll(() => video.evaluate((v) => v.readyState)).toBeGreaterThanOrEqual(1);
    const bar = app.getByTestId("ct-timeline-bar");
    const b = await box(bar);
    await bar.click({ position: { x: b.width * 0.1, y: b.height / 2 } });
    await expect.poll(() => video.evaluate((v) => v.currentTime), { message: "playhead moved" }).toBeGreaterThan(0.1);
  });

  test("edits save themselves; Export opens the export tools", async ({ page }) => {
    const app = await openEditor(page);
    const status = app.getByTestId("ct-save-status");
    await expect(status).toContainText("No edits yet");
    await app.getByTestId("ct-tab-Clean").click();
    await app.getByTestId("ct-panel").getByText("Social pace", { exact: true }).click();
    await expect(status, "the change is saved without pressing anything").toHaveAttribute("data-state", "saved");
    await expect(status).toContainText("Saved");
    await expect(status).toHaveAttribute("data-dirty", "0");
    await expect(app.getByTestId("ct-save"), "there is no manual Save step any more").toHaveCount(0);

    await app.getByTestId("ct-export").click();
    await expect(app.getByTestId("ct-tab-Export")).toHaveAttribute("aria-pressed", "true");
    await expect(app.getByTestId("ct-panel").getByText("Clean Take video")).toBeVisible();
  });

  test("undo and redo step through edits, by button and by keyboard", async ({ page }) => {
    const app = await openEditor(page);
    const undo = app.getByTestId("ct-undo"), redo = app.getByTestId("ct-redo");
    await expect(undo, "nothing to undo yet").toBeDisabled();
    await app.getByTestId("ct-tab-Clean").click();
    const speedLine = app.getByTestId("ct-panel").getByText(/Playing at/);
    await expect(speedLine).toContainText("1.00x");

    await app.getByTestId("ct-panel").getByText("Slightly faster", { exact: true }).click();
    await expect(app.getByTestId("ct-save-status")).toHaveAttribute("data-state", "saved");
    await app.getByTestId("ct-panel").getByText("Social pace", { exact: true }).click();
    await expect(app.getByTestId("ct-save-status")).toHaveAttribute("data-dirty", "0");
    await expect(speedLine).toContainText("1.25x");

    await undo.click();
    await expect(speedLine, "first undo goes back one step").not.toContainText("1.25x");
    await expect(speedLine).not.toContainText("1.00x");
    await undo.click();
    await expect(speedLine, "second undo is back at the start").toContainText("1.00x");
    await expect(undo).toBeDisabled();
    await redo.click();
    await redo.click();
    await expect(speedLine, "redo brings both edits back").toContainText("1.25x");
    await expect(redo).toBeDisabled();

    // Keyboard, with focus off the buttons.
    await app.getByTestId("ct-main").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Control+z");
    await expect(speedLine, "Ctrl+Z undoes").not.toContainText("1.25x");
    await page.keyboard.press("Control+Shift+z");
    await expect(speedLine, "Ctrl+Shift+Z redoes").toContainText("1.25x");

    // What is on screen after undo and redo is what is stored.
    await expect(app.getByTestId("ct-save-status")).toHaveAttribute("data-dirty", "0");
    const stored = await app.evaluate(async () => PDsvc.getEdits((await PDsvc.takes())[0].id));
    expect(stored.decisions.speed).toBe("Social pace");
  });

  test("Space plays and pauses the preview", async ({ page }) => {
    const app = await openEditor(page);
    const video = app.getByTestId("ct-preview").locator("video");
    await expect.poll(() => video.evaluate((v) => v.readyState)).toBeGreaterThanOrEqual(2);
    await app.getByTestId("ct-main").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect.poll(() => video.evaluate((v) => v.paused), { message: "Space starts playback" }).toBe(false);
    await page.keyboard.press("Space");
    await expect.poll(() => video.evaluate((v) => v.paused), { message: "Space pauses playback" }).toBe(true);
  });
});

test.describe("desktop shell", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("library stays a readable column and the editor takes the full window", async ({ page }) => {
    await seedFirstRun(page);
    let app = await openDesktopApp(page);
    const title = await box(app.getByText("Regression script").first());
    expect(title.x, "library is centred, not stretched across the window").toBeGreaterThan(300);
    await seedTake(app);
    await page.reload();
    app = await openDesktopApp(page);
    await openTakeEditor(app);
    const editor = await box(app.getByTestId("ct-desktop"));
    expect(editor.width, "editor fills the window").toBeGreaterThanOrEqual(1270);
  });
});
