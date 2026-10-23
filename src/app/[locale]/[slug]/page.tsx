import { notFound } from "next/navigation";
import type { Metadata } from "next";
import RoutePageTemplate from "@/components/RoutePageTemplate";
import RouteJsonLd from "@/components/RouteJsonLd";
import { routes, getRouteBySlug, getPriceCards } from "@/data/routes";
import { locales, isLocale } from "@/i18n/config";
import { legalKeyForPath, legalPaths, pageMetadata } from "@/lib/seo";
import { getRelatedRoutes } from "@/lib/routeRelationships";
import LegalDocument from "@/components/legal/LegalDocument";
import { legalMetadata, legalSlugs } from "@/lib/legal";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...routes.map((route) => ({ locale, slug: route.slug })),
    ...legalSlugs.map((key) => ({ locale, slug: legalPaths[key][locale] })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const legalKey = legalKeyForPath(locale, slug);
  if (legalKey) return legalMetadata(locale, legalKey);
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
  const legalKey = legalKeyForPath(locale, slug);
  if (legalKey) return <LegalDocument locale={locale} slug={legalKey} />;
  const route = getRouteBySlug(slug);
  if (!route) notFound();

  const priceCards = getPriceCards(route);
  const relatedRoutes = getRelatedRoutes(route.slug).map((relatedRoute) => ({
    label: relatedRoute.h1[locale],
    slug: relatedRoute.slug,
  }));

  return (
    <>
      <RouteJsonLd locale={locale} route={route} priceCards={priceCards} />
      <RoutePageTemplate locale={locale} route={route} priceCards={priceCards} relatedRoutes={relatedRoutes} />
    </>
  );
}
