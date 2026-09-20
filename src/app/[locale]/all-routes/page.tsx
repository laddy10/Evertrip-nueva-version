import type { Metadata } from "next";
import { locales, isLocale, defaultLocale, type Locale } from "@/i18n/config";
import RouteDirectory from "@/components/experience/RouteDirectory";

const content = {
  es: {
    title: "Todas las rutas de transporte privado | EverTrip",
    description:
      "Todas las rutas de traslado privado puerta a puerta por la costa Caribe colombiana: Barranquilla, Santa Marta, Cartagena, Palomino y Valledupar.",
    heading: "Todas las rutas",
    subtitle: "Elige tu ruta y cotiza tu traslado privado por WhatsApp.",
    from: "Desde",
    quote: "Cotizar",
  },
  en: {
    title: "All Private Transfer Routes | EverTrip",
    description:
      "All private door-to-door transfer routes across the Colombian Caribbean coast: Barranquilla, Santa Marta, Cartagena, Palomino and Valledupar.",
    heading: "All Routes",
    subtitle:
      "Choose your route and get a quote for your private transfer on WhatsApp.",
    from: "From",
    quote: "Get a quote",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = content[locale];

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `/${locale}/all-routes`,
      languages: {
        es: "/es/all-routes",
        en: "/en/all-routes",
        "x-default": "/es/all-routes",
      },
    },
  };
}

export default async function AllRoutesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  return <RouteDirectory locale={locale} />;
}
