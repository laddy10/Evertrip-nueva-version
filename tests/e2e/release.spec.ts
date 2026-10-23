import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { widths, representativeRoutes, ready, capture, noOverflow, whatsappLinks } from "./release.helpers";

for (const locale of ["es", "en"]) {
  for (const width of widths) {
    test(`${locale} ${width}px: homepage and booking`, async ({ page }, info) => {
      test.setTimeout(120_000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await ready(page, `/${locale}/`);
      for (const selector of ["#journey", "#routes", "#tours", "#fleet", ".promise-landscape", ".promise-narrative", ".traveler-voice", ".journal-postcard", "#faq", "footer"]) {
        await capture(page, info, selector.replace(/[.#]/g, ""), selector);
      }
      await whatsappLinks(page);
      if (width < 1024) {
        const menu = page.locator('[aria-controls="mobile-navigation"]');
        await menu.click();
        await expect(page.locator("#mobile-navigation")).toBeVisible();
        await page.screenshot({ path: info.outputPath("mobile-menu.png") });
        await page.keyboard.press("Escape");
        await expect(menu).toBeFocused();
        await expect(menu).toHaveAttribute("aria-expanded", "false");
      }
      await page.locator(".trip-dock-cta").click();
      await capture(page, info, "booking", ".booking-dialog");
      await expect(page.locator(".booking-submit")).toBeInViewport();
      await page.locator("#hero-destination").selectOption("Santa Marta");
      await page.locator(".booking-submit").click();
      await expect(page.locator("#booking-error")).toBeVisible();
      await page.locator("#hero-origin").selectOption("Palomino");
      await page.locator("#hero-passengers").fill("11");
      await page.locator(".booking-submit").click();
      await expect(page).toHaveURL(/santa-marta-to-palomino\/?.*pax=11/);
      await expect(page.locator(".quote-passengers strong")).toHaveText("11");
      const message = new URL((await page.locator(".quote-whatsapp").getAttribute("href"))!).searchParams.get("text")!;
      expect(message).toContain("Palomino → Santa Marta");
      expect(message).toContain("Passengers: 11");
      await noOverflow(page);
      expect(errors).toEqual([]);
    });

    test(`${locale} ${width}px: tours, directory and representative routes`, async ({ page }, info) => {
      test.setTimeout(120_000);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await ready(page, `/${locale}/tours/`);
      await expect(page.locator(".tour-story-cta > a")).toHaveCount(3);
      await expect(page.locator(".tour-story-enquire")).toHaveCount(0);
      for (const article of await page.locator(".tour-story-block").all()) {
        const id = (await article.getAttribute("id"))!;
        await capture(page, info, id, `#${id}`);
        expect(await article.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
      }
      const cabo = page.locator("#pasadia-cabo-de-la-vela .tour-story-gallery-image");
      await expect(cabo).toHaveCount(4);
      const boxes = await cabo.evaluateAll(images => images.map(image => { const b = image.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }));
      expect(boxes[0].y).toBe(boxes[1].y);
      expect(boxes[2].y).toBe(boxes[3].y);
      expect(boxes[0].w).toBeCloseTo(boxes[3].w, 0);
      await capture(page, info, "tours-footer", "footer");
      await whatsappLinks(page);
      await ready(page, `/${locale}/all-routes/`);
      await capture(page, info, "directory", ".route-directory");
      await expect(page.locator(".directory-index > div > a")).toHaveCount(23);
      await page.locator("#route-search").fill("Palomino");
      expect(await page.locator(".directory-index > div > a").count()).toBeGreaterThan(0);
      await page.locator("#route-search").fill("zzznomatch");
      await expect(page.locator(".directory-index > div > a")).toHaveCount(0);
      for (const slug of representativeRoutes) {
        await ready(page, `/${locale}/${slug}/`);
        await capture(page, info, slug, ".route-journal");
        await whatsappLinks(page);
      }
      expect(errors).toEqual([]);
    });

    test(`${locale} ${width}px: legal reading, contents and language`, async ({ page }, info) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 900 });
      const paths = locale === "es" ? ["politica-privacidad", "terminos-condiciones"] : ["privacy-policy", "terms-and-conditions"];
      for (const slug of paths) {
        await ready(page, `/${locale}/${slug}/?pax=5`);
        await capture(page, info, slug, "main");
        await page.locator("aside summary").click();
        const link = page.locator("aside details a").last();
        const hash = (await link.getAttribute("href"))!;
        await link.click();
        await expect(page.locator(hash)).toBeInViewport();
        await page.locator('footer a[href$="#section-6"]').click();
        await expect(page.locator("#section-6")).toBeInViewport();
        const other = locale === "es" ? "en" : "es";
        await page.locator(`.language-switch a[hreflang="${other}"]`).click();
        await expect(page).toHaveURL(new RegExp(`/${other}/${other === "es" ? "terminos-condiciones" : "terms-and-conditions"}/`));
        await noOverflow(page);
      }
    });
  }

  test(`${locale}: all route URLs render and quote correctly at every width`, async ({ page }, info) => {
    test.setTimeout(180_000);
    const urls = [...readFileSync("out/sitemap.xml", "utf8").matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname).filter(url => url.startsWith(`/${locale}/`) && !/\/(tours|all-routes|politica-privacidad|terminos-condiciones|privacy-policy|terms-and-conditions)\/$/.test(url) && url !== `/${locale}/`);
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const url of urls) {
      await ready(page, url + "?pax=30");
      await expect(page.locator(".quote-passengers strong")).toHaveText("30");
      await expect(page.locator(".quote-passengers button").last()).toBeDisabled();
      await whatsappLinks(page);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await noOverflow(page);
      }
    }
    await info.attach("route-coverage", { body: JSON.stringify({ urls, widths, errors }, null, 2), contentType: "application/json" });
    expect(urls).toHaveLength(23);
    expect(errors).toEqual([]);
  });
}
