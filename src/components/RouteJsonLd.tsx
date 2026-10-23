import type { Locale } from "@/i18n/config";
import type { RouteDefinition, PriceCard } from "@/data/routes";
import { BUSINESS_ID, localizedUrl, siteUrl } from "@/lib/seo";
import { routeRelationshipMetadata } from "@/lib/routeRelationships";

function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export default function RouteJsonLd({
  locale,
  route,
  priceCards,
}: {
  locale: Locale;
  route: RouteDefinition;
  priceCards: PriceCard[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "es" ? "Inicio" : "Home",
          item: localizedUrl(locale),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "es" ? "Todas las rutas" : "All Routes",
          item: localizedUrl(locale, "all-routes"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: route.title[locale],
          item: localizedUrl(locale, route.slug),
        },
      ],
    },
    {
      "@type": "Service",
      "@id": `${localizedUrl(locale, route.slug)}#service`,
      name: route.h1[locale],
      url: localizedUrl(locale, route.slug),
      serviceType: locale === "es" ? "Transporte terrestre privado" : "Private ground transportation",
      provider: {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        url: siteUrl(),
        name: "VIAJES Y TOURS EVERTRIP",
        telephone: "+573147659756",
      },
      areaServed: routeRelationshipMetadata[route.slug]?.locations.length
        ? routeRelationshipMetadata[route.slug].locations.map((name) => ({ "@type": "Place", name }))
        : locale === "es" ? "Caribe colombiano" : "Colombian Caribbean",
      description: route.metaDescription[locale],
      ...(priceCards.length > 0 && {
        offers: priceCards.map((card) => ({
          "@type": "Offer",
          price: parsePriceToNumber(card.price),
          priceCurrency: "COP",
          description: card.label[locale],
        })),
      }),
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
