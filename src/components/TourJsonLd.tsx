import type { Locale } from "@/i18n/config";
import type { TourExperience } from "@/data/tours";
import { BUSINESS_ID, localizedUrl, siteUrl } from "@/lib/seo";

export default function TourJsonLd({ locale, tour }: { locale: Locale; tour: TourExperience }) {
  const url = localizedUrl(locale, `tours/${tour.slug}`);
  const toursUrl = localizedUrl(locale, "tours");
  const homeUrl = localizedUrl(locale);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: tour.name[locale],
        description: tour.metaDescription[locale],
        serviceType: locale === "es" ? "Experiencia turística" : "Tour experience",
        url,
        provider: { "@id": BUSINESS_ID, "@type": "LocalBusiness", name: "VIAJES Y TOURS EVERTRIP", url: siteUrl() },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: locale === "es" ? "Inicio" : "Home", item: homeUrl },
          { "@type": "ListItem", position: 2, name: locale === "es" ? "Tours y experiencias" : "Tours and experiences", item: toursUrl },
          { "@type": "ListItem", position: 3, name: tour.name[locale], item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
