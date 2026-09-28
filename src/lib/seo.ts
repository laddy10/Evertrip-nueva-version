import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/i18n/config";

export const SITE_ORIGIN = "https://evertrip.co";

/** Asset/file URLs keep their extension; page URLs use localizedUrl below. */
export function siteUrl(path = "/"): string {
  return new URL(path, `${SITE_ORIGIN}/`).href;
}

export function localizedPath(locale: Locale, path = ""): string {
  const segment = path.replace(/^\/+|\/+$/g, "");
  return `/${locale}/${segment ? `${segment}/` : ""}`;
}

export function localizedUrl(locale: Locale, path = ""): string {
  return siteUrl(localizedPath(locale, path));
}

export function languageAlternates(path = "") {
  return {
    es: localizedUrl("es", path),
    en: localizedUrl("en", path),
    "x-default": localizedUrl(defaultLocale, path),
  };
}

export const BUSINESS_ID = `${siteUrl()}#business`;

type PageMetadataOptions = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  indexable?: boolean;
};

export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image = "/assets/pilot/routes/private-route-01.webp",
  indexable = true,
}: PageMetadataOptions): Metadata {
  const url = localizedUrl(locale, path);
  const images = [{ url: siteUrl(image), alt: title }];

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: {
      canonical: url,
      languages: indexable ? languageAlternates(path) : {},
    },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url,
      siteName: "EverTrip",
      locale: locale === "es" ? "es_CO" : "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
