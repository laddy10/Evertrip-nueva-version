import {
  test,
  expect,
  vehicles,
  openFleet,
  reachVehicle,
  checkModal,
  backdropPoint,
  loaded,
} from "./fleet.helpers";

test("All five models retain their real capacities, photos, and quote links", async ({
  page,
}) => {
  await openFleet(page);
  for (const vehicle of vehicles) {
    const g = await reachVehicle(page, vehicle);
    await expect(g.fleet.locator(".fleet-capacity strong")).toHaveText(
      vehicle.capacity,
    );
    await expect(g.fleet.locator(".fleet-specification a")).toHaveAttribute(
      "href",
      /wa.me\/573147659756/,
    );
    for (const index of [2, 3, 1]) {
      await g.fleet
        .getByRole("button", { name: "Imagen siguiente", exact: true })
        .click();
      await expect(g.opener.getByRole("img")).toHaveAttribute(
        "alt",
        `${vehicle.name} — vista ${index}`,
      );
      await loaded(g.opener.getByRole("img"), "contain");
    }
  }
});

for (const vehicle of vehicles) {
  test(`${vehicle.name}: all gallery images, circular navigation, close, and focus restoration`, async ({
    page,
  }) => {
    await openFleet(page);
    const g = await reachVehicle(page, vehicle);
    const source = await g.opener.getByRole("img").getAttribute("src");
    await g.opener.click();
    let dialog = await checkModal(page, vehicle.name, 1);
    await expect(
      dialog.getByRole("button", { name: "Cerrar galería" }),
    ).toBeFocused();
    const sources = new Set<string | null>([
      await dialog.getByRole("img").getAttribute("src"),
    ]);
    for (const index of [2, 3, 1]) {
      await dialog
        .getByRole("button", { name: "Imagen siguiente", exact: true })
        .click();
      dialog = await checkModal(page, vehicle.name, index);
      sources.add(await dialog.getByRole("img").getAttribute("src"));
    }
    expect(sources.size).toBe(3);
    await dialog
      .getByRole("button", { name: "Imagen anterior", exact: true })
      .click();
    await checkModal(page, vehicle.name, 3);
    await expect(g.opener.locator("img")).toHaveAttribute("src", source!);
    await dialog.getByRole("button", { name: "Cerrar galería" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();
    await g.opener.click();
    await page.keyboard.press("Escape");
    await expect(g.opener).toBeFocused();
    await g.opener.click();
    const point = await backdropPoint(page);
    await page.mouse.click(point.x, point.y);
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();
  });
}
