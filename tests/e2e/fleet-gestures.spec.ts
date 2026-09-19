import { test, expect, vehicles, openFleet, reachVehicle, checkModal, backdropPoint, touchSwipe, loaded, opaque, noOverflow } from "./fleet.helpers";

test("Drag de foto no abre el modal; flechas y dots tampoco", async ({ page }) => {
  await openFleet(page);
  const g = await reachVehicle(page, vehicles[0]);
  const photo = (await g.opener.boundingBox())!;
  await page.mouse.move(photo.x + photo.width * 0.8, photo.y + photo.height * 0.35);
  await page.mouse.down();
  await page.mouse.move(photo.x + photo.width * 0.2, photo.y + photo.height * 0.35, { steps: 8 });
  await page.mouse.up();
  await expect(g.opener).toHaveCount(1);
  await expect(g.opener.getByRole("img")).toHaveAttribute("alt", "BUS EJECUTIVO - view 2");
  await loaded(g.opener.getByRole("img"), "cover");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await g.card.hover();
  for (const [label, index] of [["Next image", 3], ["Previous image", 2], ["Ir a la imagen 1", 1], ["Ir a la imagen 3", 3]] as const) {
    const control = g.card.getByRole("button", { name: label, exact: true });
    await opaque(control);
    await control.click();
    await expect(g.opener).toHaveCount(1);
    await expect(g.opener.getByRole("img")).toHaveAttribute("alt", `BUS EJECUTIVO - view ${index}`);
    await loaded(g.opener.getByRole("img"), "cover");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  // A subsequent deliberate keyboard activation still works after rejected gestures.
  await g.opener.focus();
  await page.keyboard.press("Enter");
  await checkModal(page, vehicles[0].name, 3);
  await page.keyboard.press("Escape");
  await expect(g.opener).toBeFocused();
});

test("Drag exterior desde pasajeros desplaza el carrusel sin abrir el modal", async ({ page }) => {
  await openFleet(page);
  const g = await reachVehicle(page, vehicles[1]);
  const safe = (await g.passengers.boundingBox())!;
  const before = await g.carousel.evaluate(element => element.scrollLeft);
  await page.mouse.move(safe.x + safe.width * 0.8, safe.y + safe.height / 2);
  await page.mouse.down();
  await page.mouse.move(safe.x + safe.width * 0.2, safe.y + safe.height / 2, { steps: 10 });
  await expect.poll(() => g.carousel.evaluate(element => element.scrollLeft)).toBeGreaterThan(before + safe.width * 0.4);
  // Release over a photograph: its opener must reject a gesture begun on passengers.
  const photo = (await g.opener.boundingBox())!;
  await page.mouse.move(photo.x + photo.width / 2, photo.y + photo.height * 0.35, { steps: 5 });
  await page.mouse.up();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(g.carousel).toHaveCSS("scroll-snap-type", "x mandatory");
  await noOverflow(page);
});

test.describe("Touch emulado en Chromium 390x844", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  for (const vehicle of vehicles) {
    test(`${vehicle.name}: tap abre, controles y modal caben, X cierra`, async ({ page }) => {
      await openFleet(page);
      const g = await reachVehicle(page, vehicle);
      for (const label of ["Previous image", "Next image", "Ir a la imagen 1"]) {
        await opaque(g.card.getByRole("button", { name: label, exact: true }));
      }
      await g.opener.tap();
      const dialog = await checkModal(page, vehicle.name, 1);
      await dialog.getByRole("button", { name: "Imagen siguiente", exact: true }).tap();
      await checkModal(page, vehicle.name, 2);
      await dialog.getByRole("button", { name: "Cerrar galería" }).tap();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(g.opener).toBeFocused();
      await expect(g.opener.getByRole("img")).toHaveAttribute("alt", `${vehicle.name} - view 1`);
      await noOverflow(page);
    });
  }

  test("Swipe táctil cambia la foto sin abrir modal; tap posterior funciona", async ({ page }) => {
    await openFleet(page);
    const g = await reachVehicle(page, vehicles[0]);
    await touchSwipe(page, g.opener);
    await expect(g.opener).toHaveCount(1);
    await expect(g.opener.getByRole("img")).toHaveAttribute("alt", "BUS EJECUTIVO - view 2");
    await loaded(g.opener.getByRole("img"), "cover");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await g.card.getByRole("button", { name: "Next image", exact: true }).tap();
    await expect(g.opener).toHaveCount(1);
    await expect(g.opener.getByRole("img")).toHaveAttribute("alt", "BUS EJECUTIVO - view 3");
    await loaded(g.opener.getByRole("img"), "cover");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await g.card.getByRole("button", { name: "Ir a la imagen 1", exact: true }).tap();
    await expect(g.opener).toHaveCount(1);
    await loaded(g.opener.getByRole("img"), "cover");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await g.opener.tap();
    await checkModal(page, vehicles[0].name, 1);
  });

  test("Tap en backdrop cierra y restaura foco", async ({ page }, testInfo) => {
    await openFleet(page);
    const g = await reachVehicle(page, vehicles[0]);
    await g.opener.tap();
    await checkModal(page, vehicles[0].name, 1);
    const point = await backdropPoint(page);
    const events = await page.getByRole("dialog").evaluateHandle(element => {
      const sequence: string[] = [];
      for (const type of ["pointerdown", "pointerup", "pointerout", "pointerleave", "click"]) {
        element.addEventListener(type, event => {
          if (event.target === element) sequence.push(event.type);
        });
      }
      return sequence;
    });
    await page.touchscreen.tap(point.x, point.y);
    await testInfo.attach("backdrop-touch-events", { body: JSON.stringify(await events.jsonValue()), contentType: "application/json" });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(g.opener).toBeFocused();
  });
});
