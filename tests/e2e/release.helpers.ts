import { expect, type Page, type TestInfo } from "@playwright/test";

export const widths = [320, 375, 390, 430, 768, 1024, 1440];
export const representativeRoutes = ["santa-marta-airport-transfer", "private-transfer-santa-marta-cartagena", "custom-private-routes"];

export async function ready(page: Page, url: string) {
  expect((await page.goto(url))?.status()).toBe(200);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toHaveCount(1);
}

export async function noOverflow(page: Page) {
  expect(await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1);
}

export async function capture(page: Page, info: TestInfo, name: string, selector?: string) {
  const target = selector ? page.locator(selector) : page.locator("body");
  await target.scrollIntoViewIfNeeded();
  await target.locator("img").evaluateAll(async images => {
    await Promise.all(images.map(async element => {
      const image = element as HTMLImageElement;
      image.loading = "eager";
      await image.decode().catch(() => undefined);
    }));
  });
  const file = info.outputPath(name + ".png");
  await target.screenshot({ path: file, animations: "disabled" });
  await info.attach(name, { path: file, contentType: "image/png" });
  await noOverflow(page);
}

export async function whatsappLinks(page: Page) {
  const links = await page.locator('a[href*="wa.me"]').evaluateAll(items => items.map(item => ({ href: (item as HTMLAnchorElement).href, label: item.textContent?.trim() || item.getAttribute("aria-label") })));
  for (const link of links) {
    const url = new URL(link.href);
    expect(url.hostname).toBe("wa.me");
    expect(url.pathname).toBe("/573147659756");
    expect(link.label).toBeTruthy();
    expect(url.searchParams.get("text") ?? "").not.toMatch(/undefined|NaN/);
  }
}
