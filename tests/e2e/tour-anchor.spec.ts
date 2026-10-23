import { test, expect } from "@playwright/test";
import { ready, noOverflow } from "./release.helpers";

test.describe.configure({ mode: "parallel" });

// Follow a homepage hash navigation immediately with a cross-page tour link.
// Keep the scroll-call evidence when this timing-sensitive regression fails.
for (const locale of ["es", "en"]) {
  for (const width of [390, 768, 1440]) {
    test(`${locale} ${width}px: Cabo anchor remains visible after navigation`, async ({ page }, info) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      for (let attempt = 0; attempt < 6; attempt++) {
        await ready(page, `/${locale}/`);
        await page.evaluate(() => {
          const calls: object[] = [];
          Object.assign(window, { anchorCalls: calls });
          const original = Element.prototype.scrollIntoView;
          Element.prototype.scrollIntoView = function (options) {
            // Do not read layout here: forcing a reflow can mask scroll races.
            calls.push({ time: performance.now(), id: this.id, url: location.href });
            return original.call(this, options);
          };
        });
        await page.locator("#faq summary").first().scrollIntoViewIfNeeded();
        if (width < 1024) await page.locator('[aria-controls="mobile-navigation"]').click();
        const nav = width < 1024 ? page.locator("#mobile-navigation") : page.locator(".site-nav > nav").first();
        await nav.locator('a[href$="#tours"]').click();
        await page.locator('#tours a[href$="#pasadia-cabo-de-la-vela"]').click();
        try {
          await expect(page).toHaveURL(new RegExp(`/${locale}/tours/#pasadia-cabo-de-la-vela$`));
          const heading = page.locator("#pasadia-cabo-de-la-vela h2");
          await expect(heading).toBeInViewport();
          // Observe the settled position too, not only a passing animation frame.
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(1000);
          await expect(heading).toBeInViewport();
          expect(await heading.evaluate(element => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(64);
          await noOverflow(page);
        } catch (error) {
          const evidence = await page.evaluate(() => ({
            url: location.href, y: scrollY, height: document.documentElement.scrollHeight,
            calls: (window as unknown as { anchorCalls?: object[] }).anchorCalls,
            tours: Array.from(document.querySelectorAll(".tour-story-block")).map(element => ({
              id: element.id, top: element.getBoundingClientRect().top, height: element.getBoundingClientRect().height,
            })),
          }));
          await info.attach(`anchor-${attempt}`, { body: JSON.stringify(evidence, null, 2), contentType: "application/json" });
          console.log(JSON.stringify(evidence));
          throw error;
        }
      }
      expect(errors).toEqual([]);
      await page.screenshot({ path: info.outputPath("cabo-arrival.png") });
    });
  }
}

for (const locale of ["es", "en"]) {
  test(`${locale}: all tour anchors support keyboard, back and direct entry without JavaScript`, async ({ page, browser }) => {
    test.setTimeout(120_000);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await ready(page, `/${locale}/`);
      const hrefs = await page.locator(".tour-showcase-card").evaluateAll(links => links.map(link => link.getAttribute("href")!));
      for (const href of hrefs) {
        await page.locator(`.tour-showcase-card[href="${href}"]`).focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(new RegExp(href + "$"));
        await expect(page.locator(href.slice(href.indexOf("#")) + " h2")).toBeInViewport();
        await expect(page.locator(".tour-story-cta > a")).toHaveCount(3);
        await expect(page.locator("#pasadia-cabo-de-la-vela .tour-story-gallery-image")).toHaveCount(4);
        await page.goBack();
        await expect(page.locator(".tour-showcase-card")).toHaveCount(3);
      }
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 }, baseURL: new URL(page.url()).origin });
      try {
        for (const href of [...hrefs, `/${locale}/tours/#cabo-de-la-vela`]) {
          // A new tab exercises a real document request; changing only a hash
          // in an existing tab correctly produces no HTTP response.
          const direct = await context.newPage();
          await ready(direct, href);
          const id = href.endsWith("#cabo-de-la-vela") ? "#pasadia-cabo-de-la-vela" : href.slice(href.indexOf("#"));
          await expect(direct.locator(id + " h2")).toBeInViewport();
          await noOverflow(direct);
          await direct.close();
        }
      } finally {
        await context.close();
      }
    }
  });
}
