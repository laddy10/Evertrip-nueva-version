import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
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

      <h1 className="sr-only">{t.title}</h1>

      <div className="tours-story">
        {tours.map((tour, index) => {
          const images = tour.pageImages ?? tour.images;
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
              className={"tour-story-block" + (reverse ? " tour-story-block--reverse" : "") + (images.length === 0 ? " tour-story-block--text" : "")}
            >
              {tour.slug === "pasadia-cabo-de-la-vela" && (
                <span id="cabo-de-la-vela" className="tour-anchor-alias" aria-hidden="true" />
              )}
              <div className="tour-story-overview">
                <div className="tour-story-heading">
                  <p className="tour-story-category">{tour.category[locale]}</p>
                  <h2 id={tour.slug + "-title"}>{tour.name[locale]}</h2>
                  <p className="tour-story-intro">{tour.intro[locale]}</p>
                  <div className="tour-story-meta">
                    <span>{tour.location[locale]}</span>
                    {tour.duration && <span>{tour.duration[locale]}</span>}
                  </div>
                </div>
                {images[0] && (
                  <div className="tour-story-hero-image">
                    <Image
                      src={images[0].src}
                      alt={images[0].alt[locale]}
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
                  {images.length > 1 ? (
                    <div className={"tour-story-gallery" + (tour.slug === "avistamiento-flamencos-tarde-rancheria" ? " tour-story-gallery--portraits" : "")}>
                      {images.slice(1).map((image) => (
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
    </div>
  );
}
