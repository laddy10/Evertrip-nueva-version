import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

// Check the exported artifacts, not just the metadata helper's return values.
// Pin the acceptance target independently: importing SITE_ORIGIN would let an
// accidental change to the application domain change the expected result too.
const origin = "https://evertripviajes.com";
const businessId = `${origin}/#business`;
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
  .flatMap((match) => {
    const data = JSON.parse(match[1]);
    return data["@graph"] || data;
  });
const visibleText = (html) => html
  .replace(/<(?:script|style)\b[^>]*>.*?<\/(?:script|style)>/gs, "")
  .replace(/<[^>]*>/g, "")
  .replace(/&(?:amp|quot|#x27);/g, (entity) => ({ "&amp;": "&", "&quot;": '"', "&#x27;": "'" }[entity]));

// Catch stale hosts even when they are encoded inside JS/RSC, URLs or HTML.
const normalizedDomainText = (value) => value
  .replace(/\\u([\da-f]{4})|\\x([\da-f]{2})|%([\da-f]{2})|&#x([\da-f]+);/gi,
    (_, unicode, hex, percent, entity) => String.fromCharCode(parseInt(unicode || hex || percent || entity, 16)))
  .replace(/&#(\d+);/g, (_, entity) => String.fromCharCode(Number(entity)))
  .replace(/&period;/gi, ".");
const hasLegacyDomain = (value) => /\b(?:[\w-]+\.)*evertrip\.co\b/i.test(normalizedDomainText(value));
for (const stale of ["https://evertrip.co", "https://WWW.EVERTRIP.CO/es/", String.raw`evertrip\u002eco`, "evertrip%2Eco", "evertrip&#46;co"]) {
  assert(hasLegacyDomain(stale), "Legacy-domain guard must detect literal and encoded hosts");
}
assert(!hasLegacyDomain(origin), "The production domain must not be rejected");

const assertSiteUrl = (value, label) => {
  assert.equal(new URL(value).origin, origin, `${label}: expected production domain`);
};
const assertStructuredData = (value, label) => {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertStructuredData(item, `${label}[${index}]`));
    return;
  }
  if ([value["@type"]].flat().includes("LocalBusiness")) {
    assert.equal(value["@id"], businessId, `${label}: LocalBusiness must use the stable production ID`);
  }
  for (const [key, child] of Object.entries(value)) {
    // sameAs and @context deliberately retain their external social/schema URLs.
    if (["@id", "url", "item", "image", "logo"].includes(key)) {
      for (const reference of [child].flat()) {
        if (typeof reference === "string") assertSiteUrl(reference, `${label}.${key}`);
      }
    }
    assertStructuredData(child, `${label}.${key}`);
  }
};

// Scan the whole deployable text output, including Next's RSC payloads and JS,
// so an old host cannot survive outside the commercial and legal HTML documents.
const exportedTextFiles = readdirSync("out", { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.(?:html?|txt|xml|json|js|mjs|css|map|svg|webmanifest|htaccess)$/i.test(entry.name))
  .map((entry) => path.join(entry.parentPath, entry.name));
for (const file of exportedTextFiles) {
  const text = read(file);
  assert(!hasLegacyDomain(text), `${file}: legacy domain in generated output`);
  if (!file.endsWith(".html")) continue;
  for (const tag of canonical(text)) assertSiteUrl(tag.href, `${file}: canonical`);
  for (const tag of tags(text, "link").filter((tag) => tag.rel === "alternate" && tag.hreflang)) {
    assertSiteUrl(tag.href, `${file}: hreflang ${tag.hreflang}`);
  }
  for (const tag of tags(text, "meta")) {
    if (["og:url", "og:image", "og:image:url", "og:image:secure_url", "twitter:image", "twitter:image:src"].includes(tag.property || tag.name)) {
      assertSiteUrl(tag.content, `${file}: ${tag.property || tag.name}`);
    }
  }
  const nodes = graph(text);
  assert(nodes.filter((node) => [node["@type"]].flat().includes("LocalBusiness")).length <= 1, `${file}: duplicate LocalBusiness definitions`);
  assertStructuredData(nodes, `${file}: JSON-LD`);
}

const slugs = [...read("src/data/routes.ts").matchAll(/\bslug:\s*"([^"]+)"/g)]
  .map((match) => match[1]);
const tourSlugs = [...read("src/data/tours.ts").matchAll(/\bslug:\s*"([^"]+)"/g)]
  .map((match) => match[1]);
assert.equal(slugs.length, 23, "Phase 1 must retain the 23 existing route definitions");
assert.equal(new Set(slugs).size, slugs.length, "Duplicate route slug");
assert.equal(tourSlugs.length, 3, "Tours launch must retain the three confirmed tour definitions");
assert.equal(new Set(tourSlugs).size, tourSlugs.length, "Duplicate tour slug");
const tourPaths = ["tours"];
const legalPaths = ["privacy-policy", "terms-and-conditions"];
const paths = ["", "all-routes", ...slugs, ...tourPaths, ...legalPaths];
// Independent acceptance URLs: do not import the application's mapping.
const legalSpanishPaths = { "privacy-policy": "politica-privacidad", "terms-and-conditions": "terminos-condiciones" };
const pagePath = (locale, slug) => {
  const segment = locale === "es" ? legalSpanishPaths[slug] || slug : slug;
  return `/${locale}/${segment ? `${segment}/` : ""}`;
};
const expected = ["es", "en"].flatMap((locale) => paths.map((slug) => origin + pagePath(locale, slug))).sort();
const sitemap = read("out/sitemap.xml");
const entries = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].map((match) => match[1]);
assert.deepEqual(entries.map((entry) => entry.match(/<loc>(.*?)<\/loc>/)[1]).sort(), expected);
assert.equal(expected.length, 56);
assert(!sitemap.includes("<lastmod>"), "Do not invent content modification dates");
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), "Sitemap XML namespace");
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), "Sitemap hreflang namespace");

const internalTargetCache = new Map();
function assertInternalLinks(html, url) {
  for (const tag of tags(html, "a")) {
    if (!tag.href) continue;
    const target = new URL(tag.href.replaceAll("&amp;", "&"), url);
    if (target.origin !== origin) continue;
    const pathname = decodeURIComponent(target.pathname);
    const page = pathname.endsWith("/");
    const file = `out${pathname}${page ? "index.html" : ""}`;
    assert(existsSync(file), `${url}: missing internal target ${tag.href}`);
    if (!page) {
      assert(!existsSync(`${file}/index.html`), `${url}: page link needs trailing slash: ${tag.href}`);
      continue;
    }
    if (!target.hash) continue;
    if (!internalTargetCache.has(file)) internalTargetCache.set(file, read(file));
    const id = decodeURIComponent(target.hash.slice(1));
    assert(internalTargetCache.get(file).includes(`id="${id}"`), `${url}: missing anchor ${tag.href}`);
  }
}

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
    for (const directive of [meta.robots, meta.googlebot, meta.bingbot]) {
      assert(!/\b(?:noindex|none|nofollow|nosnippet)\b|max-snippet:\s*0\b/i.test(directive || ""), `${url}: unexpected indexing/snippet restriction`);
    }
    assert.equal(tags(html, "h1").length, 1, `${url}: expected one primary heading`);
    assertInternalLinks(html, url);
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

    const footer = html.match(/<footer\b.*?<\/footer>/s)?.[0];
    assert(footer, `${url}: missing shared footer`);
    for (const legalPath of legalPaths) {
      assert(tags(footer, "a").some((tag) => tag.href === pagePath(locale, legalPath)), `${url}: missing localized legal footer link`);
    }
    assert(tags(footer, "a").some((tag) => tag.href === `${pagePath(locale, "terms-and-conditions")}#section-6`), `${url}: cancellation link must target the terms section`);

    if (legalPaths.includes(slug)) {
      const file = locale === "en" ? `${slug}.en.md` : slug === "privacy-policy" ? "politica-privacidad.md" : "terminos-condiciones.md";
      const source = read(`docs/legal/${file}`).replace(/\r\n/g, "\n");
      const sourceSections = source.split(/^## /m).slice(1);
      const article = html.match(/<article\b.*?<\/article>/s)?.[0];
      assert(article, `${url}: missing legal article`);
      const renderedSections = [...article.matchAll(/<section\b.*?<\/section>/gs)].map((match) => match[0]);
      assert.equal(renderedSections.length, slug === "privacy-policy" ? 13 : 19, `${url}: missing legal section`);
      const normalize = (value) => value.replace(/\s+/g, " ").trim();
      const plainHtml = (value) => normalize(value
        .replace(/<\/(?:h2|p|li|ul|section)>|<br\s*\/?\s*>/g, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/&(?:amp|quot|apos|lt|gt|#x27|#39);/g, (entity) => ({ "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">", "&#x27;": "'", "&#39;": "'" }[entity])));
      assert.deepEqual(renderedSections.map(plainHtml), sourceSections.map((section) => normalize(section.replace(/\*\*/g, "").replace(/^- /gm, ""))), `${url}: legal text differs from its source`);
      assert(!/COMPLETAR AL PUBLICAR|TO BE COMPLETED UPON PUBLICATION/.test(html), `${url}: unfinished publication date is visible`);
      assert.equal(tags(html, "h1").length, 1, `${url}: expected one document heading`);
      assert(article.includes('id="section-6"'), `${url}: missing stable section anchor`);
    }

    const nodes = graph(html);
    const mainText = visibleText(html.match(/<main\b.*?<\/main>/s)?.[0] || "");
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
      assert.equal(service["@id"], `${url}#service`);
      assert(service.name && service.serviceType && service.areaServed, `${url}: missing service identity or location`);
      assert.equal(service.serviceType, locale === "es" ? "Transporte terrestre privado" : "Private ground transportation");
      if (Array.isArray(service.areaServed)) {
        for (const place of service.areaServed) {
          assert(place.name && mainText.includes(place.name), `${url}: service area must also appear in the page`);
        }
      }
      assert.equal(service.url, url);
      assert.equal(service.provider["@id"], businessId);
      assert.equal(service.provider.url, `${origin}/`);
    } else if (slug === "tours") {
      const itemList = nodes.find((node) => node["@type"] === "ItemList");
      assert(itemList, `${url}: expected tours ItemList JSON-LD`);
      assert.equal(itemList.itemListElement.length, 3, `${url}: expected three confirmed tour services`);
      for (const item of itemList.itemListElement) {
        assert.equal(item.item["@type"], "Service");
        assert.equal(item.item.provider["@id"], businessId);
        assert(item.item.url.startsWith(url + "#"), `${url}: tour service URL must use an in-page anchor`);
        assert(html.includes(`id="${new URL(item.item.url).hash.slice(1)}"`), `${url}: missing tour anchor`);
        assert(item.item.areaServed && mainText.includes(item.item.areaServed), `${url}: tour location must also be visible`);
      }
      const breadcrumb = nodes.find((node) => node["@type"] === "BreadcrumbList");
      assert.deepEqual(
        breadcrumb.itemListElement.map((item) => item.item),
        [origin + pagePath(locale, ""), url],
      );
    } else if (!slug) {
      const businesses = nodes.filter((node) => [node["@type"]].flat().includes("LocalBusiness"));
      assert.equal(businesses.length, 1, `${url}: expected exactly one LocalBusiness definition`);
      const business = businesses[0];
      assert.equal(business["@id"], businessId);
      assert.equal(business.url, `${origin}/`);
      assert.equal(business.telephone, "+573147659756");
      assert(!business.priceRange, `${url}: do not invent a business-wide price category`);
      const faq = nodes.find((node) => node["@type"] === "FAQPage");
      // Existing FAQ markup is retained only while it describes the visible FAQ.
      for (const question of faq?.mainEntity || []) {
        assert(mainText.includes(question.name) && mainText.includes(question.acceptedAnswer.text), `${url}: FAQ schema must match visible answers`);
      }
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
for (const slug of legalPaths) {
  assert(!existsSync(`out/es/${slug}/index.html`), "Do not export duplicate English-slug legal pages in Spanish");
  assert(!existsSync(`out/en/${legalSpanishPaths[slug]}/index.html`), "Do not export Spanish-slug legal pages in English");
}
for (const slug of tourSlugs) {
  assert(!existsSync(`out/es/tours/${slug}/index.html`), "Tour details must remain consolidated in /es/tours/");
  assert(!existsSync(`out/en/tours/${slug}/index.html`), "Tour details must remain consolidated in /en/tours/");
}
const robots = read("out/robots.txt");
assert(robots.includes("Allow: /"));
assert(!/^Disallow:[ \t]*\S+/mi.test(robots), "Unexpected crawl-blocking rule");
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
assert.deepEqual([...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gm)].map((match) => match[1]), [`${origin}/sitemap.xml`]);
console.log(`Production domain verified: ${origin}; ${exportedTextFiles.length} exported text files checked; stable entity ${businessId}.`);
console.log("Static SEO verification passed: 52 commercial URLs, 4 legal pages with source-content integrity and footer links verified, 46 route pages, 2 tour directories with 3 embedded tour services, 2 functional QR exports, root fallback and 404 artifact.");
console.log("Production HTTP redirects and 404 status still require hosting verification.");
