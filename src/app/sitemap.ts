import type { MetadataRoute } from "next";
import { routes } from "@/data/routes";
import { tours } from "@/data/tours";
import { locales } from "@/i18n/config";
import { languageAlternates, localizedUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/all-routes", "/tours"];
  const routePaths = routes.map((route) => `/${route.slug}`);
  const tourPaths = tours.map((tour) => `/tours/${tour.slug}`);
  const allPaths = [...staticPaths, ...routePaths, ...tourPaths];

  return locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: localizedUrl(locale, path),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: languageAlternates(path),
      },
    }))
  );
}
