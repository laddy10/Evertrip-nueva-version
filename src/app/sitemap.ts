import type { MetadataRoute } from "next";
import { routes } from "@/data/routes";
import { locales } from "@/i18n/config";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import { legalSlugs } from "@/lib/legal";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/all-routes", "/tours"];
  const routePaths = routes.map((route) => `/${route.slug}`);
  const allPaths = [...staticPaths, ...routePaths];

  return locales.flatMap((locale) =>
    [...allPaths, ...legalSlugs].map((path) => ({
      url: localizedUrl(locale, path),
      changeFrequency: legalSlugs.some((slug) => slug === path) ? "yearly" as const : "weekly" as const,
      priority: legalSlugs.some((slug) => slug === path) ? 0.3 : path === "" ? 1 : 0.8,
      alternates: {
        languages: languageAlternates(path),
      },
    }))
  );
}
