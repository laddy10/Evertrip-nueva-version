import JsonLd from "@/components/JsonLd";
import CoastalOverture from "@/components/experience/CoastalOverture";
import DestinationAtlas from "@/components/experience/DestinationAtlas";
import FleetAtelier from "@/components/experience/FleetAtelier";
import TravelPromise from "@/components/experience/TravelPromise";
import TravelJournal from "@/components/experience/TravelJournal";
import TravelQuestions from "@/components/experience/TravelQuestions";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <div className="experience-home">
      <JsonLd locale={locale} />
      <CoastalOverture locale={locale} />
      <DestinationAtlas locale={locale} />
      <FleetAtelier locale={locale} />
      <TravelPromise locale={locale} />
      <TravelJournal locale={locale} />
      <TravelQuestions locale={locale} />
    </div>
  );
}
