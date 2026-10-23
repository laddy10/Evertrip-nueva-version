import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import { ready, noOverflow } from "./release.helpers";

// Viewport captures retain the real fixed header/dock instead of stitching them
// into the middle of long element screenshots. Optional CSS injection is for
// art-direction previews; the final run always uses the compiled export.
async function frame(page: Page, info: TestInfo, selector: string, name: string) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await target.locator("img").evaluateAll(async images => {
    await Promise.all(images.map(async image => {
      image.loading = "eager";
      await image.decode();
    }));
  });
  await target.evaluate(element => {
    const header = document.querySelector(".site-header")!.getBoundingClientRect().height;
    window.scrollTo({ top: scrollY + element.getBoundingClientRect().top - header, behavior: "instant" });
  });
  await page.screenshot({ path: info.outputPath(name + ".png"), animations: "disabled" });
  await noOverflow(page);
}

for (const locale of ["es", "en"]) {
  for (const width of [320, 390, 430, 768, 1440]) {
    test(`${locale} ${width}px editorial composition`, async ({ page }, info) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: width < 700 ? 844 : 900 });
      const visit = async (path: string) => {
        await ready(page, `/${locale}/${path}`);
        if (process.env.VISUAL_CSS_PREVIEW) {
          await page.addStyleTag({ content: readFileSync("src/app/experience.css", "utf8") });
        }
      };
      await visit("");
      for (const [selector, name] of [
        ["#routes", "routes"], ["#tours", "tours"], ["#fleet", "fleet"],
        [".promise-landscape", "tayrona"], [".promise-narrative", "narrative"],
        [".promise-narrative article:nth-of-type(2)", "narrative-road"],
        [".traveler-voice", "reviews"], [".journal-postcard", "journal"], ["#faq", "faq"],
      ]) await frame(page, info, selector, name);
      const image = page.locator(".promise-landscape img");
      await expect(image).toHaveAttribute("src", "https://assets.evertripviajes.com/routes/tayrona/hero%20(2).webp?v=2");
      for (const slug of ["barranquilla-to-palomino", "santa-marta-airport-transfer", "private-transfer-santa-marta-cartagena", "custom-private-routes"]) {
        await visit(slug + "/");
        for (const [selector, name] of [[".route-cover", "cover"], [".route-planning", "planning"], [".quote-notebook", "quote"], [".route-related", "related"]]) {
          await frame(page, info, selector, `${slug}-${name}`);
        }
      }
    });
  }
}
