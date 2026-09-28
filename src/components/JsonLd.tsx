import type { Locale } from "@/i18n/config";
import { faqsByLocale } from "@/data/faq";
import { BUSINESS_ID, siteUrl } from "@/lib/seo";

const businessDescription = {
  es: "Traslados privados puerta a puerta por la costa Caribe colombiana. Recogida en aeropuerto, reserva por WhatsApp, vans cómodas para familias y grupos.",
  en: "Private door-to-door transfers across Colombia's Caribbean coast. Airport pickup, WhatsApp booking, comfortable vans for families and groups.",
};

export default function JsonLd({ locale }: { locale: Locale }) {
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "TaxiService"],
        "@id": BUSINESS_ID,
        name: "VIAJES Y TOURS EVERTRIP",
        url: siteUrl(),
        telephone: "+573147659756",
        priceRange: "$$",
        description: businessDescription[locale],
        areaServed: [
          { "@type": "City", name: "Barranquilla" },
          { "@type": "City", name: "Santa Marta" },
          { "@type": "City", name: "Cartagena" },
          { "@type": "Place", name: "Palomino" },
          { "@type": "Place", name: "Tayrona" },
          { "@type": "Place", name: "Minca" },
          { "@type": "Place", name: "Riohacha" },
          { "@type": "Place", name: "Cabo de la Vela" },
          { "@type": "Place", name: "Valledupar" },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+573147659756",
          contactType: "customer service",
          availableLanguage: ["Spanish", "English"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqsByLocale[locale].map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
