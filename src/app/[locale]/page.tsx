import JsonLd from "@/components/JsonLd";
import CoastalOverture from "@/components/experience/CoastalOverture";
import DestinationAtlas from "@/components/experience/DestinationAtlas";
import FleetAtelier from "@/components/experience/FleetAtelier";
import TravelPromise from "@/components/experience/TravelPromise";
import TravelJournal from "@/components/experience/TravelJournal";
import TravelQuestions from "@/components/experience/TravelQuestions";
import { preload } from "react-dom";
import { routes } from "@/data/routes";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const routeSlugs = routes.map((route) => route.slug);
  const atlasDurations = Object.fromEntries(
    routes
      .filter((route) =>
        [
          "barranquilla-to-santa-marta",
          "private-transfer-santa-marta-cartagena",
          "santa-marta-to-palomino",
          "cartagena-to-barranquilla",
          "santa-marta-to-tayrona",
        ].includes(route.slug),
      )
      .map((route) => [route.slug, route.duration[locale]]),
  );

  preload("/assets/journey/evertrip-real-drive-poster.webp", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <div className="experience-home">
      <JsonLd locale={locale} />
      <CoastalOverture locale={locale} routeSlugs={routeSlugs} />
      <DestinationAtlas locale={locale} durations={atlasDurations} />
      <FleetAtelier locale={locale} />
      <TravelPromise locale={locale} />
      <TravelJournal locale={locale} />
      <TravelQuestions locale={locale} />
    </div>
  );
}
