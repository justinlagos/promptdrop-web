// Marketing landing page: smooth scrolling (Lenis), the animated logo, the live hero
// demo and scroll reveals. These guard the behaviours and, just as much, the failure
// modes of motion work: content left invisible, links that stop working, pages that
// scroll sideways, and motion that ignores the reduced-motion setting.
import { test, expect } from "@playwright/test";

const logoVar = (page, name) => page.getByTestId("logo").evaluate((el, n) => Number(el.style.getPropertyValue(n)), name);
const scrollY = (page) => page.evaluate(() => Math.round(window.scrollY));

test.describe("desktop", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("Lenis smooth scrolling is running and eases wheel scrolling", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-smooth", "lenis");
    await expect(page.locator("html")).toHaveClass(/lenis/);
    // Sample the scroll position every frame while one wheel movement plays out.
    await page.evaluate(() => { window.__ys = []; const tick = () => { window.__ys.push(Math.round(window.scrollY)); window.__raf = requestAnimationFrame(tick); }; tick(); });
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 1200);
    await expect.poll(() => scrollY(page), { message: "scroll settles at the full distance" }).toBeGreaterThan(1150);
    const ys = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__ys; });
    const distinct = [...new Set(ys)];
    const biggestStep = Math.max(...ys.slice(1).map((y, i) => y - ys[i]));
    expect(distinct.length, "the page passes through many positions on the way").toBeGreaterThan(8);
    expect(biggestStep, "no single frame covers most of the distance (that would be a jump)").toBeLessThan(700);
  });

  test("nav links glide to their section and keep the address and focus in step", async ({ page }) => {
    await page.goto("/");
    await page.locator(".nav__links").getByText("How it works").click();
    await expect.poll(async () => Math.round((await page.locator("#how").boundingBox()).y), { message: "section sits just under the nav" }).toBeLessThan(140);
    expect(Math.round((await page.locator("#how").boundingBox()).y)).toBeGreaterThan(20);
    expect(new URL(page.url()).hash).toBe("#how");
    expect(await page.evaluate(() => document.activeElement && document.activeElement.id)).toBe("how");
    await page.locator(".nav__links").getByText("Meetings").click();
    await expect.poll(async () => Math.round((await page.locator("#meetings").boundingBox()).y)).toBeLessThan(140);
  });

  test("opening the page at a section address lands on that section", async ({ page }) => {
    await page.goto("/#meetings");
    await expect.poll(async () => Math.round((await page.locator("#meetings").boundingBox()).y)).toBeLessThan(160);
  });

  test("logo script line shows how far down the page you are", async ({ page }) => {
    await page.goto("/");
    expect(await logoVar(page, "--p"), "short line at the top").toBe(24);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => logoVar(page, "--p"), { message: "full line at the bottom" }).toBeGreaterThanOrEqual(99);
  });

  test("logo click: a speaking tip at the top, back to top when scrolled", async ({ page }) => {
    await page.goto("/");
    const link = page.getByTestId("logo-link"), tip = page.getByTestId("logo-tip");
    await expect(link).toHaveAccessibleName(/speaking tip/i);
    await link.click();
    await expect(tip).toBeVisible();
    const first = await tip.innerText();
    expect(first.length, "tip has real text").toBeGreaterThan(10);
    await expect(tip).toHaveAttribute("role", "status");
    await link.click();
    await expect(tip).not.toHaveText(first);

    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 2000);
    await expect.poll(() => scrollY(page)).toBeGreaterThan(1500);
    await expect(link).toHaveAccessibleName("Back to top");
    await link.click();
    await expect.poll(() => scrollY(page), { message: "logo takes you back to the top" }).toBe(0);
    expect(new URL(page.url()).pathname).toBe("/");
  });

  test("logo eyes follow the pointer, then return to the lens", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByTestId("logo");
    await expect(logo).toHaveAttribute("data-motion", "on");
    await page.mouse.move(1150, 720, { steps: 4 });
    await expect.poll(() => logoVar(page, "--ex"), { message: "eyes look right" }).toBeGreaterThan(4);
    expect(await logoVar(page, "--ey"), "eyes look down").toBeGreaterThan(3);
    await expect(logo).toHaveAttribute("data-gaze", "away");
    await page.mouse.move(20, 760, { steps: 4 });
    await expect.poll(() => logoVar(page, "--ex"), { message: "eyes look left" }).toBeLessThan(-1);
    // Pointer goes still: the eyes go back to the lens.
    await expect(logo).toHaveAttribute("data-gaze", "lens", { timeout: 8000 });
    expect(Math.abs(await logoVar(page, "--ex"))).toBeLessThan(0.5);
  });

  test("logo smiles at the main button while you hover it", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByTestId("logo");
    await page.locator(".hero .btn--primary").hover();
    await expect(logo).toHaveAttribute("data-mood", "smile");
    await expect(page.locator(".logo--live .logo__smile")).toHaveCSS("opacity", "1");
    await page.mouse.move(640, 700);
    await expect(logo).not.toHaveAttribute("data-mood", "smile");
  });

  test("logo dozes off when left alone and wakes on movement", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    const logo = page.getByTestId("logo");
    await expect(logo).toHaveAttribute("data-state", "awake");
    await page.clock.fastForward(26_000);
    await expect(logo).toHaveAttribute("data-state", "asleep");
    await page.mouse.move(600, 400);
    await expect(logo).not.toHaveAttribute("data-state", "asleep");
    await page.clock.fastForward(1000);
    await expect(logo).toHaveAttribute("data-state", "awake");
  });

  test("on other pages the logo is a normal link home", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByTestId("logo-link")).toHaveAccessibleName("PromptDrop home");
    await page.getByTestId("logo-link").click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator(".hero h1")).toBeVisible();
    expect(await scrollY(page), "new page starts at the top").toBe(0);
  });

  test("hero demo reads on its own and its controls work", async ({ page }) => {
    await page.goto("/");
    const demo = page.getByTestId("hero-demo"), line = page.getByTestId("hero-demo-line");
    await expect(demo).toHaveAttribute("data-playing", "1");
    const first = await line.innerText();
    await expect(line, "the demo moves to the next line by itself").not.toHaveText(first, { timeout: 8000 });

    await page.getByTestId("hero-demo-toggle").click();
    await expect(demo).toHaveAttribute("data-playing", "0");
    const held = await line.innerText();
    await page.waitForTimeout(3500);
    expect(await line.innerText(), "paused means paused").toBe(held);

    await expect(page.getByTestId("hero-demo-speed")).toHaveText("142 wpm");
    await page.getByTestId("hero-demo-faster").click();
    await expect(page.getByTestId("hero-demo-speed")).toHaveText("175 wpm");
    await page.getByTestId("hero-demo-slower").click();
    await page.getByTestId("hero-demo-slower").click();
    await expect(page.getByTestId("hero-demo-speed")).toHaveText("110 wpm");
    await expect(page.getByTestId("hero-demo-slower")).toBeDisabled();

    const px = () => line.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await page.getByTestId("hero-demo-larger").click();
    await expect.poll(px, { message: "larger text" }).toBe(32);
    await page.getByTestId("hero-demo-smaller").click();
    await page.getByTestId("hero-demo-smaller").click();
    await expect.poll(px, { message: "smaller text" }).toBe(20);
  });

  test("no content is left invisible after scrolling the whole page", async ({ page }) => {
    await page.goto("/");
    const total = await page.locator("[data-reveal]").count();
    expect(total, "page has reveal sections").toBeGreaterThan(8);
    // Something below the fold starts hidden, so the reveal is real.
    expect(await page.locator("[data-reveal]:not(.is-in)").count()).toBeGreaterThan(0);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 500) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
    await expect(page.locator("[data-reveal]:not(.is-in)"), "every section has been revealed").toHaveCount(0);
    await page.waitForTimeout(900);
    const dim = await page.locator("[data-reveal]").evaluateAll((els) => els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length);
    expect(dim, "every section is fully visible").toBe(0);
  });

  test("keyboard: logo, nav and demo controls are reachable and show focus", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("logo-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("logo-tip")).toBeVisible();
    await page.getByTestId("hero-demo-toggle").focus();
    await page.keyboard.press("Space");
    await expect(page.getByTestId("hero-demo")).toHaveAttribute("data-playing", "0");
    const outline = await page.getByTestId("hero-demo-toggle").evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline, "focused control shows a focus ring").not.toBe("none");
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });

  test("motion is switched off but nothing is hidden or broken", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("logo")).toHaveAttribute("data-motion", "off");
    await expect(page.locator("html")).not.toHaveClass(/js-reveal/);
    const dim = await page.locator("[data-reveal]").evaluateAll((els) => els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length);
    expect(dim, "all content visible without scrolling").toBe(0);
    await expect(page.getByTestId("hero-demo"), "demo waits for the visitor").toHaveAttribute("data-playing", "0");

    // Eyes stay put.
    await page.mouse.move(1150, 720, { steps: 3 });
    await page.waitForTimeout(400);
    expect(await logoVar(page, "--ex") || 0).toBe(0);

    // Links and the progress line still work; scrolling is immediate.
    await page.locator(".nav__links").getByText("How it works").click();
    await expect.poll(async () => Math.round((await page.locator("#how").boundingBox()).y)).toBeLessThan(140);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => logoVar(page, "--p")).toBeGreaterThanOrEqual(99);
    // The demo still works by hand.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByTestId("hero-demo-toggle").click();
    await expect(page.getByTestId("hero-demo")).toHaveAttribute("data-playing", "1");
  });
});

for (const vp of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
  test.describe(`${vp.width}x${vp.height}`, () => {
    test.use({ viewport: vp, isMobile: vp.width < 700, hasTouch: true });

    test("landing page fits the screen and the demo controls are big enough to tap", async ({ page }) => {
      await page.goto("/");
      await expect(page.getByTestId("logo-link")).toBeVisible();
      // Nav: the main button is fully on screen and the wordmark stays on one line.
      const cta = await page.locator(".nav .btn--primary").boundingBox();
      expect(cta.x, "nav button left edge on screen").toBeGreaterThanOrEqual(0);
      expect(Math.round(cta.x + cta.width), "nav button right edge on screen").toBeLessThanOrEqual(vp.width);
      const brand = await page.getByTestId("logo-link").boundingBox();
      expect(brand.x + brand.width, "logo does not run into the nav button").toBeLessThanOrEqual(cta.x);
      expect(Math.round((await page.locator(".nav .brand__txt").boundingBox()).height), "wordmark is on one line").toBeLessThan(30);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y <= height; y += 600) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(over, `no sideways scroll at ${y}px down`).toBeLessThanOrEqual(0);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      for (const id of ["hero-demo-toggle", "hero-demo-slower", "hero-demo-faster", "hero-demo-smaller", "hero-demo-larger"]) {
        const b = await page.getByTestId(id).boundingBox();
        expect(Math.round(b.height), `${id} height`).toBeGreaterThanOrEqual(40);
        expect(Math.round(b.width), `${id} width`).toBeGreaterThanOrEqual(40);
        expect(b.x, `${id} on screen`).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width, `${id} on screen`).toBeLessThanOrEqual(vp.width);
      }
      // The largest demo text still fits inside the drop.
      await page.getByTestId("hero-demo-toggle").tap(); // pause, so the line holds still to be measured
      await expect(page.getByTestId("hero-demo")).toHaveAttribute("data-playing", "0");
      await page.getByTestId("hero-demo-larger").tap();
      const fits = await page.getByTestId("hero-demo-line").evaluate((el) => { const d = el.closest(".drop").getBoundingClientRect(), r = el.getBoundingClientRect(); return r.left >= d.left && r.right <= d.right && el.scrollWidth <= el.clientWidth + 1; });
      expect(fits, "largest demo text stays inside the drop").toBe(true);
    });
  });
}
