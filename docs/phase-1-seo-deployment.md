# Phase 1 SEO: static routing and deployment

## Scope

The commercial inventory remains 50 URLs: two homepages, two directories and 23 routes in each language. No slug, commercial page, approved visual component, media file or route copy was changed. The QR metadata layout adds no URL. No Phase 2–4 work is included.

## Final routing model

- Production builds retain `output: "export"` and `trailingSlash: true`. Only the development-server phase omits `output`: Next 16.2.10's export-mode dev validator can throw a missing-static-param error before the app's 404 handling. Development instead honors the explicit `dynamicParams = false` and `notFound()` guards. This does not change the production export or add a runtime deployment requirement.
- Publish the complete contents of the newly generated `out/` directory.
- The pre-existing `out.zip` was not regenerated. Do not deploy that older archive as this build; deploy the fresh `out/` directory or package it again as part of the approved deployment.
- `/es/` and `/en/` are explicit static pages. There is no request-time language negotiation.
- `/` exports an immediate HTML meta refresh to `/es/`, a canonical to `https://evertrip.co/es/`, and a normal fallback link. It works without JavaScript. This is an HTML redirect, not an HTTP 301/308.
- `src/proxy.ts` was removed. Its Accept-Language redirects and blanket prefixing of unknown paths were unsupported in production static export. Development now follows the same explicit locale URLs, with Spanish as the root destination. Language switching on localized pages is unchanged.
- Locale and route segments use `dynamicParams = false`; invalid values also call `notFound()` instead of falling back to Spanish metadata.
- The generated `404.html` retains Next.js's existing error presentation and `noindex`. Static files cannot set their own HTTP response status.
- Review QR pages remain available at both existing URLs. They have self-canonicals, utility-specific metadata and `noindex, follow`, and are absent from the sitemap.
- Canonical, language alternate, sitemap, breadcrumb, service and business URLs use `src/lib/seo.ts`. Asset URLs retain their file extensions.
- Sitemap `lastmod` was removed because no reliable per-page modification dates are currently maintained. No dates were invented.

## Required hosting configuration

The hosting provider and active deployment configuration are not identified in the repository. No provider-specific rules have been deployed or assumed. Configure the following on the actual host/CDN:

1. Serve this build's `out/` as the document root. Do not use `next start` for an exported deployment; the existing package command is not a static file server.
2. Redirect HTTP and alternate hostnames (including `www`, if configured) permanently to `https://evertrip.co`, preserving the path and query. Confirm certificates and DNS for each hostname before activating those rules.
3. Prefer an exact-path HTTP 301 or 308 redirect from `/` to `https://evertrip.co/es/`. The exported HTML refresh is the fallback if the host cannot supply this rule. Do not apply this redirect to every path.
4. Resolve an existing page directory to its `index.html`. Permanently redirect slashless existing page URLs to the slash version, preserving query parameters. Do not append slashes to assets, `robots.txt` or `sitemap.xml`.
5. If direct `index.html` URLs are served, permanently normalize `/es/index.html` to `/es/` and the corresponding route aliases. Normalize `/index.html` to the chosen root destination.
6. For a missing path, return **HTTP 404** while serving `out/404.html` as the error body. Do not rewrite missing paths to `/`, `/es/` or `index.html` with a 200 response. This includes invalid locales, missing route slugs and unknown files. Do not enable a single-page-app catch-all fallback.
7. Preserve query strings such as `?pax=4`; they do not create new static pages. Metadata stays canonical to the clean URL.
8. Serve `robots.txt`, `sitemap.xml` and all `_next/`/asset files directly with suitable content types. Do not block the QR pages in robots.txt: crawlers must be able to read their `noindex`.

## Deployment acceptance checks

Run locally before uploading:

```sh
npm run build
npm run verify:seo
```

After deployment, verify real HTTP responses (the local artifact checker cannot validate hosting):

| Request | Required result |
| --- | --- |
| `/` | Prefer 301/308 to `/es/`; otherwise 200 containing the verified immediate HTML refresh and fallback |
| `/es/`, `/en/` | 200, self-canonical, reciprocal ES/EN and Spanish x-default |
| `/es` | Permanent redirect to `/es/` |
| `/es/private-transfer-santa-marta-cartagena/` | 200 with its own metadata and approved existing content |
| `/en/all-routes/` | 200 with all existing route links |
| `/es/review-qr/`, `/en/review-qr/` | 200, `noindex`, self-canonical; QR and printing still work |
| `/es/unknown-route/`, `/fr/`, `/fr/all-routes/`, `/unknown/path/` | HTTP 404, not a 200 homepage |
| `/sitemap.xml` | 200 XML; exactly 50 commercial URLs, each ending in `/`; no utility/error pages or fabricated dates |
| `/robots.txt` | 200 plain text with the canonical sitemap URL |

Also verify root navigation with JavaScript disabled, both language links, passenger query handling, and QR printing. Run the existing visual/interaction checks on the static deployment when hosting access is available.

## Local validation completed

- Production build and TypeScript passed on Next.js 16.2.10; 57 generated build entries include metadata/error artifacts, not 57 commercial URLs.
- `npm run verify:seo` passed for all 50 commercial URLs, 46 route pages and both QR utilities. Canonicals, reciprocal hreflang, Spanish x-default, social metadata, local social-image files, schema URLs, sitemap and robots were checked in `out/`.
- The commercial URL set was compared with the pre-change sitemap after slash normalization: 50 before, 50 after, identical paths.
- On the local development server, `/`, `/es/` and `/en/` returned 200; `/es/unknown-route/`, `/fr/`, `/fr/all-routes/` and `/unknown/path/` returned 404 after the development-phase configuration fix.
- Chromium confirmed the exported root refresh works with JavaScript disabled and both localized homepages render.
- Chromium loaded both QR pages at 1440px and 390px, verified the QR image, and confirmed the print button calls `window.print` after logo decoding. The OS print dialog was stubbed; no physical print job was sent.
- The exported site's language switch preserved the route and `?pax=5`; the destination canonical omitted the query as intended.
- Targeted ESLint and `git diff --check` passed. Existing visual component/CSS files, QR page implementation, route data and approved assets were not edited. Changes in the localized page/layout files are metadata and routing guards; the root alone gained its necessary redirect fallback link.
- No production deployment or hosting verification was performed. HTTP redirect and error status rules above remain deployment acceptance requirements.

## Hero video audit only

`CoastalOverture.tsx` is unchanged. The desktop MP4 is 51,368,986 bytes; the mobile MP4 is 6,321,695 bytes. The existing 1600×900 poster is 174,492 bytes.

The video uses `autoPlay`, `muted`, `playsInline` and `preload="auto"`. Playback is paused when hidden or offscreen, and JavaScript loops the existing 0–8 second segment. That loop does not limit the encoded file length or guarantee a maximum download size.

`preload="auto"` is a browser hint, not a strict prerequisite for autoplay. Autoplay can itself cause media fetching. Changing preload therefore does not guarantee a saving and could change startup/seek behavior; it is not a zero-risk correction. No preload, footage, encoding, poster, loop, animation or autoplay change is included in Phase 1.

For a separately approved performance pass: measure actual mobile/desktop transfer and LCP; verify CDN caching and byte-range support; test poster priority and preload alternatives; evaluate an encoded derivative of the same approved segment with equivalent visual quality. Recompression/replacement requires approval and playback regression checks.
