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
  await expect(page.locator("#routes")).toHaveCSS("background-color", "rgb(7, 59, 58)");
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
