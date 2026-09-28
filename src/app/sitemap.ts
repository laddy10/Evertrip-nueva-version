import type { MetadataRoute } from "next";
import { routes } from "@/data/routes";
import { locales } from "@/i18n/config";
import { languageAlternates, localizedUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/all-routes"];
  const routePaths = routes.map((route) => `/${route.slug}`);
  const allPaths = [...staticPaths, ...routePaths];

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
