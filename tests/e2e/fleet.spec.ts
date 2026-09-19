import { test, expect, vehicles, gallery, openFleet, reachVehicle, checkModal, backdropPoint, loaded, opaque } from "./fleet.helpers";

test("Las flechas exteriores permiten alcanzar los cinco vehículos", async ({ page }) => {
  await openFleet(page);
  for (const vehicle of vehicles) {
    const g = gallery(page, vehicle.name);
    // A bounded number of actual carousel button presses, without assigning scrollLeft.
    for (let attempt = 0; attempt < vehicles.length; attempt++) {
      const visible = await g.card.evaluate(element => {
        const box = element.getBoundingClientRect();
        const container = element.parentElement!.parentElement!.getBoundingClientRect();
        return box.left >= container.left && box.right <= container.right;
      });
      if (visible) break;
      const before = await g.carousel.evaluate(element => element.scrollLeft);
      await g.fleet.getByRole("button", { name: "Ver siguientes vehículos", exact: true }).click();
      await expect.poll(() => g.carousel.evaluate(element => element.scrollLeft)).toBeGreaterThan(before + 20);
      // Wait for native smooth scrolling and snapping to finish.
      await expect.poll(() => g.card.evaluate(element => {
        const box = element.getBoundingClientRect();
        const container = element.parentElement!.parentElement!.getBoundingClientRect();
        return box.left >= container.left - 1 && box.right <= container.right + 1;
      })).toBe(true);
    }
    await reachVehicle(page, vehicle);
  }
  const previous = page.getByRole("button", { name: "Ver vehículos anteriores", exact: true });
  await opaque(previous);
  const carousel = gallery(page, vehicles[0].name).carousel;
  const before = await carousel.evaluate(element => element.scrollLeft);
  await previous.click();
  await expect.poll(() => carousel.evaluate(element => element.scrollLeft)).toBeLessThan(before - 20);
});

for (const vehicle of vehicles) {
  test(`${vehicle.name}: lightbox, navegación circular, cierres y foco`, async ({ page }) => {
    await openFleet(page);
    const g = await reachVehicle(page, vehicle);
    const cardSource = await g.opener.getByRole("img").getAttribute("src");
    await g.opener.click();
    let dialog = await checkModal(page, vehicle.name, 1);
    await expect(dialog.getByRole("button", { name: "Cerrar galería" })).toBeFocused();
    const sources = new Set<string | null>([await dialog.getByRole("img").getAttribute("src")]);
    for (const index of [2, 3, 1]) {
      await dialog.getByRole("button", { name: "Imagen siguiente", exact: true }).click();
      dialog = await checkModal(page, vehicle.name, index);
      sources.add(await dialog.getByRole("img").getAttribute("src"));
      await expect(g.opener.locator("img")).toHaveAttribute("src", cardSource!);
    }
    expect(sources.size).toBe(3);
    for (const index of [3, 2, 1]) {
      await dialog.getByRole("button", { name: "Imagen anterior", exact: true }).click();
      dialog = await checkModal(page, vehicle.name, index);
      await expect(g.opener.locator("img")).toHaveAttribute("src", cardSource!);
    }
    await dialog.getByRole("button", { name: "Cerrar galería" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();
    await loaded(g.opener.getByRole("img"), "cover");

    await g.opener.click();
    await checkModal(page, vehicle.name, 1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();

    await g.opener.click();
    await checkModal(page, vehicle.name, 1);
    const point = await backdropPoint(page);
    await page.mouse.click(point.x, point.y);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();
  });
}

test("Sin avance automático durante una observación de cinco segundos", async ({ page }) => {
  await openFleet(page);
  for (const vehicle of vehicles) await reachVehicle(page, vehicle);
  const g = await reachVehicle(page, vehicles[0]);
  const snapshot = () => g.carousel.evaluate(element => ({
    scrollLeft: element.scrollLeft,
    photos: [...element.querySelectorAll('button[aria-haspopup="dialog"] img')].map(image => image.getAttribute("src")),
  }));
  const before = await snapshot();
  expect(before.photos).toHaveLength(5);
  // Deliberate observation window, not a synchronization sleep or proof of no timers.
  for (let sample = 0; sample < 5; sample++) {
    await page.waitForTimeout(1_000);
    const current = await snapshot();
    expect(current.photos).toEqual(before.photos);
    expect(Math.abs(current.scrollLeft - before.scrollLeft)).toBeLessThanOrEqual(1);
  }
});
