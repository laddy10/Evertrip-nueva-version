import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// Check the exported artifacts, not just the metadata helper's return values.
const origin = "https://evertrip.co";
const read = (file) => readFileSync(file, "utf8");
const attributes = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), match[2]]),
);
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))]
  .map((match) => attributes(match[0]));
const metadata = (html) => Object.fromEntries(tags(html, "meta")
  .map((tag) => [tag.name || tag.property || tag["http-equiv"], tag.content]));
const canonical = (html) => tags(html, "link").filter((tag) => tag.rel === "canonical");
const alternates = (html) => Object.fromEntries(tags(html, "link")
  .filter((tag) => tag.rel === "alternate" && tag.hreflang)
  .map((tag) => [tag.hreflang, tag.href]));
const graph = (html) => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
  .flatMap((match) => JSON.parse(match[1])["@graph"] || []);

const slugs = [...read("src/data/routes.ts").matchAll(/\bslug:\s*"([^"]+)"/g)]
  .map((match) => match[1]);
assert.equal(slugs.length, 23, "Phase 1 must retain the 23 existing route definitions");
assert.equal(new Set(slugs).size, slugs.length, "Duplicate route slug");
const paths = ["", "all-routes", ...slugs];
const pagePath = (locale, slug) => `/${locale}/${slug ? `${slug}/` : ""}`;
const expected = ["es", "en"].flatMap((locale) => paths.map((slug) => origin + pagePath(locale, slug))).sort();
const sitemap = read("out/sitemap.xml");
const entries = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].map((match) => match[1]);
assert.deepEqual(entries.map((entry) => entry.match(/<loc>(.*?)<\/loc>/)[1]).sort(), expected);
assert.equal(expected.length, 50);
assert(!sitemap.includes("<lastmod>"), "Do not invent content modification dates");

for (const locale of ["es", "en"]) {
  for (const slug of paths) {
    const pathname = pagePath(locale, slug);
    const url = origin + pathname;
    const html = read(`out${pathname}index.html`);
    const meta = metadata(html);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const languages = { es: origin + pagePath("es", slug), en: origin + pagePath("en", slug), "x-default": origin + pagePath("es", slug) };
    assert(html.includes(`<html lang="${locale}"`), `${url}: wrong HTML language`);
    assert.deepEqual(canonical(html).map((tag) => tag.href), [url], `${url}: canonical`);
    assert.deepEqual(alternates(html), languages, `${url}: hreflang`);
    assert(!meta.robots?.includes("noindex"), `${url}: commercial page must remain indexable`);
    assert(title && meta.description, `${url}: missing title/description`);
    for (const prefix of ["og", "twitter"]) {
      assert.equal(meta[`${prefix}:title`], title, `${url}: ${prefix} title`);
      assert.equal(meta[`${prefix}:description`], meta.description, `${url}: ${prefix} description`);
      const image = new URL(meta[`${prefix}:image`]);
      assert.equal(image.origin, origin);
      assert(existsSync(`public${image.pathname}`), `${url}: missing approved social image`);
    }
    assert.equal(meta["og:url"], url);
    assert.equal(meta["og:site_name"], "EverTrip");
    assert.equal(meta["og:locale"], locale === "es" ? "es_CO" : "en_US");
    const entry = entries.find((value) => value.includes(`<loc>${url}</loc>`));
    const sitemapLanguages = Object.fromEntries(tags(entry, "xhtml:link")
      .map((tag) => [tag.hreflang, tag.href]));
    assert.deepEqual(sitemapLanguages, languages, `${url}: sitemap alternates`);

    const nodes = graph(html);
    assert(!nodes.some((node) => ["Review", "AggregateRating"].includes(node["@type"])));
    if (slugs.includes(slug)) {
      const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
      assert.deepEqual(
        breadcrumb.itemListElement.map((item) => item.item),
        [origin + pagePath(locale, ""), origin + pagePath(locale, "all-routes"), url],
      );
      const routeLinks = [...html.matchAll(new RegExp(`href="/${locale}/([^"/?#]+)/"`, "g"))]
        .map((match) => match[1])
        .filter((linkedSlug) => slugs.includes(linkedSlug) && linkedSlug !== slug);
      assert(
        new Set(routeLinks).size >= 4,
        `${url}: expected at least four crawlable related-route links`,
      );
      const service = nodes.find((node) => node["@type"] === "Service");
      assert.equal(service.url, url);
      assert.equal(service.provider["@id"], `${origin}/#business`);
      assert.equal(service.provider.url, `${origin}/`);
    } else if (!slug) {
      const business = nodes.find((node) => node["@id"] === `${origin}/#business`);
      assert.equal(business.url, `${origin}/`);
    }
  }
  const utilityPath = pagePath(locale, "review-qr");
  const html = read(`out${utilityPath}index.html`);
  assert.match(metadata(html).robots, /noindex/);
  assert.deepEqual(canonical(html).map((tag) => tag.href), [origin + utilityPath]);
  assert.deepEqual(alternates(html), {}, "Utility must not inherit homepage language URLs");
  assert(html.includes("/assets/review_qr.png") && html.includes("Imprimir Aviso"));
  assert(!expected.includes(origin + utilityPath));

  const actualPaths = readdirSync(`out/${locale}`, { recursive: true })
    .filter((file) => file === "index.html" || file.endsWith(`${path.sep}index.html`))
    .map((file) => `/${locale}/${file.replaceAll(path.sep, "/").replace(/index\.html$/, "")}`)
    .sort();
  assert.deepEqual(actualPaths, [...paths, "review-qr"].map((slug) => pagePath(locale, slug)).sort(), "Exported page inventory changed");
}

const root = read("out/index.html");
assert.match(metadata(root).refresh, /^0;\s*url=\/es\/$/);
assert(root.includes('href="/es/"'), "Root needs a usable no-JavaScript fallback link");
assert.deepEqual(canonical(root).map((tag) => tag.href), [`${origin}/es/`]);
assert(!root.includes("NEXT_REDIRECT"), "Root must not depend on a client redirect exception");
assert.match(metadata(read("out/404.html")).robots, /noindex/);
assert(!existsSync("out/fr/index.html"));
assert(!existsSync("out/es/unknown-route/index.html"));
const robots = read("out/robots.txt");
assert(robots.includes("Allow: /"));
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
console.log("Static SEO verification passed: 50 commercial URLs, 46 route pages, 2 functional QR exports, root fallback and 404 artifact.");
console.log("Production HTTP redirects and 404 status still require hosting verification.");
