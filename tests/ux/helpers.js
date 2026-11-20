// Shared helpers for the UX regression suite.
// The app under test is the /m app. On phones it fills the screen; on desktop it is
// loaded through /app. Helpers take a Frame so the same steps work in both.
import { expect } from "@playwright/test";

export const SCRIPT_TITLE = "Regression script";
const SCRIPT_BODY = Array.from({ length: 12 }, (_, i) => `Line ${i + 1} of the regression script, long enough to read aloud.`).join("\n\n");

// Runs before the app boots on first load only: skips onboarding and adds one script.
// Guarded by a flag so reloads keep whatever state the test has built up.
export async function seedFirstRun(page, extra = {}) {
  await page.addInitScript(({ title, body, extra }) => {
    try {
      if (localStorage.getItem("pd.test.seeded")) return;
      localStorage.setItem("pd.test.seeded", "1");
      localStorage.setItem("pd.onboarded", "1");
      localStorage.setItem("pd.localScripts", JSON.stringify([{ id: "local-regression", title, body, updated_at: new Date().toISOString() }]));
      for (const k of Object.keys(extra)) localStorage.setItem(k, extra[k]);
    } catch (e) {}
  }, { title: SCRIPT_TITLE, body: SCRIPT_BODY, extra });
}

export async function openPhoneApp(page) {
  await page.goto("/m/index.html");
  await expect(page.getByText(SCRIPT_TITLE).first()).toBeVisible();
  return page.mainFrame();
}

// Desktop users reach the app through /app, which hosts the /m app in a frame.
export async function openDesktopApp(page) {
  await page.goto("/app");
  await expect(page.locator("iframe")).toBeVisible();
  const frame = await waitForAppFrame(page);
  await expect(frame.getByText(SCRIPT_TITLE).first()).toBeVisible();
  return frame;
}

async function waitForAppFrame(page) {
  await expect.poll(() => page.frames().some((f) => /\/m\/index\.html/.test(f.url()))).toBe(true);
  return page.frames().find((f) => /\/m\/index\.html/.test(f.url()));
}

export async function openRecordSetup(frame) {
  await frame.getByText(SCRIPT_TITLE).first().click();
  await frame.getByText("Launch Prompt Drop").click();
  await expect(frame.getByTestId("record-start")).toBeVisible();
}

export async function readSetup(frame) {
  const el = frame.getByTestId("record-setup");
  return { speed: Number(await el.getAttribute("data-speed")), font: Number(await el.getAttribute("data-font")) };
}

export async function setSlider(frame, testid, value) {
  const input = frame.getByTestId(testid).locator('input[type="range"]');
  await input.fill(String(value));
  await expect(input).toHaveValue(String(value));
}

// Records one take through the real flow: countdown, prompting, stop, save.
// Returns what the live prompter actually used.
export async function recordTake(frame) {
  await frame.getByTestId("record-start").click();
  const live = frame.getByTestId("live-session");
  await expect(live).toHaveAttribute("data-phase", "prompting", { timeout: 20_000 });
  const used = {
    speed: Number(await live.getAttribute("data-speed")),
    font: Number(await live.getAttribute("data-font")),
    renderedFontPx: await frame.getByTestId("live-line-cur").first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  };
  await frame.waitForTimeout(1200); // let the recorder collect some frames
  await frame.getByTestId("live-stop").click();
  await expect(frame.getByTestId("ct-tabs")).toBeVisible({ timeout: 45_000 });
  return used;
}

export async function listTakes(frame) {
  return frame.evaluate(async () => (await PDsvc.takes()).map((t) => ({ id: t.id, size: t.size, title: t.title, createdAt: t.createdAt })));
}

// Adds a short real video take straight into storage, so editor tests do not depend on
// the recording flow. Canvas video with a tone, a silent gap in the middle, then the tone
// again, so pause detection has exactly one real pause to find. About 3.4 seconds.
export async function seedTake(frame, title = "Seeded take") {
  await frame.evaluate(async (title) => {
    const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 360;
    const ctx = canvas.getContext("2d");
    let n = 0; const paint = () => { ctx.fillStyle = `hsl(${(n * 7) % 360} 60% 40%)`; ctx.fillRect(0, 0, 640, 360); ctx.fillStyle = "#fff"; ctx.font = "48px sans-serif"; ctx.fillText("take " + n++, 40, 190); };
    paint(); const timer = setInterval(paint, 50);
    const stream = canvas.captureStream(20);
    const ac = new AudioContext(); const osc = ac.createOscillator(); const gain = ac.createGain();
    const dest = ac.createMediaStreamDestination(); osc.connect(gain); gain.connect(dest); osc.start();
    const t0 = ac.currentTime;
    gain.gain.setValueAtTime(0.6, t0); gain.gain.setValueAtTime(0, t0 + 1.0); gain.gain.setValueAtTime(0.6, t0 + 2.4);
    dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
    const chunks = []; const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((res) => { mr.onstop = res; });
    mr.start(200); await new Promise((r) => setTimeout(r, 3400)); mr.stop(); await done; clearInterval(timer); try { ac.close(); } catch (e) {}
    const blob = new Blob(chunks, { type: mr.mimeType || "video/webm" });
    await PDsvc.putTake({ id: "seed-" + Date.now(), createdAt: Date.now(), durationMs: 3400, size: blob.size, type: blob.type, source: "camera", title, blob });
  }, title);
}

export async function openTakeEditor(frame, title = "Seeded take") {
  await frame.getByRole("button", { name: "Takes", exact: true }).click();
  await frame.getByText(title).first().click();
  await expect(frame.getByTestId("ct-tabs")).toBeVisible({ timeout: 45_000 });
}

export async function box(locator) {
  const b = await locator.boundingBox();
  if (!b) throw new Error("Element has no layout box (not rendered): " + locator);
  return { ...b, right: b.x + b.width, bottom: b.y + b.height };
}

// True when the point at the element's centre really belongs to that element, meaning
// nothing (a sticky bar, a sheet, browser-height overflow) is sitting on top of it.
export async function isHittable(locator) {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const top = document.elementFromPoint(x, y);
    return !!top && (top === el || el.contains(top) || top.contains(el) && top.closest("label, button") === el.closest("label, button"));
  });
}

export const CONTROL_SELECTOR = 'button, input, select, textarea, [role="slider"], [role="switch"], [role="tab"]';
