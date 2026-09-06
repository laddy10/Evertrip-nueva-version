import Hero from "@/components/sections/Hero";
import FleetShowcase from "@/components/sections/FleetShowcase";
import RoutesGrid from "@/components/sections/RoutesGrid";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import JsonLd from "@/components/JsonLd";
import InstagramGallery from "@/components/sections/InstagramGallery";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  return (
    <>
      <JsonLd locale={locale} />
      <Hero locale={locale} />
      <WhyChooseUs locale={locale} />
      <FleetShowcase locale={locale} />
      <RoutesGrid locale={locale} />
      <Testimonials locale={locale} />
      <InstagramGallery locale={locale} />
      <FAQ locale={locale} />
    </>
  );
}
