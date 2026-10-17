import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { tours } from "@/data/tours";

const content = {
  es: {
    title: "Tours y experiencias en el Caribe colombiano | EverTrip",
    description: "Explora experiencias de naturaleza, cultura y aventura con EverTrip: Río Don Diego, Los Flamencos, ranchería Wayuu y Cabo de la Vela.",
    eyebrow: "Tours & experiencias",
    heading: "Hay lugares que se recorren. Otros se viven.",
    copy: "Descubre experiencias seleccionadas del Caribe colombiano. La disponibilidad, cotización y detalles se coordinan directamente con nuestro equipo.",
    cta: "Conocer experiencia",
  },
  en: {
    title: "Tours and experiences in the Colombian Caribbean | EverTrip",
    description: "Explore nature, culture and adventure experiences with EverTrip: Don Diego River, the Flamingo Sanctuary, Wayuu culture and Cabo de la Vela.",
    eyebrow: "Tours & experiences",
    heading: "Some places are travelled. Others are experienced.",
    copy: "Discover selected experiences across the Colombian Caribbean. Availability, quotes and details are coordinated directly with our team.",
    cta: "Explore experience",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = content[locale];
  return pageMetadata({ locale, path: "tours", title: t.title, description: t.description, image: "/assets/logo2-normal-ui.png" });
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const t = content[locale];
  return (
    <div className="tour-directory-page">
      <header className="tour-directory-hero">
        <p className="chapter-caption">{t.eyebrow}</p>
        <h1>{t.heading}</h1>
        <p>{t.copy}</p>
      </header>
      <section className="tour-directory-list" aria-label={t.eyebrow}>
        {tours.map((tour, index) => (
          <Link key={tour.slug} href={`/${locale}/tours/${tour.slug}`} className="tour-directory-item">
            <span className="tour-directory-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span>{tour.category[locale]}</span>
              <h2>{tour.name[locale]}</h2>
              <p>{tour.intro[locale]}</p>
              <small>{tour.location[locale]}{tour.duration ? ` · ${tour.duration[locale]}` : ""}</small>
            </div>
            <span className="tour-directory-cta">{t.cta}<ArrowUpRight size={19} aria-hidden="true" /></span>
          </Link>
        ))}
      </section>
    </div>
  );
}
