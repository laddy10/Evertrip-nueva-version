import {
  test,
  expect,
  vehicles,
  openFleet,
  reachVehicle,
  checkModal,
  touchSwipe,
  loaded,
  noOverflow,
} from "./fleet.helpers";

test("Photo drag changes the view without opening the gallery; keyboard activation still works", async ({
  page,
}) => {
  await openFleet(page);
  const g = await reachVehicle(page, vehicles[0]);
  const box = (await g.opener.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.35);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.35, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(g.opener.getByRole("img")).toHaveAttribute(
    "alt",
    "Mercedes Vito — vista 2",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await g.opener.focus();
  await page.keyboard.press("Enter");
  await checkModal(page, vehicles[0].name, 2);
  await page.keyboard.press("Escape");
  await expect(g.opener).toBeFocused();
});

test.describe("Chromium mobile touch emulation", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test("Every model and its interior can be reached; galleries fit the viewport", async ({
    page,
  }) => {
    await openFleet(page);
    for (const vehicle of vehicles) {
      const g = await reachVehicle(page, vehicle);
      await g.opener.tap();
      const dialog = await checkModal(page, vehicle.name, 1);
      await dialog
        .getByRole("button", { name: "Imagen anterior", exact: true })
        .tap();
      await checkModal(page, vehicle.name, 3);
      await dialog.getByRole("button", { name: "Cerrar galería" }).tap();
      await expect(g.opener).toBeFocused();
      await noOverflow(page);
    }
  });
  test("Touch swipe changes the photograph without opening; the next tap opens it", async ({
    page,
  }) => {
    await openFleet(page);
    const g = await reachVehicle(page, vehicles[0]);
    await touchSwipe(page, g.opener);
    await expect(g.opener.getByRole("img")).toHaveAttribute(
      "alt",
      "Mercedes Vito — vista 2",
    );
    await loaded(g.opener.getByRole("img"), "contain");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await g.opener.tap();
    await checkModal(page, vehicles[0].name, 2);
  });
});
