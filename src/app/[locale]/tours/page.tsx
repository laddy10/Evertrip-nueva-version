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

      <nav className="tours-anchor-nav" aria-label={t.navLabel}>
        {tours.map((tour, index) => (
          <a key={tour.slug} href={"#" + tour.slug}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {tour.name[locale]}
          </a>
        ))}
      </nav>

      <main id="experiencias" className="tours-story">
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
              className={"tour-story-block" + (reverse ? " tour-story-block--reverse" : "")}
            >
              <div className="tour-story-heading">
                <span className="tour-story-index">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="tour-story-category">{tour.category[locale]}</p>
                  <h2>{tour.name[locale]}</h2>
                  <p className="tour-story-intro">{tour.intro[locale]}</p>
                  <div className="tour-story-meta">
                    <span>{tour.location[locale]}</span>
                    {tour.duration && <span>{tour.duration[locale]}</span>}
                  </div>
                </div>
              </div>

              <div className="tour-story-visual">
                {tour.images.length > 0 ? (
                  <>
                    <div className="tour-story-hero-image">
                      <Image
                        src={tour.images[0].src}
                        alt={tour.images[0].alt[locale]}
                        fill
                        sizes="(max-width: 900px) 100vw, 58vw"
                        priority={index === 0}
                      />
                    </div>
                    {tour.images[1] && (
                      <div className="tour-story-secondary-image">
                        <Image
                          src={tour.images[1].src}
                          alt={tour.images[1].alt[locale]}
                          fill
                          sizes="(max-width: 900px) 46vw, 21vw"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="tour-story-placeholder" aria-hidden="true">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{t.noImage}</p>
                  </div>
                )}
              </div>

              <div className="tour-story-content">
                <div className="tour-story-description">
                  <span>{t.story}</span>
                  <p>{tour.description[locale]}</p>
                </div>
                <div className="tour-story-highlights">
                  <span>{t.moments}</span>
                  <ol>
                    {tour.highlights[locale].map((highlight, highlightIndex) => (
                      <li key={highlight}>
                        <span>{String(highlightIndex + 1).padStart(2, "0")}</span>
                        <p>{highlight}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {tour.images[2] && (
                <div className="tour-story-gallery">
                  {tour.images.slice(2, 4).map((image) => (
                    <div className="tour-story-gallery-image" key={image.src}>
                      <Image src={image.src} alt={image.alt[locale]} fill sizes="(max-width: 700px) 100vw, 38vw" />
                    </div>
                  ))}
                </div>
              )}

              <div className="tour-story-cta">
                <p>{t.note}</p>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={19} aria-hidden="true" />
                  {t.quote}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </main>

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
