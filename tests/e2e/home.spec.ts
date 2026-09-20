import { test, expect, type Request } from "@playwright/test";

test("Home ES carga y sus secciones principales son alcanzables", async ({ page }) => {
  const pageErrors: string[] = [];
  const criticalResponses: string[] = [];
  const pendingResources = new Set<Request>();
  const criticalTypes = new Set(["document", "script", "stylesheet", "image", "font"]);

  page.on("pageerror", error => pageErrors.push(error.message));
  page.on("request", request => {
    if (criticalTypes.has(request.resourceType())) pendingResources.add(request);
  });
  page.on("requestfinished", request => pendingResources.delete(request));
  page.on("requestfailed", request => pendingResources.delete(request));
  page.on("response", response => {
    if (
      criticalTypes.has(response.request().resourceType()) &&
      (response.status() === 404 || response.status() >= 500)
    ) {
      criticalResponses.push(`${response.status()} ${response.url()}`);
    }
  });

  const expectNoGlobalOverflow = async () => {
    await expect.poll(() => page.evaluate(() => {
      const root = document.documentElement;
      return Math.max(root.scrollWidth, document.body.scrollWidth) - root.clientWidth;
    }), { message: "El documento no debe desbordarse horizontalmente" }).toBeLessThanOrEqual(1);
  };

  const response = await page.goto("/es/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  // A UTF-8 BOM inside concatenated production CSS can invalidate :root
  // while leaving every component's dimensions and interactions intact.
  await expect(page.locator("#routes")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator(".trip-dock")).toHaveCSS("background-color", "rgb(243, 244, 234)");

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toBeInViewport();

  const navbar = page.getByRole("banner");
  await expect(navbar).toBeVisible();
  await expect(navbar.getByRole("navigation")).toBeVisible();
  await expect(navbar).toBeInViewport();

  const hero = page.locator("main section").filter({ has: h1 });
  await expect(hero).toBeVisible();
  await expect(hero).toBeInViewport();
  await expectNoGlobalOverflow();

  for (const id of ["fleet", "routes", "faq"]) {
    await test.step(`Scroll hasta #${id}`, async () => {
      const section = page.locator(`#${id}`);
      const heading = section.getByRole("heading", { level: 2 });
      await heading.scrollIntoViewIfNeeded();
      await expect(section).toBeVisible();
      await expect(heading).toBeInViewport();
      await expectNoGlobalOverflow();
    });
  }

  // Wait for critical resources started by lazy loading, without waiting on analytics.
  await expect.poll(() => [...pendingResources].map(request => request.url()), {
    message: "Los recursos críticos solicitados deben terminar de cargar",
    timeout: 15_000,
  }).toEqual([]);
  expect(pageErrors, "No debe haber excepciones JavaScript").toEqual([]);
  expect(criticalResponses, "No debe haber respuestas críticas 404/5xx").toEqual([]);
});

for (const locale of ["es", "en"]) {
  test(`${locale}: paired destinations and route actions fit at every responsive size`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 375, 430, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const destination of ["Palomino", "Barranquilla"]) {
        await page.locator("#routes").getByRole("button", { name: destination, exact: true }).click();
        const bounds = await page.locator(".atlas-landscape").evaluate(element => {
          const parent = element.getBoundingClientRect();
          return [...element.querySelectorAll(".atlas-photo, .atlas-route, .atlas-route > a, .atlas-photo-place")].map(child => {
            const rect = child.getBoundingClientRect();
            return { left: rect.left - parent.left, right: rect.right - parent.right };
          });
        });
        for (const rect of bounds) {
          expect(rect.left, `${width}px: content stays inside its column`).toBeGreaterThanOrEqual(-1);
          expect(rect.right, `${width}px: content is not clipped`).toBeLessThanOrEqual(1);
        }
      }
    }
  });
}

test("The real coastal image remains available when the film cannot load", async ({ page }) => {
  await page.route("**/evertrip-real-drive.mp4", route => route.abort());
  await page.goto("/en/");
  const video = page.locator(".overture-film video");
  await expect(video).toHaveAttribute("poster", "/assets/journey/evertrip-real-drive-poster.webp");
  expect(await video.evaluate(async element => {
    const image = new Image();
    image.src = (element as HTMLVideoElement).poster;
    await image.decode();
    return image.naturalWidth;
  })).toBeGreaterThanOrEqual(1440);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator(".trip-dock-cta").click();
  await expect(page.locator(".booking-submit")).toBeInViewport();
});
