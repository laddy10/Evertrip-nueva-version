import {
  test as base,
  expect,
  type Locator,
  type Page,
  type Request,
} from "@playwright/test";

export { expect };
export const vehicles = [
  { name: "Mercedes Vito", capacity: "10" },
  { name: "Nissan Kicks", capacity: "04" },
  { name: "Renault Duster", capacity: "04" },
  { name: "Hyundai H1", capacity: "17" },
  { name: "Bus Ejecutivo", capacity: "30" },
];

// Shared by both specs: record all failures, enforce only fleet images and app code.
export const test = base.extend<{ fleetNetwork: void }>({
  fleetNetwork: [
    async ({ page, baseURL }, use, testInfo) => {
      const events: { kind: string; detail: string; critical: boolean }[] = [];
      const pending = new Set<Request>();
      const critical = (request: Request) => {
        const url = new URL(request.url());
        return (
          (request.resourceType() === "image" &&
            /\/(vehicles|assets\/carros\d+)\//.test(url.pathname)) ||
          (url.origin === new URL(baseURL!).origin &&
            ["document", "script", "stylesheet"].includes(
              request.resourceType(),
            ))
        );
      };
      page.on("pageerror", (error) =>
        events.push({
          kind: "pageerror",
          detail: error.message,
          critical: true,
        }),
      );
      page.on("request", (request) => {
        if (critical(request)) pending.add(request);
      });
      page.on("requestfinished", (request) => pending.delete(request));
      page.on("requestfailed", (request) => {
        pending.delete(request);
        events.push({
          kind: "requestfailed",
          detail: `${request.failure()?.errorText} ${request.url()}`,
          critical: critical(request),
        });
      });
      page.on("response", (response) => {
        if (response.status() === 404 || response.status() >= 500) {
          events.push({
            kind: "http",
            detail: `${response.status()} ${response.url()}`,
            critical: critical(response.request()),
          });
        }
      });
      try {
        await use();
      } finally {
        await expect.soft
          .poll(() => [...pending].map((request) => request.url()), {
            timeout: 15_000,
          })
          .toEqual([]);
        await testInfo.attach("network-and-pageerrors", {
          body: JSON.stringify(events, null, 2),
          contentType: "application/json",
        });
        expect
          .soft(
            events.filter((event) => event.critical),
            "Errores críticos de FleetShowcase",
          )
          .toEqual([]);
      }
    },
    { auto: true },
  ],
});

export function gallery(page: Page, name: string) {
  const fleet = page.locator("#fleet");
  return {
    fleet,
    opener: fleet.getByRole("button", {
      name: `Ampliar imagen de ${name}`,
      exact: true,
    }),
  };
}

export async function openFleet(page: Page) {
  expect((await page.goto("/es/"))?.status()).toBe(200);
  const fleet = page.locator("#fleet");
  await fleet.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
  await expect(fleet).toBeVisible();
  await expect(fleet).toBeInViewport();
}

export async function opaque(locator: Locator) {
  await expect(locator).toBeVisible();
  await expect
    .poll(() =>
      locator.evaluate((element) => {
        let opacity = 1;
        for (
          let node: Element | null = element;
          node;
          node = node.parentElement
        ) {
          opacity *= Number(getComputedStyle(node).opacity);
        }
        return opacity;
      }),
    )
    .toBeGreaterThan(0.99);
}

export async function loaded(image: Locator, fit: "cover" | "contain") {
  await opaque(image);
  await expect
    .poll(
      () =>
        image.evaluate((element) => {
          const img = element as HTMLImageElement;
          return img.complete && img.naturalWidth > 0 && img.naturalHeight > 0;
        }),
      {
        message: "La imagen debe estar descargada y decodificada",
        timeout: 20_000,
      },
    )
    .toBe(true);
  await expect(image).toHaveCSS("object-fit", fit);
}

export async function noOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          Math.max(
            document.documentElement.scrollWidth,
            document.body.scrollWidth,
          ) - document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
}

export async function insideViewport(page: Page, locator: Locator) {
  await expect(locator).toBeInViewport({ ratio: 0.99 });
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize()!;
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
  expect(box!.x).toBeGreaterThanOrEqual(-1);
  expect(box!.y).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
}

export async function reachVehicle(
  page: Page,
  vehicle: (typeof vehicles)[number],
) {
  const selector = page
    .locator(".fleet-selector")
    .getByRole("button", { name: new RegExp(vehicle.name) });
  await selector.click();
  await expect(selector).toHaveAttribute("aria-pressed", "true");
  const g = gallery(page, vehicle.name);
  await g.opener.scrollIntoViewIfNeeded();
  await expect(g.opener).toHaveCount(1);
  await expect(g.fleet.locator(".fleet-capacity strong")).toHaveText(
    vehicle.capacity,
  );
  await loaded(g.opener.getByRole("img"), "contain");
  await noOverflow(page);
  return g;
}

export async function checkModal(page: Page, name: string, index: number) {
  const dialog = page.getByRole("dialog", { name, exact: true });
  await expect(dialog).toBeVisible();
  await opaque(dialog.getByRole("heading", { name, exact: true }));
  await expect(dialog.locator('[aria-live="polite"]')).toHaveText(
    `Imagen ${index}/3`,
  );
  const image = dialog.getByRole("img", {
    name: `${name} - Imagen ${index} de 3`,
    exact: true,
  });
  await loaded(image, "contain");
  await insideViewport(page, dialog.locator(":scope > div"));
  await insideViewport(page, image);
  for (const label of [
    "Cerrar galería",
    "Imagen anterior",
    "Imagen siguiente",
  ]) {
    const control = dialog.getByRole("button", { name: label, exact: true });
    await opaque(control);
    await insideViewport(page, control);
  }
  await noOverflow(page);
  return dialog;
}

export async function backdropPoint(page: Page) {
  const dialog = page.getByRole("dialog");
  const outer = (await dialog.boundingBox())!;
  const panel = (await dialog.locator(":scope > div").boundingBox())!;
  const point = { x: (outer.x + panel.x) / 2, y: panel.y + panel.height / 2 };
  expect(
    await dialog.evaluate(
      (element, p) => document.elementFromPoint(p.x, p.y) === element,
      point,
    ),
  ).toBe(true);
  return point;
}

// Chromium CDP sends touch input through the browser; not DOM dispatchEvent or a real device.
export async function touchSwipe(page: Page, locator: Locator) {
  const box = (await locator.boundingBox())!;
  const session = await page.context().newCDPSession(page);
  const point = (fraction: number) => ({
    x: box.x + box.width * fraction,
    y: box.y + box.height * 0.35,
  });
  try {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [point(0.8)],
    });
    for (let step = 1; step <= 8; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [point(0.8 - step * 0.075)],
      });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          ),
      );
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await session.detach();
  }
}
