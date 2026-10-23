import type { Locale } from "@/i18n/config";
import { faqsByLocale } from "@/data/faq";
import { BUSINESS_ID, siteUrl } from "@/lib/seo";

const businessDescription = {
  es: "Traslados privados puerta a puerta y experiencias turísticas por el Caribe colombiano. Reserva y cotización por WhatsApp para viajeros, familias y grupos.",
  en: "Private door-to-door transfers and tour experiences across Colombia's Caribbean region. WhatsApp booking and quotes for travelers, families and groups.",
};

export default function JsonLd({ locale }: { locale: Locale }) {
  const organization = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: "VIAJES Y TOURS EVERTRIP",
        alternateName: "Evertrip",
        url: siteUrl(),
        telephone: "+573147659756",
        description: businessDescription[locale],
        logo: {
          "@type": "ImageObject",
          url: siteUrl("/assets/logo2-normal-ui.png"),
        },
        image: [
          siteUrl("/assets/pilot/routes/private-route-01.webp"),
          siteUrl("/assets/lugares/real-group-transfer.jpg"),
        ],
        sameAs: [
          "https://www.instagram.com/evertripviajesytours/",
          "https://www.google.com/maps/search/?api=1&query=Evertrip&query_place_id=ChIJHzbjopH19I4RBmesdbLr950",
        ],
        areaServed: [
          { "@type": "City", name: "Barranquilla" },
          { "@type": "City", name: "Santa Marta" },
          { "@type": "City", name: "Cartagena" },
          { "@type": "Place", name: "Palomino" },
          { "@type": "Place", name: "Tayrona" },
          { "@type": "Place", name: "Minca" },
          { "@type": "City", name: "Valledupar" },
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
