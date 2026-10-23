import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { widths, ready, noOverflow } from "./release.helpers";

const requireFromProject = createRequire(process.cwd() + "/package.json");
const axeSource = readFileSync(requireFromProject.resolve("axe-core/axe.min.js"), "utf8");

test("Tours deep links settle on the requested experience after a homepage anchor", async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 768, height: 900 });
  for (let attempt = 0; attempt < 6; attempt++) {
    await ready(page, "/es/");
    await page.locator("#faq summary").first().scrollIntoViewIfNeeded();
    await page.locator('[aria-controls="mobile-navigation"]').click();
    await page.locator('#mobile-navigation a[href$="#tours"]').click();
    await page.locator("#tours a[href*='/tours/#']").last().click();
    await expect(page.locator("#pasadia-cabo-de-la-vela h2")).toBeInViewport();
  }
});

test("background video can be paused independently of scrolling and respects reduced motion", async ({ page }, info) => {
  test.setTimeout(90_000);
  for (const locale of ["es", "en"]) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
      await ready(page, `/${locale}/`);
      const video = page.locator(".overture-film video");
      await expect(video).toHaveJSProperty("paused", false);
      const control = page.locator(".overture-video-toggle");
      await expect(control).toBeInViewport();
      await control.focus(); await page.keyboard.press("Enter");
      await expect(video).toHaveJSProperty("paused", true);
      const time = await video.evaluate(element => (element as HTMLVideoElement).currentTime);
      await page.locator("#routes").scrollIntoViewIfNeeded();
      await page.locator(".overture-title").scrollIntoViewIfNeeded();
      await expect(video).toHaveJSProperty("currentTime", time);
      await control.click();
      await expect(video).toHaveJSProperty("paused", false);
      await page.screenshot({ path: info.outputPath(`${locale}-hero-${width}.png`) });
      await noOverflow(page);
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".overture-film video")).toHaveJSProperty("paused", true);
  await expect(page.locator(".overture-video-toggle")).toHaveCount(0);
});

for (const locale of ["es", "en"]) {
  test(`${locale}: fleet, reviews, FAQs, menu, anchors and keyboard at all widths`, async ({ page }, info) => {
    test.setTimeout(180_000);
    const es = locale === "es";
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await ready(page, `/${locale}/`);
      const fleet = page.locator("#fleet");
      for (const button of await fleet.locator(".fleet-selector button").all()) {
        await button.click();
        await expect(button).toHaveAttribute("aria-pressed", "true");
        const name = await button.locator("span").innerText();
        const link = await fleet.locator(".fleet-specification a").getAttribute("href");
        expect(new URL(link!).searchParams.get("text")).toContain(name === "Executive Bus" ? "Bus Ejecutivo" : name);
        for (const photo of [2, 3, 1]) {
          await fleet.getByRole("button", { name: es ? "Imagen siguiente" : "Next image", exact: true }).click();
          await expect(fleet.locator(".fleet-photo img")).toHaveAttribute("alt", new RegExp(` ${photo}$`));
          await expect.poll(() => fleet.locator(".fleet-photo img").evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        }
      }
      const quote = page.locator(".traveler-quote blockquote");
      const first = await quote.innerText();
      const next = page.getByRole("button", { name: es ? "Testimonio siguiente" : "Next testimonial" });
      await next.click();
      await expect(quote).not.toHaveText(first);
      await next.click(); await next.click();
      await expect(quote).toHaveText(first);
      const summary = page.locator("#faq summary").nth(1);
      await summary.focus(); await page.keyboard.press("Enter");
      await expect(summary.locator("..")).toHaveAttribute("open", "");
      await page.keyboard.press("Enter");
      await expect(summary.locator("..")).not.toHaveAttribute("open", "");
      await noOverflow(page);
      if (width < 1024) await page.locator('[aria-controls="mobile-navigation"]').click();
      const nav = width < 1024 ? page.locator("#mobile-navigation") : page.locator(".site-nav > nav").first();
      await nav.locator('a[href$="#tours"]').click();
      await expect(page).toHaveURL(/#tours$/);
      const cards = page.locator("#tours a[href*='/tours/#']");
      const target = (await cards.last().getAttribute("href"))!;
      await cards.last().click();
      await expect(page).toHaveURL(new RegExp(target.replace(/\//g, "\\/")));
      const anchor = page.locator("#pasadia-cabo-de-la-vela");
      await expect(anchor).toBeInViewport();
      const button = anchor.locator(".tour-story-cta a");
      await button.focus();
      await page.keyboard.press("Shift+Tab");
      await page.keyboard.press("Tab");
      await expect(button).toBeFocused();
      expect(await button.evaluate(element => {
        const s = getComputedStyle(element);
        return s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 2;
      })).toBe(true);
      await page.screenshot({ path: info.outputPath(`cta-focus-${width}.png`) });
      expect(await button.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
      await noOverflow(page);
    }
    expect(errors).toEqual([]);
  });

  test(`${locale}: semantic accessibility and contrast audit`, async ({ page }, info) => {
    test.setTimeout(180_000);
    const audits = [];
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["", "tours/", "all-routes/", "santa-marta-airport-transfer/", locale === "es" ? "terminos-condiciones/" : "terms-and-conditions/"]) {
        await ready(page, `/${locale}/${path}`);
        await page.addScriptTag({ content: axeSource });
        const result = await page.evaluate(async () => {
          const axe = (window as unknown as { axe: { run: (options: object) => Promise<{ violations: { id: string; impact: string; nodes: { target: string[]; failureSummary: string }[] }[] }> } }).axe;
          const result = await axe.run({ runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] } });
          return result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, reason: n.failureSummary })) }));
        });
        audits.push({ path, width, violations: result });
      }
    }
    const report = info.outputPath("accessibility.json");
    writeFileSync(report, JSON.stringify(audits, null, 2));
    await info.attach("accessibility", { path: report, contentType: "application/json" });
    expect(audits.flatMap(audit => audit.violations.filter(v => v.impact === "critical" || v.impact === "serious").map(v => `${audit.path} ${audit.width}: ${v.id}`))).toEqual([]);
  });
}

test("small-screen booking keyboard, bounds, dismissal and pointer gallery", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await ready(page, "/es/");
  const opener = page.locator(".trip-dock-cta");
  await opener.focus();
  await page.keyboard.press("Enter");
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    // Native dialogs may yield to browser chrome between tab cycles, but never
    // to another page control while the rest of the document is inert.
    expect(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement?.closest(".booking-dialog"))).toBe(true);
  }
  await page.locator("#hero-passengers").fill("31");
  await expect(page.locator("#hero-passengers")).toHaveValue("30");
  await page.locator("#hero-passengers").fill("0");
  await expect(page.locator("#hero-passengers")).toHaveValue("1");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await page.locator("#fleet").scrollIntoViewIfNeeded();
  const photo = page.locator(".fleet-photo");
  const box = (await photo.boundingBox())!;
  await page.mouse.move(box.x + box.width * .85, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .15, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect(photo.locator("img")).toHaveAttribute("alt", /vista 2$/);
  await noOverflow(page);
});

test("mobile touch swipes change fleet photos in both languages", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const input = await context.newCDPSession(page);
  try {
    for (const locale of ["es", "en"]) {
      await ready(page, `${test.info().project.use.baseURL}/${locale}/`);
      const photo = page.locator(".fleet-photo");
      await photo.scrollIntoViewIfNeeded();
      const box = (await photo.boundingBox())!;
      const y = box.y + box.height / 2;
      await input.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width * .85, y }] });
      for (const fraction of [.7, .5, .3, .15]) {
        await input.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * fraction, y }] });
      }
      await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect(photo.locator("img")).toHaveAttribute("alt", / 2$/);
      await noOverflow(page);
    }
  } finally {
    await context.close();
  }
});

test("root fallback, missing page and printable review utility", async ({ page }, info) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es\/$/);
  expect((await page.goto("/not-a-real-evertrip-page/"))?.status()).toBe(404);
  await expect(page.getByText("404", { exact: true })).toBeVisible();
  for (const locale of ["es", "en"]) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      expect((await page.goto(`/${locale}/review-qr/`))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.locator('img[src$="review_qr.png"]').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
      await page.screenshot({ path: info.outputPath(`${locale}-review-qr-${width}.png`), fullPage: true });
      await noOverflow(page);
    }
  }
  await page.evaluate(() => { window.print = () => { document.body.dataset.printCalled = "true"; }; });
  await page.getByRole("button", { name: /Imprimir/ }).click();
  await expect(page.locator("body")).toHaveAttribute("data-print-called", "true");
});

test("localized navigation preserves page equivalents and tour consultation messages", async ({ page }) => {
  test.setTimeout(120_000);
  const consoleErrors: string[] = [];
  page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ["es", "en"]) {
      const other = locale === "es" ? "en" : "es";
      for (const suffix of ["", "tours/", "all-routes/", "santa-marta-to-tayrona/", locale === "es" ? "politica-privacidad/" : "privacy-policy/"]) {
        await ready(page, `/${locale}/${suffix}?pax=4`);
        await page.locator(`.language-switch a[hreflang="${other}"]`).click();
        const equivalent = suffix === "politica-privacidad/" ? "privacy-policy/" : suffix === "privacy-policy/" ? "politica-privacidad/" : suffix;
        await expect(page).toHaveURL(new RegExp(`/${other}/${equivalent}\\?pax=4$`));
        await expect(page.locator("html")).toHaveAttribute("lang", other);
      }
      await ready(page, `/${locale}/tours/`);
      const nav = width === 390 ? page.locator("#mobile-navigation") : page.locator(".site-nav > nav").first();
      if (width === 390) await page.locator('[aria-controls="mobile-navigation"]').click();
      await expect(nav.locator("a[aria-current]")).toHaveCount(1);
      await expect(nav.locator("a[aria-current=page]")).toHaveText("Tours");
      if (width === 390) await page.keyboard.press("Escape");
      for (const article of await page.locator(".tour-story-block").all()) {
        const title = await article.locator("h2").innerText();
        const message = new URL((await article.locator(".tour-story-cta a").getAttribute("href"))!).searchParams.get("text")!;
        expect(message).toContain(title);
        expect(message).toContain(locale === "es" ? "Hola Evertrip, estoy interesado en " : "Hi Evertrip, I’m interested in ");
      }
      await ready(page, `/${locale}/`);
      if (width === 390) await page.locator('[aria-controls="mobile-navigation"]').click();
      await nav.locator('a[href$="#routes"]').click();
      await expect(page.locator('.site-nav > nav').first().locator('[aria-current="location"]')).toHaveAttribute("href", `/${locale}/#routes`);
    }
  }
  expect(consoleErrors).toEqual([]);
});
