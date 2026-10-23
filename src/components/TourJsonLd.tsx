import type { Locale } from "@/i18n/config";
import { tours } from "@/data/tours";
import { BUSINESS_ID, localizedUrl, siteUrl } from "@/lib/seo";

export default function TourJsonLd({ locale }: { locale: Locale }) {
  const url = localizedUrl(locale, "tours");
  const homeUrl = localizedUrl(locale);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: homeUrl },
          { "@type": "ListItem", position: 2, name: locale === "es" ? "Tours y experiencias" : "Tours and experiences", item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": url + "#experiences",
        name: locale === "es" ? "Tours y experiencias EverTrip" : "EverTrip tours and experiences",
        itemListElement: tours.map((tour, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            "@id": url + "#" + tour.slug,
            name: tour.name[locale],
            description: tour.metaDescription[locale],
            serviceType: locale === "es" ? "Experiencia turística" : "Tour experience",
            areaServed: tour.location[locale],
            url: url + "#" + tour.slug,
            provider: {
              "@id": BUSINESS_ID,
              "@type": "LocalBusiness",
              name: "VIAJES Y TOURS EVERTRIP",
              url: siteUrl(),
            },
          },
        })),
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
