// REGRESSION: edits that look applied but are not real, or do not come back.
// Original bugs:
// - Reopening a saved take restored only the pause preset. Speed, trim, restored pauses
//   and colour settings were silently dropped.
// - The pause detector compared each moment to the take's median loudness, so steady
//   audio counted as one long pause and the take was reported as cut to 0:00.
import { test, expect } from "@playwright/test";
import { seedFirstRun, openPhoneApp, seedTake, openTakeEditor } from "./helpers.js";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

async function openEditor(page) {
  await seedFirstRun(page);
  let app = await openPhoneApp(page);
  await seedTake(app);
  await page.reload();
  app = page.mainFrame();
  await openTakeEditor(app);
  return app;
}

test("pause detection finds the real pause and nothing else", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await seedTake(app); // tone 0 to 1.0s, silence to 2.4s, tone to the end
  const r = await app.evaluate(async () => {
    const t = await PDsvc.getTake((await PDsvc.takes())[0].id);
    return ctDetectSilences(t.blob);
  });
  expect(r.silences, "one silent stretch").toHaveLength(1);
  expect(r.silences[0].start).toBeGreaterThan(0.8);
  expect(r.silences[0].start).toBeLessThan(1.3);
  expect(r.silences[0].end).toBeGreaterThan(2.1);
  expect(r.silences[0].end).toBeLessThan(2.7);
});

test("steady sound with no gap is not treated as a pause", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  const silences = await app.evaluate(async () => {
    const ac = new AudioContext(); const osc = ac.createOscillator(); const dest = ac.createMediaStreamDestination();
    osc.connect(dest); osc.start();
    const chunks = []; const mr = new MediaRecorder(dest.stream);
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((res) => { mr.onstop = res; });
    mr.start(200); await new Promise((r) => setTimeout(r, 2500)); mr.stop(); await done;
    const res = await ctDetectSilences(new Blob(chunks, { type: mr.mimeType }));
    // Ignore the recorder's start-up and tail, which can be briefly empty.
    return res.silences.filter((s) => s.end - s.start > 0.4);
  });
  expect(silences, "no pauses in steady audio").toEqual([]);
});

test("the clean length shown is the real kept length, never 0:00 for a take with content", async ({ page }) => {
  const app = await openEditor(page);
  const text = await app.getByText(/pause suggested/).first().innerText();
  const m = text.match(/(\d+):(\d+)\s*→\s*(\d+):(\d+)/);
  expect(m, `status line has both lengths: "${text}"`).not.toBeNull();
  const before = Number(m[1]) * 60 + Number(m[2]), after = Number(m[3]) * 60 + Number(m[4]);
  expect(after, "clean take still has content").toBeGreaterThanOrEqual(1);
  expect(after, "clean take is not longer than the original").toBeLessThanOrEqual(before);
});

test("saved edits all come back when the take is reopened", async ({ page }) => {
  let app = await openEditor(page);

  await app.getByTestId("ct-tab-Clean").click();
  await app.getByTestId("ct-panel").getByText("Tight", { exact: true }).click();
  await app.getByTestId("ct-panel").getByText("Social pace", { exact: true }).click();
  await expect(app.getByText("Playing at 1.25x")).toBeVisible();
  await app.getByTestId("ct-tab-Style").click();
  const brightness = app.getByTestId("ct-panel").locator('input[type="range"]').first();
  await brightness.fill("120");
  await app.getByRole("button", { name: "Save Clean Take" }).click();
  await expect(app.getByText("Clean Take saved")).toBeVisible();

  // Close the browser tab's state completely and come back.
  await page.reload();
  app = page.mainFrame();
  await openTakeEditor(app);

  await app.getByTestId("ct-tab-Clean").click();
  await expect(app.getByText("Playing at 1.25x"), "speed restored").toBeVisible();
  await app.getByTestId("ct-tab-Style").click();
  await expect(app.getByTestId("ct-panel").locator('input[type="range"]').first(), "brightness restored").toHaveValue("120");
  const filter = await app.getByTestId("ct-preview").locator("video").evaluate((v) => getComputedStyle(v).filter);
  expect(filter, "restored brightness is applied to the preview").toContain("brightness(1.2)");
  const saved = await app.evaluate(async () => (await PDsvc.getTake((await PDsvc.takes())[0].id)).clean);
  expect(saved, "stored edit decisions").toMatchObject({ preset: "Tight", speed: "Social pace", style: { b: 120 } });
});

// Gate: the exported file contains the edits. These call the same render function the
// Export buttons use and then inspect the file it produces.
async function exportAndMeasure(app, opts) {
  return app.evaluate(async (opts) => {
    const take = await PDsvc.getTake((await PDsvc.takes())[0].id);
    const det = await ctDetectSilences(take.blob);
    const removed = opts.cutPauses ? ctPauseDecisions(det.silences, "Balanced") : [];
    const out = await ctRenderCleanVideo(take.blob, { removed, rate: 1, filterCss: opts.filterCss || "none", trimStart: opts.trimStart || 0, trimEnd: 0 });
    // Length from the audio track (recorded webm files do not carry a duration header).
    const ac = new AudioContext();
    const audio = await ac.decodeAudioData(await out.arrayBuffer());
    // Average brightness of one frame from the middle of the exported video.
    const v = document.createElement("video"); v.muted = true; v.src = URL.createObjectURL(out);
    await new Promise((r) => { v.onloadeddata = r; });
    await new Promise((r) => { v.onseeked = r; v.currentTime = 0.3; });
    const cv = document.createElement("canvas"); cv.width = 64; cv.height = 36; const cx = cv.getContext("2d");
    cx.drawImage(v, 0, 0, 64, 36); const px = cx.getImageData(0, 0, 64, 36).data;
    let sum = 0; for (let i = 0; i < px.length; i += 4) sum += px[i] + px[i + 1] + px[i + 2];
    return { original: det.duration, exported: audio.duration, size: out.size, luma: sum / (px.length / 4) / 3 };
  }, opts);
}

test("exported video is shorter by the pause that was cut", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await seedTake(app);
  const plain = await exportAndMeasure(app, { cutPauses: false });
  const cut = await exportAndMeasure(app, { cutPauses: true });
  expect(plain.size, "export produced a file").toBeGreaterThan(1000);
  expect(plain.exported, "uncut export keeps the full length").toBeGreaterThan(plain.original - 0.7);
  expect(cut.exported, "cut export is shorter than the uncut one").toBeLessThan(plain.exported - 0.5);
  expect(cut.exported, "cut export still has the spoken parts").toBeGreaterThan(1.2);
});

test("exported video is shorter when the start is trimmed", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await seedTake(app);
  const plain = await exportAndMeasure(app, {});
  const trimmed = await exportAndMeasure(app, { trimStart: 1.5 });
  expect(trimmed.exported, "trimmed export is shorter").toBeLessThan(plain.exported - 0.8);
});

test("exported video carries the brightness adjustment", async ({ page }) => {
  await seedFirstRun(page);
  const app = await openPhoneApp(page);
  await seedTake(app);
  const plain = await exportAndMeasure(app, {});
  const bright = await exportAndMeasure(app, { filterCss: "brightness(160%) contrast(100%) saturate(100%)" });
  expect(bright.luma, "brighter setting gives a brighter file").toBeGreaterThan(plain.luma * 1.15);
});

test("the Export button downloads a full-length edited file, not a stub", async ({ page }) => {
  const app = await openEditor(page);
  await app.getByTestId("ct-tab-Export").click();
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 60_000 }),
    app.getByTestId("ct-panel").getByText("Clean Take video", { exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toContain("clean-take");
  const { readFileSync } = await import("node:fs");
  const b64 = readFileSync(await download.path()).toString("base64");
  const seconds = await app.evaluate(async (b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return (await new AudioContext().decodeAudioData(bytes.buffer)).duration;
  }, b64);
  // The take is about 3.4s with a 1.4s pause. Balanced cleanup leaves roughly 2.3s.
  expect(seconds, "downloaded clean take has the spoken parts").toBeGreaterThan(1.5);
  expect(seconds, "downloaded clean take has the pause cut out").toBeLessThan(3.0);
});
