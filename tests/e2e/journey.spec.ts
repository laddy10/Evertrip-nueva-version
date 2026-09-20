import { test, expect } from "@playwright/test";

test("The complete coastal scene scrubs forward and backward and typography changes cleanly", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/es/");
  const video = page.locator(".overture-film video");
  await expect
    .poll(
      () =>
        video.evaluate((element) => (element as HTMLVideoElement).readyState),
      { timeout: 20000 },
    )
    .toBeGreaterThan(1);
  const journey = page.locator("#journey");
  const scroll = async (value: number) =>
    journey.evaluate((element, progress) => {
      window.scrollTo({
        top:
          element.getBoundingClientRect().top +
          scrollY +
          (element.getBoundingClientRect().height - innerHeight) * progress,
        behavior: "instant",
      });
    }, value);
  await scroll(0.55);
  await expect(journey).toHaveAttribute("data-chapter", "1");
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(3);
  await expect(page.locator(".overture-title")).toHaveCSS("opacity", "0");
  await expect(page.locator(".overture-travel")).toHaveCSS("opacity", "1");
  await scroll(0.94);
  await expect(journey).toHaveAttribute("data-chapter", "2");
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeGreaterThan(6);
  await scroll(0.08);
  await expect(journey).toHaveAttribute("data-chapter", "0");
  await expect
    .poll(() =>
      video.evaluate((element) => (element as HTMLVideoElement).currentTime),
    )
    .toBeLessThan(1);
  await expect(page.locator(".overture-title")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("Brand video loads on demand; Escape closes and restores focus", async ({
  page,
}) => {
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Video player</p>" }),
  );
  await page.goto("/en/");
  const opener = page.getByRole("button", { name: "Meet Evertrip" });
  await expect(page.locator(".brand-film-dialog iframe")).toHaveCount(0);
  await opener.click();
  await expect(
    page.getByRole("dialog", { name: "Meet Evertrip" }),
  ).toBeVisible();
  await expect(page.locator(".brand-film-dialog iframe")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page.locator(".brand-film-dialog iframe")).toHaveCount(0);
  await expect(opener).toBeFocused();
});

for (const locale of ["es", "en"]) {
  test(`${locale}: booking carries passengers into the correct vehicle and WhatsApp quote`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    await page.locator(".trip-dock-cta").click();
    await page.locator("#hero-destination").selectOption("Palomino");
    await page.locator("#hero-passengers").fill("10");
    await page.locator(".booking-submit").click();
    await expect(page).toHaveURL(
      new RegExp(`/${locale}/santa-marta-to-palomino/?.*pax=10`),
    );
    await expect(page.locator(".quote-vehicle h4")).toHaveText(
      locale === "es" ? "Van Ejecutiva" : "Business Van",
    );
    const link = page.locator(".quote-whatsapp");
    expect(decodeURIComponent((await link.getAttribute("href"))!)).toContain(
      "Passengers: 10",
    );
    await page
      .getByRole("button", {
        name: locale === "es" ? "Más pasajeros" : "More passengers",
      })
      .click();
    await expect(page.locator(".quote-vehicle h4")).toHaveText(
      locale === "es" ? "Van Grupal" : "Group Van",
    );
    expect(decodeURIComponent((await link.getAttribute("href"))!)).toContain(
      "Passengers: 11",
    );
  });
}

test("Booking validation and modal focus work without navigation", async ({
  page,
}) => {
  await page.goto("/en/");
  const opener = page.locator(".trip-dock-cta");
  await opener.click();
  await page.locator("#hero-destination").selectOption("Santa Marta");
  await page.locator(".booking-submit").click();
  await expect(
    page.locator(".booking-dialog").getByRole("alert"),
  ).toContainText("Choose a destination");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await expect(page).toHaveURL(/\/en\/$/);
});

test("A custom transfer hands the exact pickup, destination and group to WhatsApp", async ({
  page,
}) => {
  await page.goto("/en/");
  await page.locator(".trip-dock-cta").click();
  await page.locator("#hero-origin").selectOption("Minca");
  await page.locator("#hero-destination").selectOption("Tayrona");
  await page.locator("#hero-passengers").fill("17");
  await page
    .context()
    .route("https://wa.me/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "WhatsApp handoff" }),
    );
  const popupPromise = page.waitForEvent("popup");
  await page.locator(".booking-submit").click();
  const popup = await popupPromise;
  await popup.waitForURL(/wa.me/);
  const text = new URL(popup.url()).searchParams.get("text");
  expect(text).toContain("Minca → Tayrona");
  expect(text).toContain("Passengers: 17");
  await popup.close();
});

test("Reduced motion uses the still scene and keeps booking and navigation usable at mobile widths", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/en/");
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      )
      .toBeLessThanOrEqual(1);
    await expect(page.locator(".overture-stage")).toHaveCSS(
      "position",
      "relative",
    );
    await expect(page.locator(".overture-title")).toHaveCSS("opacity", "1");
    const video = page.locator(".overture-film video");
    await expect.poll(() => video.evaluate((element) => {
      const film = element as HTMLVideoElement;
      return film.readyState >= 2 && !film.seeking && film.paused;
    })).toBe(true);
    const stillTime = await video.evaluate((element) => (element as HTMLVideoElement).currentTime);
    await page.evaluate(() => window.scrollTo({ top: 250, behavior: "instant" }));
    await expect(page.locator("#journey")).not.toBeInViewport({ ratio: 1 });
    await expect(video).toHaveJSProperty("currentTime", stillTime);
    await expect(page.locator(".overture-title")).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.locator(".trip-dock-cta").click();
    await expect(page.locator(".booking-submit")).toBeInViewport();
    await page.keyboard.press("Escape");
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("Atlas destinations, complete route directory and language switching remain connected", async ({
  page,
}) => {
  await page.goto("/en/");
  const atlas = page.locator("#routes");
  await atlas.getByRole("button", { name: "Minca", exact: true }).click();
  await expect(atlas.locator(".atlas-route a")).toHaveAttribute(
    "href",
    /\/en\/santa-marta-to-minca\/?$/,
  );
  await atlas.locator(".atlas-all").click();
  await expect(page.locator(".directory-index>div>a")).toHaveCount(23);
  await page.getByRole("searchbox", { name: "Search routes" }).fill("Palomino");
  await expect(page.locator(".directory-index>div>a").first()).toContainText(
    "Palomino",
  );
  await page.goto("/en/santa-marta-to-palomino?pax=30");
  await page.getByRole("link", { name: "Cambiar a español" }).click();
  await expect(page).toHaveURL(/\/es\/santa-marta-to-palomino\/?\?pax=30/);
  await expect(page.locator(".quote-passengers strong")).toHaveText("30");
  await expect(page.locator(".quote-vehicle h4")).toHaveText("Bus Ejecutivo");
  await expect(
    page.getByRole("button", { name: "Más pasajeros" }),
  ).toBeDisabled();
});
