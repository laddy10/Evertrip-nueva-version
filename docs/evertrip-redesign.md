# Evertrip — The road is the thread

## Delivered direction

The website is now a continuous coastal journal, extending through the homepage, all-routes directory, destination pages, quote calculator, navigation, and footer. Existing Outfit and Inter fonts remain part of the brand and are bundled locally with their licenses.

Three deliberate visual moments define the experience:

1. An oversized Caribbean title over the existing Evertrip-branded coastal film. Scroll advances the entire filmed scene, including the vehicle, road contact, shadows, scenery, and foreground. No separate vehicle cutout is composited over destination photographs.
2. A deep-green destination atlas with oversized place names, arched landscape imagery, and links to real routes.
3. A full-size fleet showroom with the original vehicle photographs, interior/exterior controls, actual capacities, touch gestures, enlarged galleries, and vehicle-specific WhatsApp links.

Curved shorelines, a fine route line, a consistent type scale, and the green/salt palette connect these moments to the pickup–journey–arrival story, traveler voices, Instagram, FAQs, and oversized Evertrip signature.

## Preserved business and conversion flows

- All 23 route definitions and their bilingual content, descriptions, durations, highlights, and FAQs.
- Existing quote-only behavior; no invented prices.
- Standard SUV 1–4, Business Van 5–10, Group Van 11–17, Executive Bus 18–30.
- Nissan Kicks, Renault Duster, Mercedes Vito, Hyundai H1, and Executive Bus galleries.
- Pickup/destination selection, passenger selection, passenger query parameters, language switching, and WhatsApp number 573147659756.
- Airport, custom-route, and corporate transportation conversion paths.
- Existing testimonials, Instagram feed, YouTube film, structured data, sitemap, metadata, and printable review page.
- Footer policy links previously pointed to absent pages. They now request the relevant policy through the existing WhatsApp number; no legal text was invented.

## Media and accessibility

The scroll sequence uses a 7.45 MB VP9 WebM derivative of the existing White_van_driving_coastal_highway_202607061555.mp4. Its 1920×1080 WebP fallback is extracted from the same film at 0.2 seconds. This is an existing illustrative brand film, not an assertion that it documents the precise Santa Marta–Palomino road. No new image or video generation was used.

The film is fetched as a local blob so scrubbing also works on static hosts without Range support. Failed or unsupported video retains the still image. Reduced-motion users receive the still composition without fetching the film. The YouTube player is loaded only after activation.

Booking uses a native dialog with labeled controls, validation, Escape handling, and focus restoration. Fleet dialogs retain keyboard navigation and focus restoration. Mobile photo swipes change the view; deliberate taps enlarge it. Pages were checked at 320, 390, 768, and 1440 pixels, with no document-wide horizontal overflow.

## Verification

- Production build passed: 57 static pages generated.
- TypeScript, targeted ESLint, and git diff whitespace checks passed.
- All 18 Chromium browser tests passed on the static export, including desktop/mobile galleries, touch and keyboard input, forward/reverse film seeking, ES/EN booking, passenger category changes, WhatsApp handoff, invalid-route feedback, reduced motion, and route discovery.
- Export visual review caught a UTF-8 BOM that invalidated the palette declaration when CSS was concatenated. The source encoding was corrected and the site rebuilt. Nine homepage/journey/booking tests passed again, including added production color checks.
- Final screenshots were visually reviewed on the production preview, including the fleet, footer, and reduced-motion mobile opening.

The existing static-export configuration still warns that server middleware is disabled on static hosts. The exported ES/EN pages and client-side booking paths were verified without it.

Local production preview: http://localhost:3002/es/ and http://localhost:3002/en/. The site has not been deployed externally.

## Comparison with the previous version

The previous opening used a conventional destination photograph, headline, and large inline form. Fleet vehicles and destinations read as separate components. The replacement changes the opening composition, the role of typography, the vehicle interaction, route discovery, booking presentation, and transitions throughout the site. The large coastal title, complete moving vehicle scene, green destination atlas, and studio-scale vehicle photographs make the new creative direction immediately visible.

Before/after captures are in the ignored test-results directory: evertrip-desktop.png versus evertrip-final-opening.png, evertrip-final-atlas.png, and evertrip-final-fleet.png. The source design plan is in art-direction.md.

## Time and estimated API budget

This final continuation took approximately 20 minutes, using the first verification capture at 2026-09-20 02:14 UTC and final checks around 02:34 UTC. It followed earlier implementation and design passes. Total active generation time across all interrupted turns was not instrumented, so the elapsed time between sessions should not be presented as uninterrupted work.

Actual billed tokens, cache usage, service tier, and session charges are unavailable. An illustrative budget for the accumulated design and implementation work is **US$8–$30**, not a measured bill:

| Assumed token category | Assumed volume | Standard rate per million | Estimated cost |
| --- | ---: | ---: | ---: |
| Uncached input | 200,000–400,000 | $10 | $2–$4 |
| Cached input | 3–6 million | $1 | $3–$6 |
| Output, including reasoning | 60,000–100,000 | $50 | $3–$5 |

These assumptions give $8–$15 at Standard rates or $16–$30 at the documented 2× Fast rates. The token volumes are budgeting assumptions, not observed telemetry. Cache writes, long-context rates, and separately billed tools can change the total.

Rates were checked against the [official GPT-6 Astra model documentation](https://developers.openai.com/api/docs/models/gpt-6-astra). The requested “GPT-6 Astra · Ultra” banner is a showcase credit, not a billing meter.
