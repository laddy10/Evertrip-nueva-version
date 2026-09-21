import { test, expect, devices, type Page } from "@playwright/test";

function mobileDevice(name: string) {
  const { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch } = devices[name];
  return { viewport, userAgent, deviceScaleFactor, isMobile, hasTouch };
}

declare global {
  interface Window {
    heroSeeks: number[];
    allowHeroPlay: boolean;
  }
}

async function openHero(page: Page) {
  await page.addInitScript(() => {
    window.heroSeeks = [];
    const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "currentTime")!;
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      ...descriptor,
      set(value: number) {
        if (this.src.includes("evertrip-real-drive")) window.heroSeeks.push(value);
        descriptor.set!.call(this, value);
      },
    });
  });
  await page.goto("/en/");
  await expect.poll(() => page.locator(".overture-film video").evaluate(element => {
    const video = element as HTMLVideoElement;
    return video.readyState >= 2 && !video.seeking;
  }), { timeout: 20_000 }).toBe(true);
  await page.evaluate(() => { window.heroSeeks = []; });
}

async function scrollHero(page: Page, progress: number) {
  await page.locator("#journey").evaluate((element, value) => {
    window.scrollTo({
      top: element.getBoundingClientRect().top + scrollY +
        element.getBoundingClientRect().height * value,
      behavior: "instant",
    });
  }, progress);
}

for (const device of ["Desktop Chrome", "Pixel 7", "iPhone 13"]) {
  test.describe(`${device} hero playback`, () => {
    test.use(mobileDevice(device));

    test("plays the story without interaction and holds the completed segment after returning", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await openHero(page);
      const video = page.locator(".overture-film video");
      await expect(video).toHaveJSProperty("paused", false);
      await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.2);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await expect(page.locator("#journey")).toHaveAttribute("data-chapter", "1");
      await expect(page.locator(".overture-title")).toHaveCSS("opacity", "0");
      await expect(page.locator(".overture-travel")).toHaveCSS("opacity", "1");
      expect(await page.evaluate(() => scrollY)).toBe(0);
      expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
      await expect(video).toHaveJSProperty("muted", true);
      await expect(video).toHaveJSProperty("playsInline", true);
      await expect(video).toHaveJSProperty("paused", true, { timeout: 12_000 });
      const end = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
      expect(end).toBeGreaterThanOrEqual(7.95);
      expect(end).toBeLessThanOrEqual(8);
      await expect(page.locator("#journey")).toHaveAttribute("data-chapter", "2");
      await expect(page.locator(".overture-travel")).toHaveCSS("opacity", "1");
      expect((await page.evaluate(() => window.heroSeeks)).length).toBeLessThanOrEqual(1);
      await scrollHero(page, 0.3);
      await expect(video).toHaveJSProperty("currentTime", end);
      await page.locator("#fleet").scrollIntoViewIfNeeded();
      await expect(video).toHaveJSProperty("paused", true);
      await expect(video).toHaveJSProperty("currentTime", end);
      await scrollHero(page, 0.1);
      await expect(page.locator(".overture-stage")).toBeInViewport();
      await page.waitForTimeout(300);
      await expect(video).toHaveJSProperty("paused", true);
      await expect(video).toHaveJSProperty("currentTime", end);
      expect(errors).toEqual([]);
    });
  });
}

for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  test(`${width}px: normal fullscreen flow, immediate scroll and unfinished pause/resume`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openHero(page);
    const video = page.locator(".overture-film video");
    const stage = page.locator(".overture-stage");
    await expect(video).toHaveJSProperty("paused", false);
    await expect(stage).toHaveCSS("position", "relative");
    expect((await stage.boundingBox())!.height).toBe(900);
    expect((await page.locator("#journey").boundingBox())!.height).toBe(900);
    const start = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
    for (const progress of [0.2, 0.5, 0.8, 0.3, 0.55]) {
      await scrollHero(page, progress);
      expect((await stage.boundingBox())!.y).toBeCloseTo(-900 * progress, 0);
      await page.waitForTimeout(100);
    }
    await expect(video).toHaveJSProperty("paused", false);
    expect(await video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(start + 0.2);
    await scrollHero(page, 1.05);
    await expect(stage).not.toBeInViewport();
    await expect(video).toHaveJSProperty("paused", true, { timeout: 1_000 });
    const time = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
    expect(time).toBeLessThan(8);
    const chapter = await page.locator("#journey").getAttribute("data-chapter");
    await page.waitForTimeout(300);
    await expect(video).toHaveJSProperty("currentTime", time);
    await expect(page.locator("#journey")).toHaveAttribute("data-chapter", chapter!);
    await scrollHero(page, 0);
    await expect(video).toHaveJSProperty("paused", false);
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(time + 0.2);
    expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test("mouse wheel and small trackpad-style deltas move the hero immediately", async ({ page }) => {
  await openHero(page);
  const stage = page.locator(".overture-stage");
  const initialTop = (await stage.boundingBox())!.y;
  await page.mouse.move(800, 500);
  await page.mouse.wheel(0, 120);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 1_000 }).toBeGreaterThanOrEqual(100);
  expect((await stage.boundingBox())!.y).toBeLessThanOrEqual(initialTop - 100);
  for (let i = 0; i < 8; i++) await page.mouse.wheel(0, 16);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(220);
  await page.mouse.wheel(0, 2000);
  await expect(stage).not.toBeInViewport();
  await expect(page.locator(".overture-film video")).toHaveJSProperty("paused", true);
  await page.mouse.wheel(0, -3000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".overture-film video")).toHaveJSProperty("paused", false);
  expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
});

test.describe("Mobile playback lifecycle", () => {
  test.use(mobileDevice("Pixel 7"));

  test("pauses offscreen and resumes the unfinished segment at its existing position", async ({ page }) => {
    await openHero(page);
    const video = page.locator(".overture-film video");
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.3);
    await page.locator("#fleet").scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty("paused", true, { timeout: 1_000 });
    const time = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
    expect(time).toBeGreaterThan(0.3);
    expect(time).toBeLessThan(8);
    await page.waitForTimeout(300);
    await expect(video).toHaveJSProperty("currentTime", time);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(video).toHaveJSProperty("paused", false);
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(time + 0.2);
    expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
  });

  test("viewport height changes and landscape keep playback independent of scroll", async ({ page }) => {
    await openHero(page);
    const video = page.locator(".overture-film video");
    await scrollHero(page, 0.3);
    await expect(video).toHaveJSProperty("paused", false);
    for (const viewport of [
      { width: 320, height: 740 }, { width: 375, height: 812 },
      { width: 430, height: 932 }, { width: 430, height: 780 },
      { width: 915, height: 412 },
    ]) {
      await page.setViewportSize(viewport);
      await scrollHero(page, 0.4);
      await expect(video).toHaveJSProperty("paused", false);
      await expect(page.locator(".overture-stage")).toHaveCSS("position", "relative");
      expect((await page.locator("#journey").boundingBox())!.height).toBe((await page.locator(".overture-stage").boundingBox())!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
  });

  test("a touch retries restricted autoplay without unhandled errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => {
      window.allowHeroPlay = false;
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (this.src.includes("evertrip-real-drive") && !window.allowHeroPlay)
          return Promise.reject(new DOMException("Autoplay restricted", "NotAllowedError"));
        return play.call(this);
      };
    });
    await openHero(page);
    const video = page.locator(".overture-film video");
    await expect(video).toHaveJSProperty("paused", true);
    const firstFrame = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
    await page.waitForTimeout(300);
    await expect(video).toHaveJSProperty("currentTime", firstFrame);
    await expect(video).toHaveAttribute("poster", "/assets/journey/evertrip-real-drive-poster.webp");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(0);
    expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
    await scrollHero(page, 1.05);
    await expect(page.locator(".overture-stage")).not.toBeInViewport();
    await expect(video).toHaveJSProperty("currentTime", firstFrame);
    await scrollHero(page, 0);
    await page.evaluate(() => { window.allowHeroPlay = true; });
    await page.touchscreen.tap(300, 500);
    await expect(video).toHaveJSProperty("paused", false);
    await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0.2);
    expect(errors).toEqual([]);
  });

  test("enabling reduced motion stops playback and retains a stable frame", async ({ page }) => {
    await openHero(page);
    await scrollHero(page, 0.2);
    const video = page.locator(".overture-film video");
    await expect(video).toHaveJSProperty("paused", false);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(video).toHaveJSProperty("paused", true, { timeout: 1_000 });
    const time = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: "instant" }));
    await page.touchscreen.tap(300, 500);
    await expect(video).toHaveJSProperty("currentTime", time);
    await expect(page.locator(".overture-title")).toHaveCSS("opacity", "1");
  });

  test("Android-style touch scrolling advances the film without seeking", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "CDP touch input is specific to Chromium.");
    await openHero(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 650 }] });
    for (let y = 620; y >= 230; y -= 30) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y }] });
      await page.waitForTimeout(35);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
    expect((await page.locator(".overture-stage").boundingBox())!.y).toBeLessThan(-200);
    await expect(page.locator(".overture-film video")).toHaveJSProperty("paused", false);
    expect(await page.evaluate(() => window.heroSeeks)).toEqual([]);
  });
});
