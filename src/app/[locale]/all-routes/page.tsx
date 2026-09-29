import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import RouteDirectory from "@/components/experience/RouteDirectory";
import { routes, getRouteCardTitle } from "@/data/routes";

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
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = content[locale];

  return pageMetadata({
    locale,
    path: "all-routes",
    title: t.title,
    description: t.description,
    image: "/assets/pilot/routes/palomino-01.webp",
  });
}

export default async function AllRoutesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const routeSummaries = routes.map((route) => ({
    slug: route.slug,
    title: getRouteCardTitle(route, locale),
    duration: route.duration[locale],
  }));

  return <RouteDirectory locale={locale} routes={routeSummaries} />;
}
