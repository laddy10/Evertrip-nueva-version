import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RoutePageTemplate from "@/components/RoutePageTemplate";
import RouteJsonLd from "@/components/RouteJsonLd";
import { routes, getRouteBySlug, getPriceCards } from "@/data/routes";
import { locales, isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => routes.map((route) => ({ locale, slug: route.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  return pageMetadata({
    locale,
    path: slug,
    title: route.title[locale],
    description: route.metaDescription[locale],
    image: route.image2 || route.image,
  });
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const priceCards = getPriceCards(route);
  const relatedRoutes = routes
    .filter((r) => r.slug !== route.slug)
    .slice(0, 4)
    .map((r) => ({ label: r.h1[locale], slug: r.slug }));

  return (
    <>
      <RouteJsonLd locale={locale} route={route} priceCards={priceCards} />
      <RoutePageTemplate locale={locale} route={route} priceCards={priceCards} relatedRoutes={relatedRoutes} />
    </>
  );
}
