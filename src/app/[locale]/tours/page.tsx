import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { tours } from "@/data/tours";
import TourJsonLd from "@/components/TourJsonLd";

const content = {
  es: {
    title: "Tours y experiencias en el Caribe colombiano | EverTrip",
    description: "Explora experiencias de naturaleza, cultura y aventura con EverTrip: Río Don Diego, Los Flamencos, ranchería Wayuu y Cabo de la Vela.",
    eyebrow: "Tours & experiencias",
    heading: "El Caribe también se vive.",
    copy: "Experiencias seleccionadas entre naturaleza, cultura y aventura. Conoce cada actividad y conversa con nuestro equipo para coordinar disponibilidad, detalles y cotización.",
    navLabel: "Explora las experiencias",
    explore: "Ver experiencia",
    story: "La experiencia",
    moments: "Lo que vivirás",
    quote: "Consultar por WhatsApp",
    note: "Los detalles operativos de cada experiencia se coordinan directamente con nuestro equipo.",
    noImage: "Una experiencia que se descubre en el camino.",
  },
  en: {
    title: "Tours and experiences in the Colombian Caribbean | EverTrip",
    description: "Explore nature, culture and adventure experiences with EverTrip: Don Diego River, the Flamingo Sanctuary, Wayuu culture and Cabo de la Vela.",
    eyebrow: "Tours & experiences",
    heading: "The Caribbean is meant to be experienced.",
    copy: "Selected experiences across nature, culture and adventure. Discover each activity and talk to our team to coordinate availability, details and a quote.",
    navLabel: "Explore the experiences",
    explore: "View experience",
    story: "The experience",
    moments: "What you’ll experience",
    quote: "Ask on WhatsApp",
    note: "Operational details for each experience are coordinated directly with our team.",
    noImage: "An experience revealed along the journey.",
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
  return pageMetadata({
    locale,
    path: "tours",
    title: t.title,
    description: t.description,
    image: "/assets/logo2-normal-ui.png",
  });
}

export default async function ToursPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const es = locale === "es";
  const t = content[locale];

  return (
    <div className="tours-landing">
      <TourJsonLd locale={locale} />

      <header className="tours-landing-hero">
        <div className="tours-landing-hero-copy">
          <p className="chapter-caption">{t.eyebrow}</p>
          <h1>{t.heading}</h1>
        </div>
        <div className="tours-landing-hero-side">
          <p>{t.copy}</p>
          <a href="#experiencias" className="tours-scroll-link">
            {t.navLabel}<ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </header>

      <nav id="experiencias" className="tours-discovery" aria-label={t.navLabel}>
        {tours.map((tour, index) => {
          const preview = tour.images[tour.slug === "avistamiento-flamencos-tarde-rancheria" ? 1 : 0];

          return (
            <a className="tours-discovery-card" key={tour.slug} href={"#" + tour.slug} aria-labelledby={tour.slug + "-preview-title"}>
              <div className="tours-discovery-media">
                {preview ? (
                  <Image
                    src={preview.src}
                    alt={preview.alt[locale]}
                    fill
                    sizes="(max-width: 600px) 32vw, (max-width: 1440px) 29vw, 400px"
                    preload={index === 0}
                  />
                ) : (
                  <div className="tours-discovery-edition" aria-hidden="true">
                    <span>{tour.category[locale]}</span>
                    <p>{tour.name[locale]}</p>
                  </div>
                )}
              </div>
              <div className="tours-discovery-copy">
                <span className="tours-discovery-location">{tour.location[locale]}</span>
                <strong id={tour.slug + "-preview-title"}>{tour.name[locale]}</strong>
                <p>{tour.intro[locale]}</p>
                <span className="tours-discovery-link">{t.explore}<ArrowUpRight size={17} aria-hidden="true" /></span>
              </div>
            </a>
          );
        })}
      </nav>

      <div className="tours-story">
        {tours.map((tour, index) => {
          const whatsapp = getWhatsAppLink(
            es
              ? "Hola Evertrip, estoy interesado en " + tour.name.es + ". Quisiera consultar disponibilidad, detalles y cotización."
              : "Hi Evertrip, I’m interested in " + tour.name.en + ". I’d like to ask about availability, details and a quote.",
          );
          const reverse = index % 2 === 1;

          return (
            <article
              key={tour.slug}
              id={tour.slug}
              aria-labelledby={tour.slug + "-title"}
              className={"tour-story-block" + (reverse ? " tour-story-block--reverse" : "") + (tour.images.length === 0 ? " tour-story-block--text" : "")}
            >
              <div className="tour-story-overview">
                <div className="tour-story-heading">
                  <p className="tour-story-category">{tour.category[locale]}</p>
                  <h2 id={tour.slug + "-title"}>{tour.name[locale]}</h2>
                  <p className="tour-story-intro">{tour.intro[locale]}</p>
                  <div className="tour-story-meta">
                    <span>{tour.location[locale]}</span>
                    {tour.duration && <span>{tour.duration[locale]}</span>}
                  </div>
                  <a className="tour-story-enquire" href={whatsapp} target="_blank" rel="noopener noreferrer">
                    {t.quote}<ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                </div>
                {tour.images[0] && (
                  <div className="tour-story-hero-image">
                    <Image
                      src={tour.images[0].src}
                      alt={tour.images[0].alt[locale]}
                      fill
                      sizes="(max-width: 900px) 90vw, (max-width: 1440px) 44vw, 620px"
                    />
                  </div>
                )}
              </div>

              <div className="tour-story-content">
                <div className="tour-story-description">
                  <h3>{t.story}</h3>
                  <p>{tour.description[locale]}</p>
                  {tour.images.length > 1 ? (
                    <div className={"tour-story-gallery" + (tour.slug === "avistamiento-flamencos-tarde-rancheria" ? " tour-story-gallery--portraits" : "")}>
                      {tour.images.slice(1).map((image) => (
                        <div className="tour-story-gallery-image" key={image.src}>
                          <Image src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 600px) 44vw, (max-width: 900px) 30vw, 24vw" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="tour-story-note">{t.noImage}</p>
                  )}
                </div>
                <div>
                  <div className="tour-story-highlights">
                    <h3>{t.moments}</h3>
                    <ol>
                      {tour.highlights[locale].map((highlight, highlightIndex) => (
                        <li key={highlight}>
                          <span aria-hidden="true">{String(highlightIndex + 1).padStart(2, "0")}</span>
                          <p>{highlight}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="tour-story-cta">
                    <p>{t.note}</p>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={19} aria-hidden="true" />
                      {t.quote}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="tours-closing">
        <p>{es ? "EverTrip · Caribe colombiano" : "EverTrip · Colombian Caribbean"}</p>
        <h2>{es ? "Tu próximo viaje puede empezar con una conversación." : "Your next journey can start with a conversation."}</h2>
        <Link href={"/" + locale + "/#tours"}>
          {es ? "Volver a EverTrip" : "Back to EverTrip"}<ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
