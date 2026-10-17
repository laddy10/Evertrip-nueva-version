import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { tours, getTourBySlug } from "@/data/tours";
import { getWhatsAppLink } from "@/lib/whatsapp";
import TourJsonLd from "@/components/TourJsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => tours.map((tour) => ({ locale, slug: tour.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();
  return pageMetadata({
    locale,
    path: `tours/${tour.slug}`,
    title: `${tour.name[locale]} | EverTrip`,
    description: tour.metaDescription[locale],
    image: "/assets/logo2-normal-ui.png",
  });
}

export default async function TourDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();
  const es = locale === "es";
  const whatsapp = getWhatsAppLink(
    es
      ? `Hola Evertrip, estoy interesado en ${tour.name.es}. Quisiera consultar disponibilidad, detalles y cotización.`
      : `Hi Evertrip, I’m interested in ${tour.name.en}. I’d like to ask about availability, details and a quote.`,
  );

  return (
    <>
      <TourJsonLd locale={locale} tour={tour} />
      <article className="tour-detail">
        <header className="tour-detail-hero">
          <Link href={`/${locale}/tours`} className="tour-back-link"><ArrowLeft size={17} aria-hidden="true" />{es ? "Todas las experiencias" : "All experiences"}</Link>
          <p className="chapter-caption">{tour.category[locale]}</p>
          <h1>{tour.name[locale]}</h1>
          <p className="tour-detail-intro">{tour.intro[locale]}</p>
          <div className="tour-detail-meta">
            <span>{tour.location[locale]}</span>
            {tour.duration && <span>{tour.duration[locale]}</span>}
          </div>
        </header>
        <section className="tour-detail-content">
          <div className="tour-detail-story">
            <span>{es ? "La experiencia" : "The experience"}</span>
            <p>{tour.description[locale]}</p>
          </div>
          <div className="tour-detail-highlights">
            <span>{es ? "Lo que vivirás" : "What you’ll experience"}</span>
            <ol>
              {tour.highlights[locale].map((highlight, index) => (
                <li key={highlight}><span>{String(index + 1).padStart(2, "0")}</span><p>{highlight}</p></li>
              ))}
            </ol>
          </div>
        </section>
        <section className="tour-detail-contact">
          <div>
            <p className="chapter-caption">{es ? "Hablemos de tu experiencia" : "Let’s plan your experience"}</p>
            <h2>{es ? "La disponibilidad y los detalles se coordinan contigo." : "Availability and details are coordinated with you."}</h2>
            <p>{es ? "Escríbenos por WhatsApp para consultar esta actividad y recibir una cotización según tu caso." : "Message us on WhatsApp to ask about this experience and receive a quote for your trip."}</p>
          </div>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">{es ? "Consultar por WhatsApp" : "Ask on WhatsApp"}<ArrowUpRight size={22} aria-hidden="true" /></a>
        </section>
      </article>
    </>
  );
}
